import p5Types from 'p5';
import { IsPlayfieldAnimatable } from './PlayfieldAnimatable';
import { TetrominoType } from '../Tetrominos';
import { Constructor, MixinArgs } from '../utils/Mixin';
import Vector from '../utils/Vector';
import { BlockSizeConfigurable } from './BlockSizeConfigurable';
import { GameStateUsable } from './GameStateUsable';
import { DrawTetromino, TetrominoColor, WithAlpha } from './Helper';
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
      p5.fill(50);
      p5.noStroke();
      p5.rect(0, 0, state.GridWidth * blockSize, state.GridHeight * blockSize);
      p5.stroke(0);
      for (let i = 0; i <= state.GridHeight; i++) {
        p5.line(0, i * blockSize, state.GridWidth * blockSize, i * blockSize);
      }
      for (let i = 0; i <= state.GridWidth; i++) {
        p5.line(i * blockSize, 0, i * blockSize, state.GridHeight * blockSize);
      }

      if (IsPlayfieldAnimatable(this)) {
        p5.noStroke();
        this.HardDropAnimations.forEach(animation => {
          p5.fill(WithAlpha(TetrominoColor(p5, animation.Data.type), 20));
          p5.rect(
            animation.Data.left * blockSize,
            animation.Data.end * blockSize,
            (animation.Data.right - animation.Data.left + 1) * blockSize,
            (state.PlayfieldHeight - animation.Data.end) * animation.CurrentValue * blockSize,
          );
        });
      }

      p5.stroke(0);
      let heightMap: number[] | null = null;
      if (IsPlayfieldAnimatable(this)) {
        heightMap = [];
        for (let i = 0; i < state.GridHeight; i++) {
          heightMap.push(i + this.LineClearAnimations.filter(x => x.Data.Y <= i).reduce((prev, curr) => prev + curr.CurrentValue, 0));
        }
      }
      function getAnimatedHeight(i: number) {
        if (heightMap === null) return i;
        return heightMap[i];
      }

      for (let i = 0; i < state.GridHeight; i++) {
        for (let j = 0; j < state.GridWidth; j++) {
          const type = state.Get(j, i) ?? TetrominoType.None;
          if (type !== TetrominoType.None) {
            p5.fill(TetrominoColor(p5, type));
            p5.rect(j * blockSize, getAnimatedHeight(i) * blockSize, blockSize, blockSize);
          }
        }
      }
      if (state.Falling) {
        const falling = state.Falling.Points.map(p => new Vector(p.X, getAnimatedHeight(p.Y)));
        DrawTetromino(p5, state.Falling?.Type, new Vector(0, 0), falling, blockSize, 255);
        const ghost = state.Falling.Clone();
        state.HardDropPiece(ghost);
        const ghostPoints = ghost.Points.map(p => new Vector(p.X, getAnimatedHeight(p.Y)));
        DrawTetromino(p5, state.Falling?.Type, new Vector(0, 0), ghostPoints, blockSize, 50);
      }
      if (IsPlayfieldAnimatable(this)) {
        p5.noStroke();
        this.LineClearAnimations.forEach(animation => {
          p5.fill(255, 255, 255, 100);
          p5.rect(0, animation.Data.OrigY * blockSize, state.GridWidth * blockSize / 2 * animation.CurrentValue, blockSize);
          p5.rect(state.GridWidth * blockSize, animation.Data.OrigY * blockSize, -state.GridWidth * blockSize / 2 * animation.CurrentValue, blockSize);
        });
      }
    }
  };
}