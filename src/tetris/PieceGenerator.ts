import { TetrominoType } from './Tetrominos';
import seededRNG, { RNG } from './utils/Random';

export default class PieceGenerator {
  #RNG: RNG | null;

  #seed: number | null;

  #cache: TetrominoType[];

  /**
   * Create a mock PieceGenerator with the visible pieces only.
   * Attempting to access other unspecified pieces will result in
   * Tetromino.None since the seed is unknown.
   * @param cache The visible queue of pieces
   * @param start The index of the first piece in queue
   */
  constructor(cache: TetrominoType[], start: number);

  /**
   * Creates a seeded PieceGenerator.
   * @param seed The seed for RNG, omit for a random seed
   */
  constructor(seed: number | undefined);

  constructor(seed: TetrominoType[] | number | undefined = undefined, start = NaN) {
    if (seed instanceof Array) {
      this.#seed = null;
      this.#cache = new Array(start + seed.length).fill(TetrominoType.None);
      this.#cache.splice(start, seed.length, ...seed);
      this.#RNG = null;
      return;
    }
    if (seed === undefined) this.#seed = Math.floor(Math.random() * 2 ** 32);
    else this.#seed = seed;
    this.#RNG = seededRNG(this.#seed);
    this.#cache = [];
  }

  get Seed(): number | null {
    return this.#seed;
  }

  generate(): void {
    if (this.#seed === null || this.#RNG === null) {
      this.#cache.push(TetrominoType.None);
      return;
    }
    const choices = [
      TetrominoType.I,
      TetrominoType.J,
      TetrominoType.L,
      TetrominoType.O,
      TetrominoType.S,
      TetrominoType.T,
      TetrominoType.Z,
    ];
    while (choices.length > 0) {
      const r = Math.floor(this.#RNG() * choices.length) % choices.length;
      this.#cache.push(choices.splice(r, 1)[0]);
    }
  }

  Get(index: number): TetrominoType {
    while (this.#cache.length <= index) this.generate();
    return this.#cache[index];
  }

  GetRange(start: number, length: number): TetrominoType[] {
    while (this.#cache.length <= start + length) this.generate();
    return this.#cache.slice(start, start + length);
  }
}
