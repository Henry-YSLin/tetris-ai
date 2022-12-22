import GameState from '../../../GameState';
import Tetrominos from '../../../Tetrominos';
import Vector from '../../../utils/Vector';
import Inject from '../../dependencyInjection/InjectDecorator';
import Graphics from '../../Graphics';
import { DrawTetromino } from '../../Helper';
import RenderConfiguration from '../../RenderConfiguration';
import Drawable from './Drawable';

export default class PieceQueueDrawable extends Drawable {
  protected gameState: GameState = null!;

  protected renderConfig: RenderConfiguration = null!;

  @Inject(GameState, RenderConfiguration)
  private loadPieceQueueDrawable(gameState: GameState, renderConfig: RenderConfiguration): void {
    this.gameState = gameState;
    this.renderConfig = renderConfig;
  }

  protected override draw(graphics: Graphics): void {
    const { p5 } = graphics;

    const state = this.gameState;
    const blockSize = this.renderConfig.BlockSize;

    const { length } = state.PieceQueue;
    let height = 0;
    for (let i = length - 1; i >= 0; i--) {
      const points = Tetrominos[state.PieceQueue[i]].rotations[0].slice();
      const allX = points.map(p => p.X);
      const allY = points.map(p => p.Y);
      const w = allX.max() - allX.min() + 1;
      const h = allY.max() - allY.min() + 1;
      DrawTetromino(
        p5,
        state.PieceQueue[i],
        new Vector((2 - w / 2) * blockSize, height - allY.min() * blockSize),
        points,
        blockSize,
        255
      );
      height += (h + 1) * blockSize;
    }
  }
}
