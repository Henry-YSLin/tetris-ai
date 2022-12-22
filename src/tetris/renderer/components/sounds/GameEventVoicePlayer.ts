import { Howl } from 'howler';
import GameState from '../../../gameState/GameState';
import Inject from '../../dependencyInjection/InjectDecorator';
import { GameEventVoice, GetVoice } from '../../Helper';
import RenderConfiguration from '../../RenderConfiguration';
import Component from '../Component';

export default class GameEventVoicePlayer extends Component {
  protected gameState: GameState = null!;

  protected renderConfig: RenderConfiguration = null!;

  #sounds: Map<GameEventVoice, Howl> = new Map();

  @Inject(GameState, RenderConfiguration)
  private loadGameEventSfxPlayer(gameState: GameState, renderConfig: RenderConfiguration): void {
    this.gameState = gameState;
    this.renderConfig = renderConfig;
  }

  protected override preSetup(): void {
    Object.entries(GameEventVoice).forEach(([, value]) =>
      this.#sounds.set(
        value,
        new Howl({
          src: [value],
          volume: this.renderConfig.SoundVolume,
        })
      )
    );

    this.gameState.Achievement.On(achievement => {
      const voice = GetVoice(achievement);
      if (!voice) return;
      this.#sounds.get(voice)?.play();
    });
  }
}
