import GameInput from '../GameInput';
import { VisibleGameState } from '../GameState';
import AIPlayer from './AIPlayer';

export default class TopOutAI extends AIPlayer {
  Update(_gameState: VisibleGameState, _acceptInput: boolean): GameInput {
    return GameInput.HardDrop;
  }
}