import GameInput from '../GameInput';
import { VisibleGameState } from '../GameState';
import AIPlayer from './AIPlayer';

export default class RandomAI extends AIPlayer {
  Update(gameState: VisibleGameState, acceptInput: boolean): GameInput {
    return Math.floor(Math.random() * 7 + 1);
  }
}