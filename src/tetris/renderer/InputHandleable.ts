import p5Types from 'p5';
import { KEY_REPEAT_DELAY } from '../Consts';
import GameInput from '../GameInput';
import HumanPlayer from '../player/HumanPlayer';
import { Constructor, MixinArgs } from '../utils/Mixin';
import { PlayerUsable } from './PlayerUsable';
import { Drawable } from './Renderer';

export type InputHandleable = Constructor<{
  p5Draw(p5: p5Types): void,
  p5KeyPressed(p5: p5Types): void,
  KeyPressedHandler: (p5: p5Types) => void,
  KeyReleasedHandler: (p5: p5Types) => void,
  p5KeyReleased(p5: p5Types): void,
}>;

export default function InputHandleable<TBase extends Drawable & PlayerUsable>(Base: TBase): TBase & InputHandleable {
  return class InputHandleable extends Base {
    protected keyHold: GameInput;
    protected keyDelay: number;

    constructor(...args: MixinArgs) {
      super(...args);
      this.keyHold = GameInput.None;
      this.keyDelay = 0;
    }

    p5Draw(p5: p5Types): void {
      super.p5Draw(p5);
      if (this.keyHold !== GameInput.None) {
        if (this.Player instanceof HumanPlayer) {
          if (this.keyDelay <= 0) {
            this.Player.Enqueue(this.keyHold);
            this.keyDelay = KEY_REPEAT_DELAY;
          }
          this.keyDelay--;
        }
      }
    }

    p5KeyPressed(p5: p5Types): void {
      if (!(this.Player instanceof HumanPlayer)) return;
      if (p5.keyCode === p5.LEFT_ARROW)
        this.keyHold = GameInput.ShiftLeft;
      if (p5.keyCode === p5.RIGHT_ARROW)
        this.keyHold = GameInput.ShiftRight;
      if (p5.keyCode === p5.UP_ARROW)
        this.keyHold = GameInput.RotateCW;
      if (p5.keyCode === p5.CONTROL)
        this.keyHold = GameInput.RotateCCW;
      if (p5.keyCode === p5.DOWN_ARROW)
        this.keyHold = GameInput.SoftDrop;
      if (p5.keyCode === p5.SHIFT)
        this.keyHold = GameInput.Hold;
      if (p5.key === ' ')
        this.keyHold = GameInput.HardDrop;
      this.Player.Enqueue(this.keyHold);
      this.keyDelay = KEY_REPEAT_DELAY;
    }

    p5KeyReleased(p5: p5Types): void {
      if (!(this.Player instanceof HumanPlayer)) return;
      let currentKey: GameInput = GameInput.None;
      if (p5.keyCode === p5.LEFT_ARROW)
        currentKey = GameInput.ShiftLeft;
      if (p5.keyCode === p5.RIGHT_ARROW)
        currentKey = GameInput.ShiftRight;
      if (p5.keyCode === p5.UP_ARROW)
        currentKey = GameInput.RotateCW;
      if (p5.keyCode === p5.CONTROL)
        currentKey = GameInput.RotateCCW;
      if (p5.keyCode === p5.DOWN_ARROW)
        currentKey = GameInput.SoftDrop;
      if (p5.keyCode === p5.SHIFT)
        currentKey = GameInput.Hold;
      if (p5.key === ' ')
        currentKey = GameInput.HardDrop;
      if (this.keyHold === currentKey)
        this.keyHold = GameInput.None;
    }

    get KeyPressedHandler(): (p5: p5Types) => void {
      return this.p5KeyPressed.bind(this);
    }

    get KeyReleasedHandler(): (p5: p5Types) => void {
      return this.p5KeyReleased.bind(this);
    }
  };
}