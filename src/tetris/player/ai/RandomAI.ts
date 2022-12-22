import AIPlayer from './AIPlayer';
import { DelayedInputControl } from '../input/DelayedInputManager';
import VisibleGameState from '../../gameState/VisibleGameState';

export default class RandomAI extends AIPlayer {
  protected override processTick(gameState: VisibleGameState, inputControl: DelayedInputControl): void {
    if (inputControl.CanInputThisFrame(gameState)) inputControl.AddInput(Math.floor(Math.random() * 7 + 1));
  }
}
