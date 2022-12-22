import GameInput from '../../GameInput';
import AIPlayer from './AIPlayer';
import { DelayedInputControl } from '../input/DelayedInputManager';
import VisibleGameState from '../../gameState/VisibleGameState';

export default class TopOutAI extends AIPlayer {
  protected override processTick(gameState: VisibleGameState, inputControl: DelayedInputControl): void {
    if (inputControl.CanInputThisFrame(gameState)) inputControl.AddInput(GameInput.HardDrop);
  }
}
