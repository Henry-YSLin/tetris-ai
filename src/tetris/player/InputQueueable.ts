import GameInput from '../GameInput';
import { VisibleGameState } from '../GameState';
import { Constructor } from '../utils/Mixin';
import { IsInputDelayable } from './InputDelayable';
import { Playable } from './Player';

export type InputQueueable = Constructor<{
  Tick(_gameState: VisibleGameState): GameInput;
  Update(_gameState: VisibleGameState, acceptInput: boolean): GameInput;
  Enqueue(input: GameInput): void;
}>;

export default function WithInputQueue<TBase extends Playable>(Base: TBase): TBase & InputQueueable {
  return class InputQueueable extends Base {
    #queue: GameInput[];

    constructor(...args: any[]) {
      super(...args);
      this.#queue = [];
    }

    Tick(gameState: VisibleGameState): GameInput {
      if (IsInputDelayable(this)) return super.Tick(gameState);
      return this.#queue.shift() ?? GameInput.None;
    }

    Update(_gameState: VisibleGameState, acceptInput: boolean): GameInput {
      if (acceptInput) return this.#queue.shift() ?? GameInput.None;
      return GameInput.None;
    }

    Enqueue(input: GameInput): void {
      this.#queue.push(input);
    }
  };
}
