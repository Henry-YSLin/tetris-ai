import GameInput from '../GameInput';
import { VisibleGameState } from '../GameState';
import Player from './Player';

export default class HumanPlayer implements Player {
  #queue: GameInput[];

  Tick(gameState: VisibleGameState): GameInput {
    return this.#queue.shift() ?? GameInput.None;
  }

  Enqueue(input: GameInput): void {
    this.#queue.push(input);
  }

  constructor() {
    this.#queue = [];
  }
}