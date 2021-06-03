import p5Types from 'p5';
import { Constructor, MixinArgs } from '../utils/Mixin';
import { AchievementVoice, GetVoice } from './Helper';
import { Drawable } from './Renderer';
import { Howl } from 'howler';
import { GameStateUsable } from './GameStateUsable';
import GameAchievement from '../GameAchievement';

export type AchievementVoicePlayable = Constructor<{
  p5Setup(p5: p5Types, canvasParentRef: Element): void,
  p5Draw(p5: p5Types): void,
  ConfigureAchievementVoicePlayable(volume: number): void,
}>;

export default function AchievementVoicePlayable<TBase extends Drawable & GameStateUsable>(Base: TBase): TBase & AchievementVoicePlayable {
  return class AchievementVoicePlayable extends Base {
    #achievementQueue: GameAchievement[];
    #sounds: Map<AchievementVoice, Howl>;
    #volume: number;

    constructor(...args: MixinArgs) {
      super(...args);
      this.#achievementQueue = [];
      this.#sounds = new Map<AchievementVoice, Howl>();
      this.#volume = 0.5;
    }

    ConfigureAchievementVoicePlayable(volume: number): void {
      this.#volume = volume;
      if (this.State === null) {
        console.error('ConfigureAchievementVoicePlayable called before this.State is assigned. Beware of the call order of Configure_ functions.');
        return;
      }
      this.State.Achievement.on((achievement) => this.#achievementQueue.push(achievement));
    }

    p5Setup(p5: p5Types, canvasParentRef: Element): void {
      super.p5Setup(p5, canvasParentRef);
      Object.entries(AchievementVoice).forEach(([, value]) => this.#sounds.set(
        value,
        new Howl({
          src: [value],
          volume: this.#volume,
        }),
      ));
    }

    p5Draw(p5: p5Types): void {
      super.p5Draw(p5);
      while (this.#achievementQueue.length > 0) {
        const result = this.#achievementQueue.shift();
        if (!result) break;
        const voice = GetVoice(result);
        if (!voice) continue;
        this.#sounds.get(voice)?.play();
      }
    }
  };
}