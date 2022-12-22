import Graphics from '../../Graphics';
import { p5Text } from '../../Helper';
import Drawable from './Drawable';

export default class FramerateDrawable extends Drawable {
  protected override draw(graphics: Graphics): void {
    const { p5 } = graphics;
    p5.noStroke();
    p5.fill(0);
    p5Text(p5, `FPS: ${p5.frameRate().toFixed(2)}`, 0, 0);
  }
}
