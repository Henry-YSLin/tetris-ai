import GameInput from '../../GameInput';
import VisibleGameState from '../../gameState/VisibleGameState';
import InputManager, { InputControl } from './InputManager';

export interface DelayedInputControl extends InputControl {
  CanInputThisFrame(gameState: VisibleGameState): boolean;
}

export default class DelayedInputManager extends InputManager implements DelayedInputControl {
  public readonly ActionDelay: number;

  #lastActionTick: number;

  public constructor(actionDelay: number) {
    super();
    this.ActionDelay = actionDelay;
    this.#lastActionTick = 0;
  }

  public CanInputThisFrame(gameState: VisibleGameState): boolean {
    return gameState.TicksElapsed - this.#lastActionTick >= this.ActionDelay;
  }

  public override Tick(gameState: VisibleGameState): GameInput {
    const acceptInput = gameState.TicksElapsed - this.#lastActionTick >= this.ActionDelay;
    if (acceptInput) {
      const input = super.Tick(gameState);
      if (input !== GameInput.None) this.#lastActionTick = gameState.TicksElapsed;
      return input;
    }
    return GameInput.None;
  }
}
