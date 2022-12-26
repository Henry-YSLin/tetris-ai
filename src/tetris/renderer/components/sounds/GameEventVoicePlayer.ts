import { Howl } from 'howler';
import GameState from '../../../gameState/GameState';
import Inject from '../../dependencyInjection/InjectDecorator';
import { GameEventVoice, GetVoice } from '../../Helper';
import LocalConfiguration from '../../LocalConfiguration';
import Component from '../Component';

export default class GameEventVoicePlayer extends Component {
  protected gameState: GameState = null!;

  protected localConfig: LocalConfiguration = null!;

  #sounds: Map<GameEventVoice, Howl> = new Map();

  @Inject(GameState, LocalConfiguration)
  private loadGameEventSfxPlayer(gameState: GameState, localConfig: LocalConfiguration): void {
    this.gameState = gameState;
    this.localConfig = localConfig;
  }

  protected override preSetup(): void {
    Object.entries(GameEventVoice).forEach(([, value]) =>
      this.#sounds.set(
        value,
        new Howl({
          src: [value],
          volume: this.localConfig.SoundVolume,
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
