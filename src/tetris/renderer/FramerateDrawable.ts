import p5Types from 'p5';
import { Constructor } from '../utils/Mixin';
import Vector from '../utils/Vector';
import { BlockSizeConfigurable } from './BlockSizeConfigurable';
import { p5text } from './Helper';
import { Drawable } from './Renderer';

export type FramerateDrawable = Constructor<{
  p5Draw(p5: p5Types): void;
  ConfigureFramerateDrawable(offset: Vector, scale: Vector): void;
}>;

export default function FramerateDrawable<TBase extends Drawable & BlockSizeConfigurable>(
  Base: TBase
): TBase & FramerateDrawable {
  return class FramerateDrawable extends Base {
    #offset: Vector;

    #scale: Vector;

    constructor(...args: any[]) {
      super(...args);
      this.#offset = new Vector(0, 0);
      this.#scale = new Vector(1, 1);
    }

    ConfigureFramerateDrawable(offset: Vector, scale: Vector): void {
      this.#offset = offset;
      this.#scale = scale;
    }

    p5Draw(p5: p5Types): void {
      super.p5Draw(p5);
      this.SetTransform(p5, this.#scale.X, this.#scale.Y, this.#offset.X, this.#offset.Y);
      p5.noStroke();
      p5.fill(0);
      p5text(p5, `FPS: ${p5.frameRate().toFixed(2)}`, 0, 0);
    }
  };
}
