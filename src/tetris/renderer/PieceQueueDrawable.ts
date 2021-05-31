import p5Types from 'p5';
import Tetrominos from '../Tetrominos';
import { Constructor, MixinArgs } from '../utils/Mixin';
import Vector from '../utils/Vector';
import { BlockSizeConfigurable } from './BlockSizeConfigurable';
import { DrawTetromino } from './Helper';
import { Drawable } from './Renderer';

export type PieceQueueDrawable = Constructor<{
  p5Draw(p5: p5Types): void,
  ConfigurePieceQueueDrawable(offset: Vector, scale: Vector): void
}>;

export default function PieceQueueDrawable<TBase extends Drawable & BlockSizeConfigurable>(Base: TBase): TBase & PieceQueueDrawable {
  return class PieceQueueDrawable extends Base {
    #offset: Vector;
    #scale: Vector;

    constructor(...args: MixinArgs) {
      super(...args);
      this.#offset = new Vector(0, 0);
      this.#scale = new Vector(1, 1);
    }

    ConfigurePieceQueueDrawable(offset: Vector, scale: Vector): void {
      this.#offset = offset;
      this.#scale = scale;
    }

    p5Draw(p5: p5Types): void {
      super.p5Draw(p5);
      this.SetTransform(p5, this.#scale.X, this.#scale.Y, this.#offset.X, this.#offset.Y);

      const state = this.State;
      const blockSize = this.BlockSize;
      const {length} = state.PieceQueue;
      for (let i = 0; i < length; i++) {
        const points = Tetrominos[state.PieceQueue[i]].Rotations[0].slice();
        DrawTetromino(p5, state.PieceQueue[i], new Vector(0, this.height - (i + 1) * blockSize * 4), points, blockSize, 255);
      }
    }
  };
}