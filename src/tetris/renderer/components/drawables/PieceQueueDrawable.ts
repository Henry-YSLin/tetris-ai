import GameState from '../../../gameState/GameState';
import Tetrominos from '../../../Tetrominos';
import Vector from '../../../utils/Vector';
import Inject from '../../dependencyInjection/InjectDecorator';
import Graphics from '../../Graphics';
import { DrawTetromino } from '../../Helper';
import LocalConfiguration from '../../LocalConfiguration';
import Drawable from './Drawable';

export default class PieceQueueDrawable extends Drawable {
  protected gameState: GameState = null!;

  protected localConfig: LocalConfiguration = null!;

  @Inject(GameState, LocalConfiguration)
  private loadPieceQueueDrawable(gameState: GameState, localConfig: LocalConfiguration): void {
    this.gameState = gameState;
    this.localConfig = localConfig;
  }

  protected override draw(graphics: Graphics): void {
    const { p5 } = graphics;

    const state = this.gameState;
    const blockSize = this.localConfig.BlockSize;

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
