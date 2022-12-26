import Player from '../Player';
import DelayedInputManager, { DelayedInputControl } from '../input/DelayedInputManager';
import VisibleGameState from '../../gameState/VisibleGameState';
import AIConfiguration from './AIConfiguration';

/**
 * An AI with a custom input manager which constraints its APM.
 */
export default abstract class AIPlayer extends Player {
  public readonly Configuration: AIConfiguration;

  public constructor(configuration: AIConfiguration) {
    super(new DelayedInputManager(configuration.ActionDelay));
    this.Configuration = configuration;
  }

  protected abstract override processTick(gameState: VisibleGameState, inputControl: DelayedInputControl): void;
}
