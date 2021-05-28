import GameInput from '../GameInput';
import { VisibleGameState } from '../GameState';
import AIPlayer from './AIPlayer';

export default class IdleAI extends AIPlayer {
  Update(gameState: VisibleGameState, acceptInput: boolean): GameInput {
    return GameInput.None;
  }
}