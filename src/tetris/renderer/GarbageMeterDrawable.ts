import p5Types from 'p5';
import { TetrominoType } from '../Tetrominos';
import { Constructor } from '../utils/Mixin';
import Vector from '../utils/Vector';
import { BlockSizeConfigurable } from './BlockSizeConfigurable';
import { MultiGameStateUsable } from './MultiGameStateUsable';
import { TetrominoColor } from './Helper';
import { Drawable } from './Renderer';

export type GarbageMeterDrawable = Constructor<{
  p5Draw(p5: p5Types): void,
  ConfigureGarbageMeterDrawable(offset: Vector, scale: Vector): void
}>;

export default function GarbageMeterDrawable<TBase extends Drawable & MultiGameStateUsable & BlockSizeConfigurable>(Base: TBase): TBase & GarbageMeterDrawable {
  return class GarbageMeterDrawable extends Base {
    #offset: Vector;
    #scale: Vector;

    constructor(...args: any[]) {
      super(...args);
      this.#offset = new Vector(0, 0);
      this.#scale = new Vector(1, 1);
    }

    ConfigureGarbageMeterDrawable(offset: Vector, scale: Vector): void {
      this.#offset = offset;
      this.#scale = scale;
    }

    p5Draw(p5: p5Types): void {
      super.p5Draw(p5);
      if (this.State === null) return;
      this.SetTransform(p5, this.#scale.X, this.#scale.Y, this.#offset.X, this.#offset.Y);

      const state = this.State;
      const blockSize = this.BlockSize;
      p5.fill(50);
      p5.rect(0, 0, blockSize, blockSize * state.PlayfieldHeight);
      p5.fill(TetrominoColor(p5, TetrominoType.Garbage));
      let meterHeight = state.GarbageMeter.reduce((prev, curr) => prev + curr.Lines, 0);
      if (meterHeight > state.PlayfieldHeight) {
        meterHeight = state.PlayfieldHeight;
        p5.fill('red');
      }
      for (let i = 0; i < meterHeight; i++) {
        p5.rect(0, i * blockSize, blockSize, blockSize);
      }
    }
  };
}