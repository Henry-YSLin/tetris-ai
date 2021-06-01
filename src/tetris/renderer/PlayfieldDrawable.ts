import p5Types from 'p5';
import { TetrominoType } from '../Tetrominos';
import { Constructor, MixinArgs } from '../utils/Mixin';
import Vector from '../utils/Vector';
import { BlockSizeConfigurable } from './BlockSizeConfigurable';
import { GameStateUsable } from './GameStateUsable';
import { DrawTetromino, TetrominoColor } from './Helper';
import { Drawable } from './Renderer';

export type PlayfieldDrawable = Constructor<{
  p5Draw(p5: p5Types): void,
  ConfigurePlayfieldDrawable(offset: Vector, scale: Vector): void
}>;

export default function PlayfieldDrawable<TBase extends Drawable & GameStateUsable & BlockSizeConfigurable>(Base: TBase): TBase & PlayfieldDrawable {
  return class PlayfieldDrawable extends Base {
    #offset: Vector;
    #scale: Vector;

    constructor(...args: MixinArgs) {
      super(...args);
      this.#offset = new Vector(0, 0);
      this.#scale = new Vector(1, 1);
    }

    ConfigurePlayfieldDrawable(offset: Vector, scale: Vector): void {
      this.#offset = offset;
      this.#scale = scale;
    }

    p5Draw(p5: p5Types): void {
      super.p5Draw(p5);
      if (this.State === null) return;
      this.SetTransform(p5, this.#scale.X, this.#scale.Y, this.#offset.X, this.#offset.Y);

      const state = this.State;
      const blockSize = this.BlockSize;
      if (!state) return;
      p5.stroke(0);
      for (let i = 0; i <= state.GridHeight; i++) {
        p5.line(0, i * blockSize, state.GridWidth * blockSize, i * blockSize);
      }
      for (let i = 0; i <= state.GridWidth; i++) {
        p5.line(i * blockSize, 0, i * blockSize, state.GridHeight * blockSize);
      }
      for (let i = 0; i < state.GridHeight; i++) {
        for (let j = 0; j < state.GridWidth; j++) {
          p5.fill(TetrominoColor(p5, state.Get(j, i) ?? TetrominoType.None));
          p5.rect(j * blockSize, i * blockSize, blockSize, blockSize);
        }
      }
      if (state.Falling) {
        const falling = state.Falling.Points;
        DrawTetromino(p5, state.Falling?.Type, new Vector(0, 0), falling, blockSize, 255);
        const ghost = state.Falling.Clone();
        state.HardDropPiece(ghost);
        const ghostPoints = ghost.Points;
        DrawTetromino(p5, state.Falling?.Type, new Vector(0, 0), ghostPoints, blockSize, 100);
      }
    }
  };
}