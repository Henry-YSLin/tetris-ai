import { AI_ACTION_DELAY } from '../Consts';
import GameInput from '../GameInput';
import { VisibleGameState } from '../GameState';
import Player from './Player';

export default abstract class AIPlayer implements Player {
  #lastActionTick: number;

  Tick(gameState: VisibleGameState): GameInput {
    const acceptInput = gameState.TicksElapsed - this.#lastActionTick >= AI_ACTION_DELAY;
    const input = this.Update(
      gameState,
      acceptInput,
    );
    if (acceptInput) {
      if (input !== GameInput.None)
        this.#lastActionTick = gameState.TicksElapsed;
      return input;
    }
    return GameInput.None;
  }

  abstract Update(gameState: VisibleGameState, acceptInput: boolean): GameInput;

  constructor() {
    this.#lastActionTick = 0;
  }
}