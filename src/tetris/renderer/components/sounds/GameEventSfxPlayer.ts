import { Howl } from 'howler';
import GameState from '../../../gameState/GameState';
import Inject from '../../dependencyInjection/InjectDecorator';
import { GameEventSFX, GetSFX } from '../../Helper';
import LocalConfiguration from '../../LocalConfiguration';
import Component from '../Component';

export default class GameEventSfxPlayer extends Component {
  protected gameState: GameState = null!;

  protected localConfig: LocalConfiguration = null!;

  #sounds: Map<GameEventSFX, Howl> = new Map();

  @Inject(GameState, LocalConfiguration)
  private loadGameEventSfxPlayer(gameState: GameState, localConfig: LocalConfiguration): void {
    this.gameState = gameState;
    this.localConfig = localConfig;
  }

  protected override preSetup(): void {
    Object.entries(GameEventSFX).forEach(([, value]) =>
      this.#sounds.set(
        value,
        new Howl({
          src: [value],
          volume: this.localConfig.SoundVolume,
        })
      )
    );

    this.gameState.Achievement.On(achievement => {
      const sfx = GetSFX(achievement);
      if (!sfx) return;
      sfx.forEach(s => this.#sounds.get(s)?.play());
    });
    this.gameState.Dead.On(() => {
      this.#sounds.get(GameEventSFX.GameOver)?.play();
    });
  }
}
