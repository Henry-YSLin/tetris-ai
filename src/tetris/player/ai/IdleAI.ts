import { VisibleGameState } from '../../GameState';
import AIPlayer from './AIPlayer';
import { DelayedInputControl } from '../input/DelayedInputManager';

export default class IdleAI extends AIPlayer {
  protected override processTick(gameState: VisibleGameState, inputControl: DelayedInputControl): void {
    // idle
  }
}
