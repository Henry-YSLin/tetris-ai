import { Constructor } from '../utils/Mixin';
import p5Types from 'p5';
import { BLOCK_SIZE, PLAYFIELD_HEIGHT } from '../Consts';
import GameState from '../GameState';

export default class Renderer {
  State: GameState;
  protected width: number;
  protected height: number;

  /**
   * Create a Renderer using the recommended size
   */
  constructor(state: GameState);
  /**
   * Create a Renderer with the specified width and height
   * @param width Width of canvas
   * @param height Height of canvas
   */
  constructor(state: GameState, width: number, height: number);

  constructor(state: GameState, width?: number, height?: number) {
    this.State = state;
    if (width && height)
    {
      this.width = width;
      this.height = height;
    }
    else {
      this.width = 500;
      this.height = BLOCK_SIZE * PLAYFIELD_HEIGHT + BLOCK_SIZE * 0.1;
    }
  }

  ResetTransform(p5: p5Types): void {
		p5.scale(1, -1);
		p5.translate(0, -this.height);
  }

  p5Setup(p5: p5Types, canvasParentRef: Element): void {
		p5.createCanvas(this.width, this.height).parent(canvasParentRef);
    this.ResetTransform(p5);
	}

  p5Draw(p5: p5Types): void {
    p5.background(100);
  }
}

export type Drawable = Constructor<Renderer>;