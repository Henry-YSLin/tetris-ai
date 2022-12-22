import p5Types from 'p5';
import InputHandler from './InputHandler';

export default class DisableInputHandler extends InputHandler {
  protected p5KeyPressed(p5: p5Types): void {
    // do nothing
  }

  protected p5KeyReleased(p5: p5Types): void {
    // do nothing
  }
}
