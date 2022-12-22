import GameInput from '../GameInput';
import VisibleGameState from '../gameState/VisibleGameState';
import InputManager, { InputControl } from './input/InputManager';

export default abstract class Player {
  #inputManager: InputManager;

  public get InputControl(): InputControl {
    return this.#inputManager;
  }

  public constructor(inputManager: InputManager) {
    this.#inputManager = inputManager;
  }

  public Tick(gameState: VisibleGameState): GameInput {
    this.processTick(gameState, this.InputControl);
    return this.#inputManager.Tick(gameState);
  }

  protected abstract processTick(gameState: VisibleGameState, inputControl: InputControl): void;
}
