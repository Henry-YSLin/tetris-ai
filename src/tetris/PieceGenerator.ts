import { Tetromino } from './Tetrominos';
import seededRNG, { RNG } from './utils/Random';

export default class PieceGenerator {
  #RNG: RNG | null;
  #seed: number | null;
  #cache: Tetromino[];

  get Seed(): number | null {
    return this.#seed;
  }

  generate(): void {
    if (this.#seed === null || this.#RNG === null) {
      this.#cache.push(Tetromino.None);
      return;
    }
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
      const r = this.#RNG() % choices.length;
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

  /**
   * Create a mock PieceGenerator with the visible pieces only.
   * Attempting to access other unspecified pieces will result in
   * Tetromino.None since the seed is unknown.
   * @param cache The visible queue of pieces
   * @param start The index of the first piece in queue
   */
  constructor(cache: Tetromino[], start: number);

  /**
   * Creates a seeded PieceGenerator.
   * @param seed The seed for RNG, omit for a random seed
   */
  constructor(seed: number | undefined);

  constructor(seed: Tetromino[] | number | undefined = undefined, start = NaN) {
    if (seed instanceof Array){
      this.#seed = null;
      this.#cache = new Array(start + seed.length).fill(Tetromino.None);
      this.#cache.splice(start, seed.length, ...seed);
      this.#RNG = null;
      return;
    }
    if (seed === undefined)
      this.#seed = Math.floor(Math.random() * (2 ** 32));
    else
      this.#seed = seed;
    this.#RNG = seededRNG(this.#seed);
    this.#cache = [];
  }
}