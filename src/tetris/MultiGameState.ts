import { TetrominoType } from './Tetrominos';
import './utils/Array';
import { GARBAGE_DELAY, GRID_HEIGHT, GRID_WIDTH, PLAYFIELD_HEIGHT } from './Consts';
import Tetromino  from './Tetromino';
import GameAchievement from './GameAchievement';
import GameState, { VisibleGameState } from './GameState';
import GarbageGenerator from './GarbageGenerator';

export class GarbageEntry {
  /**
   * The number of garbage lines this entry contains.
   * These lines should have holes in the same location.
   */
  Lines: number;
  /**
   * The game tick at which this entry is enqueued into a garbage meter
   */
  TickEnqueued: number;

  constructor(lines: number, tickEnqueued: number) {
    this.Lines = lines;
    this.TickEnqueued = tickEnqueued;
  }

  Clone(): GarbageEntry {
    return new GarbageEntry(
      this.Lines,
      this.TickEnqueued,
    );
  }
}

export class VisibleMultiGameState extends VisibleGameState {
  GarbageMeter: GarbageEntry[];

  constructor(
    pieceQueue: TetrominoType[] = [],
    pieceIndex = 0,
    grid: TetrominoType[][] | undefined = undefined,
    gridWidth: number = GRID_WIDTH,
    gridHeight: number = GRID_HEIGHT,
    playfieldHeight: number = PLAYFIELD_HEIGHT,
    falling: Tetromino | null = null,
    hold: TetrominoType = TetrominoType.None,
    elapsed = 0,
    blockHold = false,
    combo = 0,
    lastAchievement: GameAchievement | null = null,
    isDead = false,
    garbageMeter: GarbageEntry[] = [],
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
      isDead,
    );
    this.GarbageMeter = garbageMeter.map(x => x.Clone());
  }
}

export class MultiGameState extends GameState {
  GarbageMeter: GarbageEntry[];
  #garbageGenerator: GarbageGenerator | null;

  /**
   * Create a MultiGameState from visible information, allowing gameplay simulations
   * @param visible A VisibleMultiGameState
   */
  constructor(visible: VisibleMultiGameState);

  /**
   * Create a normal game state
   * @param pieceSeed The seed for the internal PieceGenerator
   * @param pieceIndex The starting index of the piece queue
   * @param falling The currently falling tetromino
   * @param hold The tetromino type of the held piece
   * @param elapsed The ticks elapsed since game start
   * @param blockHold Whether the hold action is disallowed
   * @param combo The number of consecutive line clear
   */
  constructor(
    pieceSeed?: number,
    pieceIndex?: number,
    falling?: Tetromino,
    hold?: TetrominoType,
    elapsed?: number,
    blockHold?: boolean,
    combo?: number,
    lastAchievement?: GameAchievement | null,
    isDead?: boolean,
    garbageMeter?: GarbageEntry[],
    garbageSeed?: number,
  );

  constructor(
    pieceSeedOrState: VisibleMultiGameState | number | undefined = undefined,
    pieceIndex = 0,
    falling: Tetromino | null = null,
    hold: TetrominoType = TetrominoType.None,
    elapsed = 0,
    blockHold = false,
    combo = 0,
    lastAchievement: GameAchievement | null = null,
    isDead = false,
    garbageMeter: GarbageEntry[] = [],
    garbageSeed: number| undefined = undefined,
  ) {
    super(
      pieceSeedOrState as any, /* eslint-disable-line @typescript-eslint/no-explicit-any */
      pieceIndex,
      falling ?? undefined,
      hold,
      elapsed,
      blockHold,
      combo,
      lastAchievement,
      isDead,
    );
    if (pieceSeedOrState instanceof VisibleMultiGameState) {
      const state = pieceSeedOrState;
      this.GarbageMeter = state.GarbageMeter;
      this.#garbageGenerator = null;
    }
    else {
      this.GarbageMeter = garbageMeter;
      this.#garbageGenerator = new GarbageGenerator(garbageSeed);
    }
  }

  /**
   * Get an object containing only information that is currently visible to the player
   * @returns An object representing game states that are currently visible to the player
   */
  GetVisibleState(): VisibleMultiGameState {
    return new VisibleMultiGameState(
      this.PieceQueue,
      this.PieceIndex,
      this.Grid,
      this.GridWidth,
      this.GridHeight,
      this.PlayfieldHeight,
      this.Falling,
      this.Hold,
      this.TicksElapsed,
      this.BlockHold,
      this.Combo,
      this.LastAchievement?.Clone(),
      this.IsDead,
      this.GarbageMeter,
    );
  }

  SpawnGarbageLines(lines = 1): void {
    if (!this.#garbageGenerator) return;
    const garbageLine = new Array(this.GridWidth).fill(TetrominoType.Garbage);
    garbageLine[this.#garbageGenerator.Get(this.GridWidth)] = TetrominoType.None;
    for (let i = 0; i < lines; i++) {
      this.Grid.unshift(garbageLine.slice());
      this.Grid.pop();
    }
    if (this.Falling)
      while (!this.IsPieceValid()) this.Falling.Position.Y++;
  }

  /**
   * Cancel a specified number of lines from the garbage meter, then return the
   * number of lines that are not yet cancelled.
   * @param lines Lines to cancel from the garbage meter
   * @returns The remaining lines that are not cancelled
   */
  CancelGarbage(lines: number): number {
    while (lines > 0 || this.GarbageMeter.length > 0) {
      const entry = this.GarbageMeter.minBy(x => x.TickEnqueued);
      if (entry.Lines >= lines) {
        entry.Lines -= lines;
        lines = 0;
      }
      else {
        lines -= entry.Lines;
        this.GarbageMeter.splice(this.GarbageMeter.indexOf(entry), 1);
      }
    }
    return lines;
  }

  Tick(): void {
    if (this.IsDead) return;
    this.GarbageMeter.forEach(entry => {
      if (entry.Lines <= 0) return;
      if (this.TicksElapsed - entry.TickEnqueued >= GARBAGE_DELAY) {
        this.SpawnGarbageLines(entry.Lines);
      }
    });
    this.GarbageMeter = this.GarbageMeter.filter(x => this.TicksElapsed - x.TickEnqueued < GARBAGE_DELAY && x.Lines > 0);
    super.Tick();
  }
}
export default MultiGameState;