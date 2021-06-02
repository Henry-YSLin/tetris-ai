import p5Types from 'p5';
import { GameInputResult } from '../GameInput';
import { Constructor, MixinArgs } from '../utils/Mixin';
import { GameUsable } from './GameUsable';
import { InputSFX, GetSFX } from './Helper';
import { Drawable } from './Renderer';
import { Howl } from 'howler';
import { DAS_INTERVAL } from '../Consts';

export type PlayerSoundPlayable = Constructor<{
  p5Setup(p5: p5Types, canvasParentRef: Element): void,
  p5Draw(p5: p5Types): void,
  ConfigurePlayerSoundPlayable(): void,
}>;

export default function PlayerSoundPlayable<TBase extends Drawable & GameUsable>(Base: TBase): TBase & PlayerSoundPlayable {
  return class PlayerSoundPlayable extends Base {
    #inputQueue: GameInputResult[];
    #lastInput: GameInputResult | null;
    #sounds: Map<InputSFX, Howl>;

    constructor(...args: MixinArgs) {
      super(...args);
      this.#inputQueue = [];
      this.#sounds = new Map<InputSFX, Howl>();
      this.#lastInput = null;
    }

    ConfigurePlayerSoundPlayable(): void {
      if (this.Game === null) {
        console.error('ConfigurePlayerSoundPlayable called before this.Game is assigned. Beware of the call order of Configure_ functions.');
        return;
      }
      this.Game.Input.on((result) => this.#inputQueue.push(result));
    }

    p5Setup(p5: p5Types, canvasParentRef: Element): void {
      super.p5Setup(p5, canvasParentRef);
      Object.entries(InputSFX).forEach(([, value]) => this.#sounds.set(
        value,
        new Howl({
          src: [value],
        }),
      ));
    }

    p5Draw(p5: p5Types): void {
      super.p5Draw(p5);
      while (this.#inputQueue.length > 0) {
        const result = this.#inputQueue.shift();
        const last = this.#lastInput;
        this.#lastInput = result ?? null;
        if (!result) break;
        if (last) {
          if (
            result.Tick - last.Tick <= DAS_INTERVAL + 1
            && result.Success === last.Success
            && result.Input === last.Input
          ) {
            continue;
          }
        }
        const sfx = GetSFX(result);
        if (!sfx) continue;
        this.#sounds.get(sfx)?.play();
      }
    }
  };
}