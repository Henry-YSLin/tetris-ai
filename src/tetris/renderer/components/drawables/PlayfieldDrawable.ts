import p5Types from 'p5';
import GameState from '../../../gameState/GameState';
import Inject from '../../dependencyInjection/InjectDecorator';
import RenderConfiguration from '../../RenderConfiguration';
import Drawable from './Drawable';
import Graphics from '../../Graphics';
import AnimationManager from '../AnimationManager';
import { DrawTetromino, TetrominoColor, WithAlpha } from '../../Helper';
import { TetrominoType } from '../../../Tetrominos';
import Vector from '../../../utils/Vector';

export default class PlayfieldDrawable extends Drawable {
  protected gameState: GameState = null!;

  protected renderConfig: RenderConfiguration = null!;

  protected animationManager: AnimationManager = null!;

  #playfieldGraphics: p5Types.Graphics | null = null;

  #freezeGraphics = false;

  @Inject(GameState, RenderConfiguration, AnimationManager)
  private loadPlayfieldDrawable(
    gameState: GameState,
    renderConfig: RenderConfiguration,
    animationManager: AnimationManager
  ): void {
    this.gameState = gameState;
    this.renderConfig = renderConfig;
    this.animationManager = animationManager;
  }

  protected override setup(graphics: Graphics): void {
    const { p5 } = this.graphics;

    this.#playfieldGraphics = p5.createGraphics(
      this.gameState.GridWidth * this.renderConfig.BlockSize,
      (this.gameState.PlayfieldHeight + 0.1) * this.renderConfig.BlockSize
    );
  }

  protected override draw(): void {
    const { p5 } = this.graphics;

    const state = this.gameState;
    const blockSize = this.renderConfig.BlockSize;

    if (!this.#playfieldGraphics) return;
    const pg = this.#playfieldGraphics;
    if (!this.#freezeGraphics) {
      pg.background(50);
      pg.stroke(0, 0, 0, 100);
      for (let i = 0; i <= state.GridHeight; i++) {
        pg.line(0, i * blockSize, state.GridWidth * blockSize, i * blockSize);
      }
      for (let i = 0; i <= state.GridWidth; i++) {
        pg.line(i * blockSize, 0, i * blockSize, state.GridHeight * blockSize);
      }

      pg.noStroke();
      this.animationManager.HardDropAnimations.forEach(animation => {
        pg.fill(WithAlpha(TetrominoColor(pg, animation.Data.type), 20));
        pg.rect(
          animation.Data.left * blockSize,
          animation.Data.end * blockSize,
          (animation.Data.right - animation.Data.left + 1) * blockSize,
          (state.PlayfieldHeight - animation.Data.end) * animation.CurrentValue * blockSize
        );
      });

      pg.stroke(0, 0, 0, 150);
      const animatedHeight: number[] = [];
      for (let i = 0; i < state.GridHeight; i++) {
        animatedHeight.push(
          i +
            this.animationManager.LineClearAnimations.filter(x => x.Data.y <= i).reduce(
              (prev, curr) => prev + curr.CurrentValue,
              0
            )
        );
      }

      for (let i = 0; i < state.GridHeight; i++) {
        for (let j = 0; j < state.GridWidth; j++) {
          const type = state.Get(j, i) ?? TetrominoType.None;
          if (type !== TetrominoType.None) {
            pg.fill(TetrominoColor(pg, type));
            pg.rect(j * blockSize, animatedHeight[i] * blockSize, blockSize, blockSize);
          }
        }
      }
      if (state.Falling) {
        const falling = state.Falling.Points.map(p => new Vector(p.X, animatedHeight[p.Y]));
        DrawTetromino(pg, state.Falling?.Type, new Vector(0, 0), falling, blockSize, 255);
        const ghost = state.Falling.Clone();
        state.HardDropPiece(ghost);
        const ghostPoints = ghost.Points.map(p => new Vector(p.X, animatedHeight[p.Y]));
        DrawTetromino(pg, state.Falling?.Type, new Vector(0, 0), ghostPoints, blockSize, 50);
      }
      pg.noStroke();
      pg.fill(255, 255, 255, 100);
      this.animationManager.LineClearAnimations.forEach(animation => {
        pg.rect(
          0,
          animation.Data.origY * blockSize,
          ((state.GridWidth * blockSize) / 2) * animation.CurrentValue,
          blockSize
        );
        pg.rect(
          state.GridWidth * blockSize,
          animation.Data.origY * blockSize,
          ((-state.GridWidth * blockSize) / 2) * animation.CurrentValue,
          blockSize
        );
      });

      if (state.IsDead) {
        pg.filter(pg.GRAY);
        this.#freezeGraphics = true;
      }
    }

    p5.image(pg, 0, 0);
  }
}
