import Component from './Component';
import Inject from './dependencyInjection/InjectDecorator';
import Graphics from './Graphics';

export default class Drawable extends Component {
  private graphics: Graphics | null = null;

  @Inject(Graphics)
  private loadDrawable(graphics: Graphics): void {
    this.graphics = graphics;
  }

  public override SetupSubTree(): void {
    super.SetupSubTree();

    if (!this.graphics) throw new Error('Graphics not ready at setup');
    this.GraphicsSetup(this.graphics);
  }

  public override UpdateSubTree(): void {
    super.UpdateSubTree();

    if (!this.graphics) throw new Error('Graphics not ready at update');
    this.Draw(this.graphics);
  }

  protected GraphicsSetup(graphics: Graphics): void {}

  protected Draw(graphics: Graphics): void {}
}
