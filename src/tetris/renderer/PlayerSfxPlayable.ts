import p5Types from 'p5';
import { GameInputResult } from '../GameInput';
import { Constructor, MixinArgs } from '../utils/Mixin';
import { GameUsable } from './GameUsable';
import { InputSFX, GetSFX } from './Helper';
import { Drawable } from './Renderer';
import { Howl } from 'howler';
import { DAS_INTERVAL } from '../Consts';

export type PlayerSfxPlayable = Constructor<{
  p5Setup(p5: p5Types, canvasParentRef: Element): void,
  ConfigurePlayerSfxPlayable(volume: number): void,
}>;

export default function PlayerSfxPlayable<TBase extends Drawable & GameUsable>(Base: TBase): TBase & PlayerSfxPlayable {
  return class PlayerSfxPlayable extends Base {
    #lastInput: GameInputResult | null;
    #sounds: Map<InputSFX, Howl>;
    #volume: number;

    constructor(...args: MixinArgs) {
      super(...args);
      this.#sounds = new Map<InputSFX, Howl>();
      this.#lastInput = null;
      this.#volume = 0.5;
    }

    ConfigurePlayerSfxPlayable(volume: number): void {
      this.#volume = volume;
      if (this.Game === null) {
        console.error('ConfigurePlayerSfxPlayable called before this.Game is assigned. Beware of the call order of Configure_ functions.');
        return;
      }
      this.Game.Input.on((result) => {
        const last = this.#lastInput;
        this.#lastInput = result ?? null;
        if (last) {
          if (
            result.Tick - last.Tick <= DAS_INTERVAL + 1
            && result.Success === last.Success
            && result.Input === last.Input
          ) {
            return;
          }
        }
        const sfx = GetSFX(result);
        if (!sfx) return;
        this.#sounds.get(sfx)?.play();
      });
    }

    p5Setup(p5: p5Types, canvasParentRef: Element): void {
      super.p5Setup(p5, canvasParentRef);
      Object.entries(InputSFX).forEach(([, value]) => this.#sounds.set(
        value,
        new Howl({
          src: [value],
          volume: this.#volume,
        }),
      ));
    }
  };
}