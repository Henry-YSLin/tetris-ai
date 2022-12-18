import GameInput from '../../GameInput';
import { VisibleGameState } from '../../GameState';
import AIPlayer from './AIPlayer';
import { DelayedInputControl } from '../input/DelayedInputManager';

export default class TopOutAI extends AIPlayer {
  protected override ProcessTick(gameState: VisibleGameState, inputControl: DelayedInputControl): void {
    if (inputControl.CanInputThisFrame(gameState)) inputControl.addInput(GameInput.HardDrop);
  }
}
