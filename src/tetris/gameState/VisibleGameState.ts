import GameAchievement from '../GameAchievement';
import GlobalConfiguration from '../GlobalConfiguration';
import Tetromino from '../Tetromino';
import { TetrominoType } from '../Tetrominos';
import HoldInfo from './HoldInfo';

export default class VisibleGameState {
  public readonly Configuration: GlobalConfiguration;

  public readonly Grid: TetrominoType[][];

  public readonly Falling: Tetromino | null;

  public readonly Hold: HoldInfo | null;

  public readonly BlockHold: boolean;

  public readonly TicksElapsed: number;

  public readonly PieceQueue: TetrominoType[];

  public readonly PieceIndex: number;

  public readonly Combo: number;

  public readonly LastAchievement: GameAchievement | null;

  public readonly IsDead: boolean;

  public get GridWidth(): number {
    return this.Configuration.GridWidth;
  }

  public get GridHeight(): number {
    return this.Configuration.GridHeight;
  }

  public get PlayfieldHeight(): number {
    return this.Configuration.PlayfieldHeight;
  }

  public constructor(
    configuration: GlobalConfiguration,
    pieceQueue: TetrominoType[] = [],
    pieceIndex = 0,
    grid: TetrominoType[][] | undefined = undefined,
    falling: Tetromino | null = null,
    hold: HoldInfo | null = null,
    elapsed = 0,
    blockHold = false,
    combo = 0,
    lastAchievement: GameAchievement | null = null,
    isDead = false
  ) {
    this.Configuration = configuration;
    this.Grid = new Array(this.GridHeight).fill(null).map(() => new Array(this.GridWidth).fill(TetrominoType.None));
    if (grid)
      grid.forEach((arr, i) =>
        arr.forEach((p, j) => {
          this.Grid[i][j] = p;
        })
      );
    this.Falling = falling ? falling.Clone() : null;
    this.Hold = hold ? hold.Clone() : null;
    this.BlockHold = blockHold;
    this.TicksElapsed = elapsed;
    this.PieceQueue = pieceQueue;
    this.PieceIndex = pieceIndex;
    this.Combo = combo;
    this.LastAchievement = lastAchievement;
    this.IsDead = isDead;
  }
}
