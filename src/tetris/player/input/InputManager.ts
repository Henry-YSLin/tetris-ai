import GameInput from '../../GameInput';
import VisibleGameState from '../../gameState/VisibleGameState';

export interface InputControl {
  AddInput(input: GameInput): void;
  AddInputs(...inputs: GameInput[]): void;
}

export default class InputManager implements InputControl {
  #inputQueue: GameInput[] = [];

  public AddInput(input: GameInput): void {
    this.#inputQueue.push(input);
  }

  public AddInputs(...inputs: GameInput[]): void {
    this.#inputQueue.push(...inputs);
  }

  public Tick(gameState: VisibleGameState): GameInput {
    return this.#inputQueue.shift() ?? GameInput.None;
  }
}
