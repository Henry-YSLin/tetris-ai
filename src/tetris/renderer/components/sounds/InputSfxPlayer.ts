import { Howl } from 'howler';
import Game from '../../../game/Game';
import GameInputResult from '../../../GameInputResult';
import Player from '../../../player/Player';
import Inject from '../../dependencyInjection/InjectDecorator';
import { GetSFX, InputSFX } from '../../Helper';
import LocalConfiguration from '../../LocalConfiguration';
import Component from '../Component';

export default class InputSfxPlayer extends Component {
  protected game: Game = null!;

  protected player: Player = null!;

  protected localConfig: LocalConfiguration = null!;

  #sounds: Map<InputSFX, Howl> = new Map();

  #lastInput: GameInputResult | null = null;

  @Inject(Game, Player, LocalConfiguration)
  private loadPlayerSfxPlayer(game: Game, player: Player, localConfig: LocalConfiguration): void {
    this.game = game;
    this.player = player;
    this.localConfig = localConfig;
  }

  protected override preSetup(): void {
    Object.entries(InputSFX).forEach(([, value]) =>
      this.#sounds.set(
        value,
        new Howl({
          src: [value],
          volume: this.localConfig.SoundVolume,
        })
      )
    );

    this.game.Input.On(result => {
      if (result.Player !== this.player) return;
      const last = this.#lastInput;
      this.#lastInput = result ?? null;
      if (last) {
        if (result.Success === last.Success && result.Input === last.Input) {
          return;
        }
      }
      const sfx = GetSFX(result);
      if (!sfx) return;
      this.#sounds.get(sfx)?.play();
    });
  }
}
