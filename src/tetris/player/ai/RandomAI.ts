import { VisibleGameState } from '../../GameState';
import AIPlayer from './AIPlayer';
import { DelayedInputControl } from '../input/DelayedInputManager';

export default class RandomAI extends AIPlayer {
  protected override ProcessTick(gameState: VisibleGameState, inputControl: DelayedInputControl): void {
    if (inputControl.CanInputThisFrame(gameState)) inputControl.addInput(Math.floor(Math.random() * 7 + 1));
  }
}
