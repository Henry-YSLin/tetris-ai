import Graphics from '../../Graphics';
import Drawable from './Drawable';

export default class FramerateDrawable extends Drawable {
  protected override draw(graphics: Graphics): void {
    const { p5 } = graphics;
    p5.resetMatrix();
    p5.scale(1.2, 1.2);
    p5.noStroke();
    p5.fill(0);
    p5.text(`FPS: ${p5.frameRate().toFixed(2)}`, 0, 10);
  }
}
