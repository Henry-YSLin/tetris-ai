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
  p5Setup(p5: p5Types, canvasParentRef: Element): void,
  p5Draw(p5: p5Types): void,
  ConfigurePlayfieldDrawable(offset: Vector, scale: Vector): void
}>;

export default function PlayfieldDrawable<TBase extends Drawable & GameStateUsable & BlockSizeConfigurable>(Base: TBase): TBase & PlayfieldDrawable {
  return class PlayfieldDrawable extends Base {
    #offset: Vector;
    #scale: Vector;
    #pg: p5Types.Graphics | null;

    constructor(...args: MixinArgs) {
      super(...args);
      this.#offset = new Vector(0, 0);
      this.#scale = new Vector(1, 1);
      this.#pg = null;
    }

    ConfigurePlayfieldDrawable(offset: Vector, scale: Vector): void {
      this.#offset = offset;
      this.#scale = scale;
    }

    p5Setup(p5: p5Types, canvasParentRef: Element): void {
      super.p5Setup(p5, canvasParentRef);
      if (this.State) {
        this.#pg = p5.createGraphics(
          this.State.GridWidth * this.BlockSize,
          (this.State.PlayfieldHeight + 0.1) * this.BlockSize,
        );
      }
    }

    p5Draw(p5: p5Types): void {
      super.p5Draw(p5);
      if (this.State === null) return;
      this.SetTransform(p5, this.#scale.X, this.#scale.Y, this.#offset.X, this.#offset.Y);

      const state = this.State;
      const blockSize = this.BlockSize;
      if (!this.#pg) return;
      const pg = this.#pg;
      if (!state) return;
      pg.background(50);
      pg.stroke(0, 0, 0, 100);
      for (let i = 0; i <= state.GridHeight; i++) {
        pg.line(0, i * blockSize, state.GridWidth * blockSize, i * blockSize);
      }
      for (let i = 0; i <= state.GridWidth; i++) {
        pg.line(i * blockSize, 0, i * blockSize, state.GridHeight * blockSize);
      }

      if (IsPlayfieldAnimatable(this)) {
        pg.noStroke();
        this.HardDropAnimations.forEach(animation => {
          pg.fill(WithAlpha(TetrominoColor(pg, animation.Data.type), 20));
          pg.rect(
            animation.Data.left * blockSize,
            animation.Data.end * blockSize,
            (animation.Data.right - animation.Data.left + 1) * blockSize,
            (state.PlayfieldHeight - animation.Data.end) * animation.CurrentValue * blockSize,
          );
        });
      }

      pg.stroke(0, 0, 0, 150);
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
            pg.fill(TetrominoColor(pg, type));
            pg.rect(j * blockSize, getAnimatedHeight(i) * blockSize, blockSize, blockSize);
          }
        }
      }
      if (state.Falling) {
        const falling = state.Falling.Points.map(p => new Vector(p.X, getAnimatedHeight(p.Y)));
        DrawTetromino(pg, state.Falling?.Type, new Vector(0, 0), falling, blockSize, 255);
        const ghost = state.Falling.Clone();
        state.HardDropPiece(ghost);
        const ghostPoints = ghost.Points.map(p => new Vector(p.X, getAnimatedHeight(p.Y)));
        DrawTetromino(pg, state.Falling?.Type, new Vector(0, 0), ghostPoints, blockSize, 50);
      }
      if (IsPlayfieldAnimatable(this)) {
        pg.noStroke();
        pg.fill(255, 255, 255, 100);
        this.LineClearAnimations.forEach(animation => {
          pg.rect(0, animation.Data.OrigY * blockSize, state.GridWidth * blockSize / 2 * animation.CurrentValue, blockSize);
          pg.rect(state.GridWidth * blockSize, animation.Data.OrigY * blockSize, -state.GridWidth * blockSize / 2 * animation.CurrentValue, blockSize);
        });
      }

      if (state.IsDead)
        pg.filter(pg.GRAY);

      p5.image(pg, 0, 0);
    }
  };
}