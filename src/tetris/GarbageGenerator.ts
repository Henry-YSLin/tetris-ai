import seededRNG, { RNG } from './utils/Random';

export default class GarbageGenerator {
  #RNG: RNG;

  #seed: number;

  constructor(seed?: number) {
    if (seed === undefined) this.#seed = Math.floor(Math.random() * 2 ** 32);
    else this.#seed = seed;
    this.#RNG = seededRNG(this.#seed);
  }

  get Seed(): number {
    return this.#seed;
  }

  /**
   * Generate a garbage line
   * @param width Width of the playfield/grid
   * @returns The index at which the hole of the garbage line should be
   */
  Get(width: number): number {
    return Math.floor(this.#RNG() * width);
  }
}
