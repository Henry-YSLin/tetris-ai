import { AI_ACTION_DELAY } from '../Consts';
import GameInput from '../GameInput';
import { VisibleGameState } from '../GameState';
import { Constructor, Subtract } from '../utils/Mixin';
import { InputQueueable } from './InputQueueable';
import { Playable } from './Player';

export type InputDelayable = Constructor<{
  Tick(gameState: VisibleGameState): GameInput,
  Update(_gameState: VisibleGameState, _acceptInput: boolean): GameInput
}>;

export default function InputDelayable<TBase extends Playable>(Base: Subtract<TBase, InputQueueable>): TBase & InputDelayable {
  return class InputDelayable extends Base {
    #lastActionTick: number;

    constructor(...args: any[]) {
      super(...args);
      this.#lastActionTick = 0;
    }

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

    Update(_gameState: VisibleGameState, _acceptInput: boolean): GameInput {
      return GameInput.None;
    }
  };
}