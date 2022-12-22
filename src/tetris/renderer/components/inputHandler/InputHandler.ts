import p5Types from 'p5';
import Component from '../Component';

export default abstract class InputHandler extends Component {
  protected abstract p5KeyPressed(p5: p5Types): void;
  protected abstract p5KeyReleased(p5: p5Types): void;

  public get KeyPressedHandler(): InputHandler['p5KeyPressed'] {
    return this.p5KeyPressed.bind(this);
  }

  public get KeyReleasedHandler(): InputHandler['p5KeyReleased'] {
    return this.p5KeyReleased.bind(this);
  }
}
