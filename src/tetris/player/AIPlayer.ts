import GameInput from '../GameInput';
import { VisibleGameState } from '../GameState';
import Player from './Player';
import InputDelayable from './InputDelayable';

/**
 * An AI must have its APM constrained
 */
export default abstract class AIPlayer extends InputDelayable(Player) {
  abstract Update(_gameState: VisibleGameState, _acceptInput: boolean): GameInput;
}