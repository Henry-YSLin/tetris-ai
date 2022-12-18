import GameInput from '../../GameInput';
import { VisibleGameState } from '../../GameState';

export interface InputControl {
  addInput(input: GameInput): void;
  addInputs(...inputs: GameInput[]): void;
}

export default class InputManager implements InputControl {
  #inputQueue: GameInput[] = [];

  public addInput(input: GameInput): void {
    this.#inputQueue.push(input);
  }

  public addInputs(...inputs: GameInput[]): void {
    this.#inputQueue.push(...inputs);
  }

  public Tick(_gameState: VisibleGameState): GameInput {
    return this.#inputQueue.shift() ?? GameInput.None;
  }
}
