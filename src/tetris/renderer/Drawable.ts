import Vector from '../utils/Vector';
import Component from './Component';
import Inject from './dependencyInjection/InjectDecorator';
import Graphics from './Graphics';

export default class Drawable extends Component {
  protected graphics: Graphics = null!;

  public Offset: Vector = new Vector(0, 0);

  public Scale: Vector = new Vector(1, 1);

  public Size: Vector = new Vector(0, 0);

  @Inject(Graphics)
  private loadDrawable(graphics: Graphics): void {
    this.graphics = graphics;
  }

  protected applyTransform(graphics: Graphics): void {
    const { p5 } = graphics;
    p5.translate(this.Offset.X, this.Offset.Y);
    p5.scale(this.Scale.X, this.Scale.Y);
  }

  public override SetupSubTree(): void {
    super.SetupSubTree();

    this.graphics.p5.push();
    this.applyTransform(this.graphics);
    this.Setup(this.graphics);
    this.graphics.p5.pop();
  }

  public override DrawSubTree(): void {
    this.graphics.p5.push();
    this.applyTransform(this.graphics);
    this.Draw(this.graphics);
    this.graphics.p5.pop();
  }

  protected Setup(graphics: Graphics): void {}

  protected Draw(graphics: Graphics): void {}
}
