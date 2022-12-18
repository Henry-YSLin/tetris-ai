import Player from '../Player';
import { AI_ACTION_DELAY } from '../../Consts';
import DelayedInputManager, { DelayedInputControl } from '../input/DelayedInputManager';
import { VisibleGameState } from '../../GameState';

/**
 * An AI with a custom input manager which constraints its APM.
 */
export default abstract class AIPlayer extends Player {
  public constructor() {
    super(new DelayedInputManager(AI_ACTION_DELAY));
  }
  protected abstract override ProcessTick(gameState: VisibleGameState, inputControl: DelayedInputControl): void;
}
