import GameInput from '../GameInput';
import { VisibleGameState } from '../GameState';
import AIPlayer from './AIPlayer';

export default class RandomAI extends AIPlayer {
  Update(_gameState: VisibleGameState, _acceptInput: boolean): GameInput {
    return Math.floor(Math.random() * 7 + 1);
  }
}