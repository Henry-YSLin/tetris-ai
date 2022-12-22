import { TetrominoType } from './Tetrominos';
import SeededRNG, { RNG } from './utils/Random';

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
  public constructor(cache: TetrominoType[], start: number);

  /**
   * Creates a seeded PieceGenerator.
   * @param seed The seed for RNG, omit for a random seed
   */
  public constructor(seed: number | undefined);

  public constructor(seed: TetrominoType[] | number | undefined = undefined, start = NaN) {
    if (seed instanceof Array) {
      this.#seed = null;
      this.#cache = new Array(start + seed.length).fill(TetrominoType.None);
      this.#cache.splice(start, seed.length, ...seed);
      this.#RNG = null;
      return;
    }
    if (seed === undefined) this.#seed = Math.floor(Math.random() * 2 ** 32);
    else this.#seed = seed;
    this.#RNG = SeededRNG(this.#seed);
    this.#cache = [];
  }

  public get Seed(): number | null {
    return this.#seed;
  }

  public Generate(): void {
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

  public Get(index: number): TetrominoType {
    while (this.#cache.length <= index) this.Generate();
    return this.#cache[index];
  }

  public GetRange(start: number, length: number): TetrominoType[] {
    while (this.#cache.length <= start + length) this.Generate();
    return this.#cache.slice(start, start + length);
  }
}
