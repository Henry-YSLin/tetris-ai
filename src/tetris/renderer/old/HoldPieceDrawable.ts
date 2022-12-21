import p5Types from 'p5';
import Tetrominos from '../Tetrominos';
import { Constructor } from '../utils/Mixin';
import Vector from '../utils/Vector';
import { BlockSizeConfigurable } from './BlockSizeConfigurable';
import { GameStateUsable } from './GameStateUsable';
import { DrawTetromino, p5Text } from './Helper';
import { Drawable } from './Renderer';
import '../utils/Array';

export type HoldPieceDrawable = Constructor<{
  p5Draw(p5: p5Types): void;
  ConfigureHoldPieceDrawable(offset: Vector, scale: Vector): void;
}>;

export default function HoldPieceDrawable<TBase extends Drawable & GameStateUsable & BlockSizeConfigurable>(
  base: TBase
): TBase & HoldPieceDrawable {
  return class HoldPieceDrawable extends base {
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
      p5Text(p5, 'HOLD', blockSize * 2.5, blockSize * 5);
      p5.textAlign(p5.LEFT);
      p5.stroke(0);
      if (state.Hold) {
        const points = Tetrominos[state.Hold.Type].rotations[0].slice();
        const allX = points.map(p => p.X);
        const allY = points.map(p => p.Y);
        const w = allX.max() - allX.min() + 1;
        const h = allY.max() - allY.min() + 1;
        DrawTetromino(
          p5,
          state.Hold.Type,
          new Vector((2.5 - w / 2) * blockSize, (2.5 - h / 2 - allY.min()) * blockSize),
          points,
          blockSize,
          255
        );
      }
    }
  };
}
