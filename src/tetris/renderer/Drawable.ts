import Vector from '../utils/Vector';
import Component from './Component';
import Inject from './dependencyInjection/InjectDecorator';
import Graphics from './Graphics';

export default class Drawable extends Component {
  protected graphics: Graphics = null!;

  public Offset: Vector = new Vector(0, 0);

  public Scale: Vector = new Vector(1, 1);

  public Size: Vector = new Vector(0, 0);

  public get OffsetX(): number {
    return this.Offset.X;
  }

  public set OffsetX(value: number) {
    this.Offset.X = value;
  }

  public get OffsetY(): number {
    return this.Offset.Y;
  }

  public set OffsetY(value: number) {
    this.Offset.Y = value;
  }

  public get ScaleX(): number {
    return this.Scale.X;
  }

  public set ScaleX(value: number) {
    this.Scale.X = value;
  }

  public get ScaleY(): number {
    return this.Scale.Y;
  }

  public set ScaleY(value: number) {
    this.Scale.Y = value;
  }

  public get Width(): number {
    return this.Size.X;
  }

  public set Width(value: number) {
    this.Size.X = value;
  }

  public get Height(): number {
    return this.Size.Y;
  }

  public set Height(value: number) {
    this.Size.Y = value;
  }

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
    this.setup(this.graphics);
    this.graphics.p5.pop();
  }

  public override DrawSubTree(): void {
    this.graphics.p5.push();
    this.applyTransform(this.graphics);
    this.draw(this.graphics);
    this.graphics.p5.pop();
  }

  protected setup(graphics: Graphics): void {}

  protected draw(graphics: Graphics): void {}
}
