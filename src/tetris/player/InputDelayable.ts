import { AI_ACTION_DELAY } from '../Consts';
import GameInput from '../GameInput';
import { VisibleGameState } from '../GameState';
import { Constructor, Subtract } from '../utils/Mixin';
import { InputQueueable } from './InputQueueable';
import Player, { Playable } from './Player';

export type InputDelayableContent = {
  Tick(gameState: VisibleGameState): GameInput;
  Update(_gameState: VisibleGameState, _acceptInput: boolean): GameInput;
  ConfigureInputDelayable(actionDelay: number): void;
};

export function IsInputDelayable(maybe: Player): maybe is Player & InputDelayableContent {
  return 'ConfigureInputDelayable' in maybe;
}

export type InputDelayable = Constructor<InputDelayableContent>;

export default function WithInputDelay<TBase extends Playable>(
  Base: Subtract<TBase, InputQueueable>
): TBase & InputDelayable {
  return class InputDelayable extends Base {
    #lastActionTick: number;

    #actionDelay: number;

    constructor(...args: any[]) {
      super(...args);
      this.#lastActionTick = 0;
      this.#actionDelay = AI_ACTION_DELAY;
    }

    Tick(gameState: VisibleGameState): GameInput {
      const acceptInput = gameState.TicksElapsed - this.#lastActionTick >= this.#actionDelay;
      const input = this.Update(gameState, acceptInput);
      if (acceptInput) {
        if (input !== GameInput.None) this.#lastActionTick = gameState.TicksElapsed;
        return input;
      }
      return GameInput.None;
    }

    ConfigureInputDelayable(actionDelay: number): void {
      this.#actionDelay = actionDelay;
    }

    Update(_gameState: VisibleGameState, _acceptInput: boolean): GameInput {
      return GameInput.None;
    }
  };
}
