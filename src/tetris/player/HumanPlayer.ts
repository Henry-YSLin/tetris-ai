import VisibleGameState from '../gameState/VisibleGameState';
import InputManager, { InputControl } from './input/InputManager';
import Player from './Player';

export default class HumanPlayer extends Player {
  public constructor() {
    super(new InputManager());
  }

  // human player input is added externally
  protected processTick(gameState: VisibleGameState, inputControl: InputControl): void {}
}
