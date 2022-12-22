import AIPlayer from './AIPlayer';
import { DelayedInputControl } from '../input/DelayedInputManager';
import VisibleGameState from '../../gameState/VisibleGameState';

export default class IdleAI extends AIPlayer {
  protected override processTick(gameState: VisibleGameState, inputControl: DelayedInputControl): void {
    // idle
  }
}
