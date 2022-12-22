import { GRID_WIDTH, GRID_HEIGHT, PLAYFIELD_HEIGHT } from '../Consts';
import GameAchievement from '../GameAchievement';
import Tetromino from '../Tetromino';
import { TetrominoType } from '../Tetrominos';
import GarbageEntry from './GarbageEntry';
import HoldInfo from './HoldInfo';
import VisibleGameState from './VisibleGameState';

export default class VisibleMultiGameState extends VisibleGameState {
  public readonly GarbageMeter: GarbageEntry[];

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
    isDead = false,
    garbageMeter: GarbageEntry[] = []
  ) {
    super(
      pieceQueue,
      pieceIndex,
      grid,
      gridWidth,
      gridHeight,
      playfieldHeight,
      falling,
      hold,
      elapsed,
      blockHold,
      combo,
      lastAchievement,
      isDead
    );
    this.GarbageMeter = garbageMeter.map(x => x.Clone());
  }
}
