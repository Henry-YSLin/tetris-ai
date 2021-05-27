import { Tetromino } from './Tetrominos';
import seededRNG, { RNG } from './utils/Random';

export default class PieceGenerator {
  RNG: RNG;
  #seed: number;
  #cache: Tetromino[];

  get seed(): number {
    return this.#seed;
  }

  generate(): void {
    const choices = [
      Tetromino.I,
      Tetromino.J,
      Tetromino.L,
      Tetromino.O,
      Tetromino.S,
      Tetromino.T,
      Tetromino.Z,
    ];
    while (choices.length > 0) {
      const r = this.RNG() % choices.length;
      this.#cache.push(choices.splice(r, 1)[0]);
    }
  }

  Get(index: number): Tetromino {
    while (this.#cache.length <= index)
      this.generate();
    return this.#cache[index];
  }

  GetRange(start: number, length: number) : Tetromino[] {
    while (this.#cache.length <= start + length)
      this.generate();
    return this.#cache.slice(start, start + length);
  }

  constructor(seed: number | undefined = undefined) {
    if (seed)
      this.#seed = seed;
    else
      this.#seed = Math.floor(Math.random() * (2 ** 32));
    this.RNG = seededRNG(this.#seed);
    this.#cache = [];
  }
}