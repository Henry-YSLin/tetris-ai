import p5Types from 'p5';
import { Howl } from 'howler';
import { Constructor } from '../utils/Mixin';
import { GameEventVoice, GetVoice } from './Helper';
import { Drawable } from './Renderer';
import { GameStateUsable } from './GameStateUsable';

export type GameEventVoicePlayable = Constructor<{
  p5Setup(p5: p5Types, canvasParentRef: Element): void;
  ConfigureGameEventVoicePlayable(volume: number): void;
}>;

export default function GameEventVoicePlayable<TBase extends Drawable & GameStateUsable>(
  base: TBase
): TBase & GameEventVoicePlayable {
  return class GameEventVoicePlayable extends base {
    #sounds: Map<GameEventVoice, Howl>;

    #volume: number;

    constructor(...args: any[]) {
      super(...args);
      this.#sounds = new Map<GameEventVoice, Howl>();
      this.#volume = 0.5;
    }

    ConfigureGameEventVoicePlayable(volume: number): void {
      this.#volume = volume;
      if (this.State === null) {
        console.error(
          'ConfigureGameEventVoicePlayable called before this.State is assigned. Beware of the call order of Configure_ functions.'
        );
        return;
      }
      this.State.Achievement.On(achievement => {
        const voice = GetVoice(achievement);
        if (!voice) return;
        this.#sounds.get(voice)?.play();
      });
    }

    p5Setup(p5: p5Types, canvasParentRef: Element): void {
      super.p5Setup(p5, canvasParentRef);
      Object.entries(GameEventVoice).forEach(([, value]) =>
        this.#sounds.set(
          value,
          new Howl({
            src: [value],
            volume: this.#volume,
          })
        )
      );
    }
  };
}
