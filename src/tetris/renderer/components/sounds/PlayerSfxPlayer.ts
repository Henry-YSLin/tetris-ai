import { Howl } from 'howler';
import { DAS_INTERVAL } from '../../../Consts';
import Game from '../../../game/Game';
import GameInputResult from '../../../GameInputResult';
import Player from '../../../player/Player';
import Inject from '../../dependencyInjection/InjectDecorator';
import { GetSFX, InputSFX } from '../../Helper';
import RenderConfiguration from '../../RenderConfiguration';
import Component from '../Component';

export default class PlayerSfxPlayer extends Component {
  protected game: Game = null!;

  protected player: Player = null!;

  protected renderConfig: RenderConfiguration = null!;

  #sounds: Map<InputSFX, Howl> = new Map();

  #lastInput: GameInputResult | null = null;

  @Inject(Game, Player, RenderConfiguration)
  private loadPlayerSfxPlayer(game: Game, player: Player, renderConfig: RenderConfiguration): void {
    this.game = game;
    this.player = player;
    this.renderConfig = renderConfig;
  }

  protected override preSetup(): void {
    Object.entries(InputSFX).forEach(([, value]) =>
      this.#sounds.set(
        value,
        new Howl({
          src: [value],
          volume: this.renderConfig.SoundVolume,
        })
      )
    );

    this.game.Input.On(result => {
      if (result.Player !== this.player) return;
      const last = this.#lastInput;
      this.#lastInput = result ?? null;
      if (last) {
        if (
          result.Tick - last.Tick <= DAS_INTERVAL + 1 &&
          result.Success === last.Success &&
          result.Input === last.Input
        ) {
          return;
        }
      }
      const sfx = GetSFX(result);
      if (!sfx) return;
      this.#sounds.get(sfx)?.play();
    });
  }
}
