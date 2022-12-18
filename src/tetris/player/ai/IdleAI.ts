import { VisibleGameState } from '../../GameState';
import AIPlayer from './AIPlayer';
import { DelayedInputControl } from '../input/DelayedInputManager';

export default class IdleAI extends AIPlayer {
  protected override ProcessTick(_gameState: VisibleGameState, _inputControl: DelayedInputControl): void {
    // idle
  }
}
