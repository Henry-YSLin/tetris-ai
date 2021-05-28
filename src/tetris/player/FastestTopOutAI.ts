import GameInput from '../GameInput';
import { VisibleGameState } from '../GameState';
import AIPlayer from './AIPlayer';

export default class FastestTopOutAI extends AIPlayer {
  Update(gameState: VisibleGameState, acceptInput: boolean): GameInput {
    if (acceptInput && gameState.Falling)
      return GameInput.HardDrop;
    return GameInput.None;
  }
}