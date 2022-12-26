import p5Types from 'p5';
import DependencyContainer from './dependencyInjection/DependencyContainer';
import Graphics from './Graphics';
import InputHandler from './components/inputHandler/InputHandler';
import Renderer from './Renderer';
import LocalConfiguration from './LocalConfiguration';

export default class RenderHost {
  public readonly Renderer: Renderer;

  public readonly LocalConfig: LocalConfiguration;

  private dependencies: DependencyContainer = new DependencyContainer();

  private graphics: Graphics | null = null;

  public constructor(renderer: Renderer, localConfig: LocalConfiguration) {
    this.Renderer = renderer;
    this.LocalConfig = localConfig;
  }

  private p5Setup(p5: p5Types, canvasParentRef: Element): void {
    p5.createCanvas(this.LocalConfig.Width, this.LocalConfig.Height).parent(canvasParentRef);
    if (this.LocalConfig.Framerate) p5.frameRate(this.LocalConfig.Framerate);
    this.graphics = new Graphics(p5);
    this.dependencies.Register(this.graphics);
    this.dependencies.Register(this.LocalConfig);
    this.Renderer.Load(null, this.dependencies);
    this.Renderer.SetupSubTree();
  }

  private p5Draw(p5: p5Types): void {
    if (this.graphics === null) throw new Error('Render Host graphics is null. Pleasee run setup before draw.');
    this.graphics.p5 = p5;
    this.Renderer.UpdateSubTree();
    this.Renderer.DrawSubTree();
  }

  public get SetupHandler(): RenderHost['p5Setup'] {
    return this.p5Setup.bind(this);
  }

  public get DrawHandler(): RenderHost['p5Draw'] {
    return this.p5Draw.bind(this);
  }

  public get KeyPressedHandler(): InputHandler['p5KeyPressed'] {
    return this.Renderer.InputHandler.KeyPressedHandler;
  }

  public get KeyReleasedHandler(): InputHandler['p5KeyReleased'] {
    return this.Renderer.InputHandler.KeyReleasedHandler;
  }
}
