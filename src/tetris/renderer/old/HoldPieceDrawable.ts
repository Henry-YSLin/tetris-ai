import p5Types from 'p5';
import Tetrominos from '../Tetrominos';
import { Constructor } from '../utils/Mixin';
import Vector from '../utils/Vector';
import { BlockSizeConfigurable } from './BlockSizeConfigurable';
import { GameStateUsable } from './GameStateUsable';
import { DrawTetromino, p5text } from './Helper';
import { Drawable } from './Renderer';
import '../utils/Array';

export type HoldPieceDrawable = Constructor<{
  p5Draw(p5: p5Types): void;
  ConfigureHoldPieceDrawable(offset: Vector, scale: Vector): void;
}>;

export default function HoldPieceDrawable<TBase extends Drawable & GameStateUsable & BlockSizeConfigurable>(
  Base: TBase
): TBase & HoldPieceDrawable {
  return class HoldPieceDrawable extends Base {
    #offset: Vector;

    #scale: Vector;

    constructor(...args: any[]) {
      super(...args);
      this.#offset = new Vector(0, 0);
      this.#scale = new Vector(1, 1);
    }

    ConfigureHoldPieceDrawable(offset: Vector, scale: Vector): void {
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
      p5.rect(0, 0, blockSize * 5, blockSize * 6);
      p5.noStroke();
      p5.fill(255);
      p5.textAlign(p5.CENTER);
      p5.textSize(15);
      p5text(p5, 'HOLD', blockSize * 2.5, blockSize * 5);
      p5.textAlign(p5.LEFT);
      p5.stroke(0);
      if (state.Hold) {
        const points = Tetrominos[state.Hold.Type].Rotations[0].slice();
        const Xs = points.map(p => p.X);
        const Ys = points.map(p => p.Y);
        const w = Xs.max() - Xs.min() + 1;
        const h = Ys.max() - Ys.min() + 1;
        DrawTetromino(
          p5,
          state.Hold.Type,
          new Vector((2.5 - w / 2) * blockSize, (2.5 - h / 2 - Ys.min()) * blockSize),
          points,
          blockSize,
          255
        );
      }
    }
  };
}
