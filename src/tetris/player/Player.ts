import GameInput from '../GameInput';
import { VisibleGameState } from '../GameState';

export default interface Player {
  Tick(gameState: VisibleGameState): GameInput;
}