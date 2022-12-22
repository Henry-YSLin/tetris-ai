import p5Types from 'p5';
import DependencyContainer from './dependencyInjection/DependencyContainer';
import Graphics from './Graphics';
import InputHandler from './components/inputHandler/InputHandler';
import Renderer from './Renderer';
import RenderConfiguration from './RenderConfiguration';

export default class RenderHost {
  private renderer: Renderer;

  private dependencies: DependencyContainer = new DependencyContainer();

  private graphics: Graphics | null = null;

  private renderConfig: RenderConfiguration;

  public constructor(renderer: Renderer, renderConfig: RenderConfiguration) {
    this.renderer = renderer;
    this.renderConfig = renderConfig;
  }

  private p5Setup(p5: p5Types, canvasParentRef: Element): void {
    p5.createCanvas(this.renderConfig.Width, this.renderConfig.Height).parent(canvasParentRef);
    p5.frameRate(this.renderConfig.Framerate);
    p5.background(100);
    this.graphics = new Graphics(p5);
    this.dependencies.Register(this.graphics);
    this.dependencies.Register(this.renderConfig);
    this.renderer.Load(null, this.dependencies);
    this.renderer.SetupSubTree();
  }

  private p5Draw(p5: p5Types): void {
    if (this.graphics === null) throw new Error('Render Host graphics is null. Pleasee run setup before draw.');
    this.graphics.p5 = p5;
    p5.background(100);
    this.renderer.UpdateSubTree();
    this.renderer.DrawSubTree();
  }

  public get SetupHandler(): RenderHost['p5Setup'] {
    return this.p5Setup.bind(this);
  }

  public get DrawHandler(): RenderHost['p5Draw'] {
    return this.p5Draw.bind(this);
  }

  public get KeyPressedHandler(): InputHandler['p5KeyPressed'] {
    return this.renderer.InputHandler.KeyPressedHandler;
  }

  public get KeyReleasedHandler(): InputHandler['p5KeyReleased'] {
    return this.renderer.InputHandler.KeyReleasedHandler;
  }
}
