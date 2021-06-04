import p5Types from 'p5';
import { Constructor, MixinArgs } from '../utils/Mixin';
import { GetSFX, GameEventSFX } from './Helper';
import { Drawable } from './Renderer';
import { Howl } from 'howler';
import { GameStateUsable } from './GameStateUsable';

export type GameEventSfxPlayable = Constructor<{
  p5Setup(p5: p5Types, canvasParentRef: Element): void,
  ConfigureGameEventSfxPlayable(volume: number): void,
}>;

export default function GameEventSfxPlayable<TBase extends Drawable & GameStateUsable>(Base: TBase): TBase & GameEventSfxPlayable {
  return class GameEventSfxPlayable extends Base {
    #sounds: Map<GameEventSFX, Howl>;
    #volume: number;

    constructor(...args: MixinArgs) {
      super(...args);
      this.#sounds = new Map<GameEventSFX, Howl>();
      this.#volume = 0.5;
    }

    ConfigureGameEventSfxPlayable(volume: number): void {
      this.#volume = volume;
      if (this.State === null) {
        console.error('ConfigureGameEventSfxPlayable called before this.State is assigned. Beware of the call order of Configure_ functions.');
        return;
      }
      this.State.Achievement.on((achievement) => {
        console.log(achievement);
        const sfx = GetSFX(achievement);
        if (!sfx) return;
        sfx.forEach(s => this.#sounds.get(s)?.play());
      });
      this.State.Dead.on(() => {
        this.#sounds.get(GameEventSFX.GameOver)?.play();
      });
    }

    p5Setup(p5: p5Types, canvasParentRef: Element): void {
      super.p5Setup(p5, canvasParentRef);
      Object.entries(GameEventSFX).forEach(([, value]) => this.#sounds.set(
        value,
        new Howl({
          src: [value],
          volume: this.#volume,
        }),
      ));
    }
  };
}