import { GRID_WIDTH, GRID_HEIGHT, PLAYFIELD_HEIGHT } from '../Consts';
import GameAchievement from '../GameAchievement';
import Tetromino from '../Tetromino';
import { TetrominoType } from '../Tetrominos';
import HoldInfo from './HoldInfo';

export default class VisibleGameState {
  public readonly Grid: TetrominoType[][];

  public readonly GridWidth: number;

  public readonly GridHeight: number;

  public readonly PlayfieldHeight: number;

  public readonly Falling: Tetromino | null;

  public readonly Hold: HoldInfo | null;

  public readonly BlockHold: boolean;

  public readonly TicksElapsed: number;

  public readonly PieceQueue: TetrominoType[];

  public readonly PieceIndex: number;

  public readonly Combo: number;

  public readonly LastAchievement: GameAchievement | null;

  public readonly IsDead: boolean;

  public constructor(
    pieceQueue: TetrominoType[] = [],
    pieceIndex = 0,
    grid: TetrominoType[][] | undefined = undefined,
    gridWidth: number = GRID_WIDTH,
    gridHeight: number = GRID_HEIGHT,
    playfieldHeight: number = PLAYFIELD_HEIGHT,
    falling: Tetromino | null = null,
    hold: HoldInfo | null = null,
    elapsed = 0,
    blockHold = false,
    combo = 0,
    lastAchievement: GameAchievement | null = null,
    isDead = false
  ) {
    this.Grid = new Array(gridHeight).fill(null).map(() => new Array(gridWidth).fill(TetrominoType.None));
    if (grid)
      grid.forEach((arr, i) =>
        arr.forEach((p, j) => {
          this.Grid[i][j] = p;
        })
      );
    this.GridWidth = gridWidth;
    this.GridHeight = gridHeight;
    this.PlayfieldHeight = playfieldHeight;
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
