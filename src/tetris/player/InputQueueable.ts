import GameInput from '../GameInput';
import { VisibleGameState } from '../GameState';
import { Constructor, MixinArgs } from '../utils/Mixin';
import { Playable } from './Player';

export type InputQueueable = Constructor<{
  Tick(_gameState: VisibleGameState): GameInput,
  Update(_gameState: VisibleGameState, _acceptInput: boolean): GameInput,
  Enqueue(input: GameInput): void }>;

export default function InputQueueable<TBase extends Playable>(Base: TBase): TBase & InputQueueable {
  return class InputQueueable extends Base {
    #queue: GameInput[];

    constructor(...args: MixinArgs) {
      super(...args);
      this.#queue = [];
    }

    Tick(gameState: VisibleGameState): GameInput {
      if ('Update' in Base)
        return super.Tick(gameState);
      else
        return this.#queue.shift() ?? GameInput.None;
    }

    Update(_gameState: VisibleGameState, _acceptInput: boolean): GameInput {
      return this.#queue.shift() ?? GameInput.None;
    }

    Enqueue(input: GameInput): void {
      this.#queue.push(input);
    }
  };
}