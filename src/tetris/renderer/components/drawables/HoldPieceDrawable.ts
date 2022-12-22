import GameState from '../../../GameState';
import Tetrominos from '../../../Tetrominos';
import Vector from '../../../utils/Vector';
import Inject from '../../dependencyInjection/InjectDecorator';
import Graphics from '../../Graphics';
import { DrawTetromino, p5Text } from '../../Helper';
import RenderConfiguration from '../../RenderConfiguration';
import Drawable from './Drawable';

export default class HoldPieceDrawable extends Drawable {
  protected gameState: GameState = null!;

  protected renderConfig: RenderConfiguration = null!;

  @Inject(GameState, RenderConfiguration)
  private loadHoldPieceDrawable(gameState: GameState, renderConfig: RenderConfiguration): void {
    this.gameState = gameState;
    this.renderConfig = renderConfig;
  }

  protected override draw(graphics: Graphics): void {
    const { p5 } = graphics;

    const state = this.gameState;
    const blockSize = this.renderConfig.BlockSize;

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
}
