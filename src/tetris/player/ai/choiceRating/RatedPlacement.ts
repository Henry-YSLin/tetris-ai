import GameAchievement from '../../../GameAchievement';
import { Rotation, TetrominoType } from '../../../Tetrominos';

type RatingFunction = (choice: RatedPlacement) => number;

export default class RatedPlacement {
  public readonly Rotation: Rotation;

  public readonly Column: number;

  public HighestRow = 0;

  public HeightMap: number[] = [];

  public EnclosedHoles = 0;

  public OpenHoles = 0;

  public BlocksAboveHoles = 0;

  public IWells: number[] = [];

  public IsDead = false;

  public HoldPiece: TetrominoType = TetrominoType.None;

  public Achievement: GameAchievement | null = null;

  public readonly RatingFunction: RatingFunction;

  #ratingCache: number | null = null;

  public constructor(rotation: Rotation, column: number, ratingFunction: RatingFunction) {
    this.Rotation = rotation;
    this.Column = column;
    this.RatingFunction = ratingFunction;
  }

  public get GlobalHighestRow(): number {
    return this.HeightMap.max();
  }

  public get Bumpiness(): number {
    return this.HeightMap.reduce(
      (prev, curr, idx) => prev + (idx === 0 ? 0 : Math.abs(curr - this.HeightMap[idx - 1])),
      0
    );
  }

  public get Rating(): number {
    if (this.#ratingCache) {
      return this.#ratingCache;
    }
    const ret = this.RatingFunction(this);
    this.#ratingCache = ret;
    return ret;
  }

  public static readonly Never: RatedPlacement = new RatedPlacement(0, 0, () => Number.MIN_VALUE);
}
