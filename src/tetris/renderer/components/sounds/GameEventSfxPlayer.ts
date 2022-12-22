import { Howl } from 'howler';
import GameState from '../../../GameState';
import Inject from '../../dependencyInjection/InjectDecorator';
import { GameEventSFX, GetSFX } from '../../Helper';
import RenderConfiguration from '../../RenderConfiguration';
import Component from '../Component';

export default class GameEventSfxPlayer extends Component {
  protected gameState: GameState = null!;

  protected renderConfig: RenderConfiguration = null!;

  #sounds: Map<GameEventSFX, Howl> = new Map();

  @Inject(GameState, RenderConfiguration)
  private loadGameEventSfxPlayer(gameState: GameState, renderConfig: RenderConfiguration): void {
    this.gameState = gameState;
    this.renderConfig = renderConfig;
  }

  protected override preSetup(): void {
    Object.entries(GameEventSFX).forEach(([, value]) =>
      this.#sounds.set(
        value,
        new Howl({
          src: [value],
          volume: this.renderConfig.SoundVolume,
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
