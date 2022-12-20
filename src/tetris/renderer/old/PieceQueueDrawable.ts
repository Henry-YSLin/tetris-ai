import p5Types from 'p5';
import Tetrominos from '../Tetrominos';
import { Constructor } from '../utils/Mixin';
import Vector from '../utils/Vector';
import { BlockSizeConfigurable } from './BlockSizeConfigurable';
import { GameStateUsable } from './GameStateUsable';
import { DrawTetromino } from './Helper';
import { Drawable } from './Renderer';
import '../utils/Array';

export type PieceQueueDrawable = Constructor<{
  p5Draw(p5: p5Types): void;
  ConfigurePieceQueueDrawable(offset: Vector, scale: Vector): void;
}>;

export default function PieceQueueDrawable<TBase extends Drawable & GameStateUsable & BlockSizeConfigurable>(
  Base: TBase
): TBase & PieceQueueDrawable {
  return class PieceQueueDrawable extends Base {
    #offset: Vector;

    #scale: Vector;

    constructor(...args: any[]) {
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
      if (this.State === null) return;
      this.SetTransform(p5, this.#scale.X, this.#scale.Y, this.#offset.X, this.#offset.Y);

      const state = this.State;
      const blockSize = this.BlockSize;
      const { length } = state.PieceQueue;
      let height = 0;
      for (let i = length - 1; i >= 0; i--) {
        const points = Tetrominos[state.PieceQueue[i]].Rotations[0].slice();
        const Xs = points.map(p => p.X);
        const Ys = points.map(p => p.Y);
        const h = Ys.max() - Ys.min() + 1;
        const w = Xs.max() - Xs.min() + 1;
        DrawTetromino(
          p5,
          state.PieceQueue[i],
          new Vector((2 - w / 2) * blockSize, height - Ys.min() * blockSize),
          points,
          blockSize,
          255
        );
        height += (h + 1) * blockSize;
      }
    }
  };
}
