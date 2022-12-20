import { VisibleGameState } from '../GameState';
import InputManager, { InputControl } from './input/InputManager';
import Player from './Player';

export default class HumanPlayer extends Player {
  public constructor() {
    super(new InputManager());
  }

  // human player input is added externally
  protected ProcessTick(gameState: VisibleGameState, inputControl: InputControl): void {}
}
