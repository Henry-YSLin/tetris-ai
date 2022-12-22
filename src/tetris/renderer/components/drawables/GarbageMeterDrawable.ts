import MultiGameState from '../../../MultiGameState';
import { TetrominoType } from '../../../Tetrominos';
import Inject from '../../dependencyInjection/InjectDecorator';
import Graphics from '../../Graphics';
import { TetrominoColor } from '../../Helper';
import RenderConfiguration from '../../RenderConfiguration';
import Drawable from './Drawable';

export default class GarbageMeterDrawable extends Drawable {
  protected gameState: MultiGameState = null!;

  protected renderConfig: RenderConfiguration = null!;

  @Inject(MultiGameState, RenderConfiguration)
  private loadGarbageMeterDrawable(gameState: MultiGameState, renderConfig: RenderConfiguration): void {
    this.gameState = gameState;
    this.renderConfig = renderConfig;
  }

  protected override draw(graphics: Graphics): void {
    const { p5 } = graphics;

    const state = this.gameState;
    const blockSize = this.renderConfig.BlockSize;

    p5.fill(50);
    p5.rect(0, 0, blockSize, blockSize * state.PlayfieldHeight);
    p5.fill(TetrominoColor(p5, TetrominoType.Garbage));
    let meterHeight = state.GarbageMeter.reduce((prev, curr) => prev + curr.Lines, 0);
    if (meterHeight > state.PlayfieldHeight) {
      meterHeight = state.PlayfieldHeight;
      p5.fill('red');
    }
    for (let i = 0; i < meterHeight; i++) {
      p5.rect(0, i * blockSize, blockSize, blockSize);
    }
  }
}
