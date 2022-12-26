import GameAchievement from '../GameAchievement';
import GlobalConfiguration from '../GlobalConfiguration';
import Tetromino from '../Tetromino';
import { TetrominoType } from '../Tetrominos';
import GarbageEntry from './GarbageEntry';
import HoldInfo from './HoldInfo';
import VisibleGameState from './VisibleGameState';

export default class VisibleMultiGameState extends VisibleGameState {
  public readonly GarbageMeter: GarbageEntry[];

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
    isDead = false,
    garbageMeter: GarbageEntry[] = []
  ) {
    super(
      configuration,
      pieceQueue,
      pieceIndex,
      grid,
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
