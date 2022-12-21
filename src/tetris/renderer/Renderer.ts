import Container from './Container';
import Graphics from './Graphics';

export default class Renderer extends Container {
  protected override applyTransform(graphics: Graphics): void {
    // todo: remove coordinate transform
    const { p5 } = graphics;
    p5.resetMatrix();
    p5.scale(1, -1);
    p5.translate(0, -this.Height);

    super.applyTransform(graphics);
  }
}
