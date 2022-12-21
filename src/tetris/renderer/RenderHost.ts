import p5Types from 'p5';
import DependencyContainer from './dependencyInjection/DependencyContainer';
import Graphics from './Graphics';
import Renderer from './Renderer';

export default class RenderHost {
  private renderer: Renderer;

  private dependencies: DependencyContainer = new DependencyContainer();

  private graphics: Graphics | null = null;

  public constructor(renderer: Renderer) {
    this.renderer = renderer;
  }

  private p5Setup(p5: p5Types, canvasParentRef: Element): void {
    p5.createCanvas(this.renderer.Width, this.renderer.Height).parent(canvasParentRef);
    p5.frameRate(60);
    p5.background(100);
    this.graphics = new Graphics(p5);
    this.dependencies.Register(this.graphics);
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

  public get SetupHandler(): (p5: p5Types, canvasParentRef: Element) => void {
    return this.p5Setup.bind(this);
  }

  public get DrawHandler(): (p5: p5Types) => void {
    return this.p5Draw.bind(this);
  }
}
