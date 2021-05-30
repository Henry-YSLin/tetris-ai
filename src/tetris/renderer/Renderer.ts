import { Constructor } from '../utils/Mixin';
import p5Types from 'p5';
import { BLOCK_SIZE, PLAYFIELD_HEIGHT } from '../Consts';

export default class Renderer {
  #width: number;
  #height: number;

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
    if (width && height)
    {
      this.#width = width;
      this.#height = height;
    }
    else {
      this.#width = 500;
      this.#height = BLOCK_SIZE * PLAYFIELD_HEIGHT + BLOCK_SIZE * 0.1;
    }
  }

  ResetTransform(p5: p5Types): void {
		p5.scale(1, -1);
		p5.translate(0, this.#height);
  }

  Setup(p5: p5Types, canvasParentRef: Element): void {
		p5.createCanvas(this.#width, this.#height).parent(canvasParentRef);
    this.ResetTransform(p5);
	}

  Draw(_p5: p5Types): void {
    return;
  }
}

export type Drawable = Constructor<Renderer>;