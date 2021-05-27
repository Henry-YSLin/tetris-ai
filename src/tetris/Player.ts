import GameInput from './GameInput';
import GameState from './GameState';

export default interface Player {
  Tick(gameState: GameState): GameInput;
}