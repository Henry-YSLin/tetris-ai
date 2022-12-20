import p5Types from 'p5';
import { Constructor } from '../utils/Mixin';
import { BLOCK_SIZE, PLAYFIELD_HEIGHT } from '../Consts';

export default class Renderer {
  protected width: number;

  protected height: number;

  /**
   * Create a Renderer using the recommended size
   */
  constructor();
  /**
   * Create a Renderer with the specified width and height
   * @param width Width of canvas
   * @param height Height of canvas
   */
  constructor(width: number, height: number);

  constructor(width?: number, height?: number) {
    if (width && height) {
      this.width = width;
      this.height = height;
    } else {
      this.width = BLOCK_SIZE * 22;
      this.height = BLOCK_SIZE * (PLAYFIELD_HEIGHT + 0.1) + 100;
    }
  }

  SetTransform(p5: p5Types, scaleX: number, scaleY: number, translateX: number, translateY: number): void {
    this.ResetTransform(p5);
    p5.translate(translateX, translateY);
    p5.scale(scaleX, scaleY);
  }

  ResetTransform(p5: p5Types): void {
    p5.resetMatrix();
    p5.scale(1, -1);
    p5.translate(0, -this.height);
    p5.scale(1, 1);
  }

  p5Setup(p5: p5Types, canvasParentRef: Element): void {
    p5.createCanvas(this.width, this.height).parent(canvasParentRef);
    p5.frameRate(60);
    this.ResetTransform(p5);
  }

  p5Draw(p5: p5Types): void {
    p5.background(100);
  }

  get DrawHandler(): (p5: p5Types) => void {
    return this.p5Draw.bind(this);
  }

  get SetupHandler(): (p5: p5Types, canvasParentRef: Element) => void {
    return this.p5Setup.bind(this);
  }
}

export type Drawable = Constructor<Renderer>;
