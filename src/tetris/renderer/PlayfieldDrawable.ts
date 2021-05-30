import p5Types from 'p5';
import { BLOCK_SIZE } from '../Consts';
import { Tetromino } from '../Tetrominos';
import { Constructor, MixinArgs } from '../utils/Mixin';
import { TetrominoColor } from './Helper';
import { Drawable } from './Renderer';

export type PlayfieldDrawable = Constructor<{
  p5Draw(p5: p5Types): void,
  ConfigurePlayfieldDrawable(blockSize: number): void
}>;

export default function PlayfieldDrawable<TBase extends Drawable>(Base: TBase): TBase & PlayfieldDrawable {
  return class PlayfieldDrawable extends Base {
    protected blockSize: number;

    constructor(...args: MixinArgs) {
      super(...args);
      this.blockSize = BLOCK_SIZE;
    }

    ConfigurePlayfieldDrawable(blockSize: number): void {
      this.blockSize = blockSize;
    }

    p5Draw(p5: p5Types): void {
      super.p5Draw(p5);
      this.ResetTransform(p5);

      const state = this.State;
      const {blockSize} = this;
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
          p5.fill(TetrominoColor(p5, state.Get(j, i) ?? Tetromino.None));
          p5.rect(j * blockSize, i * blockSize, blockSize, blockSize);
        }
      }
    }
  };
}