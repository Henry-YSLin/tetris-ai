import MultiGameState from '../../../gameState/MultiGameState';
import { TetrominoType } from '../../../Tetrominos';
import Inject from '../../dependencyInjection/InjectDecorator';
import Graphics from '../../Graphics';
import { TetrominoColor } from '../../Helper';
import LocalConfiguration from '../../LocalConfiguration';
import Drawable from './Drawable';

export default class GarbageMeterDrawable extends Drawable {
  protected gameState: MultiGameState = null!;

  protected localConfig: LocalConfiguration = null!;

  @Inject(MultiGameState, LocalConfiguration)
  private loadGarbageMeterDrawable(gameState: MultiGameState, localConfig: LocalConfiguration): void {
    this.gameState = gameState;
    this.localConfig = localConfig;
  }

  protected override draw(graphics: Graphics): void {
    const { p5 } = graphics;

    const state = this.gameState;
    const blockSize = this.localConfig.BlockSize;

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
