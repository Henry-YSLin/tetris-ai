import p5Types from 'p5';
import GameInput from '../../../GameInput';
import Player from '../../../player/Player';
import Inject from '../../dependencyInjection/InjectDecorator';
import LocalConfiguration from '../../LocalConfiguration';
import InputHandler from './InputHandler';

export default class RepeatableInputHandler extends InputHandler {
  #keyHeld: GameInput = GameInput.None;

  #keyDelay = 0;

  protected player: Player = null!;

  protected localConfig: LocalConfiguration = null!;

  @Inject(Player, LocalConfiguration)
  private loadRepeatableInputHandler(player: Player, localConfig: LocalConfiguration): void {
    this.player = player;
    this.localConfig = localConfig;
  }

  protected override update(): void {
    if (this.#keyHeld !== GameInput.None) {
      if (this.#keyDelay <= 0) {
        this.player.InputControl.AddInput(this.#keyHeld);
        this.#keyDelay = this.localConfig.AutoRepeatInterval;
      }
      this.#keyDelay--;
    }
  }

  protected p5KeyPressed(p5: p5Types): void {
    this.#keyHeld = this.getInput(p5);
    this.player.InputControl.AddInput(this.#keyHeld);
    this.#keyDelay = this.localConfig.AutoRepeatDelay;
  }

  protected p5KeyReleased(p5: p5Types): void {
    if (this.#keyHeld === this.getInput(p5)) this.#keyHeld = GameInput.None;
  }

  private getInput(p5: p5Types): GameInput {
    switch (p5.keyCode) {
      case p5.LEFT_ARROW:
        return GameInput.ShiftLeft;
      case p5.RIGHT_ARROW:
        return GameInput.ShiftRight;
      case p5.UP_ARROW:
        return GameInput.RotateCW;
      case p5.CONTROL:
        return GameInput.RotateCCW;
      case p5.DOWN_ARROW:
        return GameInput.SoftDrop;
      case p5.SHIFT:
        return GameInput.Hold;
      default:
        if (p5.key === ' ') return GameInput.HardDrop;
        return GameInput.None;
    }
  }
}
