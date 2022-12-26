import { TetrominoType } from '../Tetrominos';
import '../utils/Array';
import Tetromino from '../Tetromino';
import GameAchievement from '../GameAchievement';
import GameState from './GameState';
import GarbageGenerator from '../GarbageGenerator';
import VisibleMultiGameState from './VisibleMultiGameState';
import GarbageEntry from './GarbageEntry';
import HoldInfo from './HoldInfo';
import GlobalConfiguration from '../GlobalConfiguration';

export default class MultiGameState extends GameState {
  public GarbageMeter: GarbageEntry[];

  #garbageGenerator: GarbageGenerator | null;

  /**
   * Create a MultiGameState from visible information, allowing gameplay simulations
   * @param visible A VisibleMultiGameState
   */
  public constructor(visible: VisibleMultiGameState);

  /**
   * Create a normal game state
   * @param configuration The global configuration
   * @param pieceSeed The seed for the internal PieceGenerator
   * @param pieceIndex The starting index of the piece queue
   * @param falling The currently falling tetromino
   * @param hold The tetromino type of the held piece
   * @param elapsed The ticks elapsed since game start
   * @param blockHold Whether the hold action is disallowed
   * @param combo The number of consecutive line clear
   */
  public constructor(
    configuration: GlobalConfiguration,
    pieceSeed?: number,
    pieceIndex?: number,
    falling?: Tetromino,
    hold?: HoldInfo | null,
    elapsed?: number,
    blockHold?: boolean,
    combo?: number,
    lastAchievement?: GameAchievement | null,
    isDead?: boolean,
    garbageMeter?: GarbageEntry[],
    garbageSeed?: number
  );

  public constructor(
    configurationOrState: GlobalConfiguration | VisibleMultiGameState,
    pieceSeed: number | undefined = undefined,
    pieceIndex = 0,
    falling: Tetromino | null = null,
    hold: HoldInfo | null = null,
    elapsed = 0,
    blockHold = false,
    combo = 0,
    lastAchievement: GameAchievement | null = null,
    isDead = false,
    garbageMeter: GarbageEntry[] = [],
    garbageSeed: number | undefined = undefined
  ) {
    super(
      configurationOrState as GlobalConfiguration,
      pieceSeed,
      pieceIndex,
      falling ?? undefined,
      hold,
      elapsed,
      blockHold,
      combo,
      lastAchievement,
      isDead
    );
    if (configurationOrState instanceof VisibleMultiGameState) {
      const state = configurationOrState;
      this.GarbageMeter = state.GarbageMeter;
      this.#garbageGenerator = null;
    } else {
      this.GarbageMeter = garbageMeter;
      this.#garbageGenerator = new GarbageGenerator(garbageSeed);
    }
  }

  /**
   * Get an object containing only information that is currently visible to the player
   * @returns An object representing game states that are currently visible to the player
   */
  public GetVisibleState(): VisibleMultiGameState {
    return new VisibleMultiGameState(
      this.Configuration,
      this.PieceQueue,
      this.PieceIndex,
      this.Grid,
      this.Falling,
      this.Hold,
      this.TicksElapsed,
      this.BlockHold,
      this.Combo,
      this.LastAchievement?.Clone(),
      this.IsDead,
      this.GarbageMeter
    );
  }

  public SpawnGarbageLines(lines = 1): void {
    if (!this.#garbageGenerator) return;
    const garbageLine = new Array(this.GridWidth).fill(TetrominoType.Garbage);
    garbageLine[this.#garbageGenerator.Get(this.GridWidth)] = TetrominoType.None;
    for (let i = 0; i < lines; i++) {
      this.Grid.unshift(garbageLine.slice());
      this.Grid.pop();
    }
    if (this.Falling) while (!this.IsPieceValid()) this.Falling.Position.Y++;
  }

  /**
   * Cancel a specified number of lines from the garbage meter, then return the
   * remaining number of lines that are not yet cancelled.
   * @param lines Lines to cancel from the garbage meter
   * @returns The remaining number of lines that are not cancelled
   */
  public CancelGarbage(lines: number): number {
    while (lines > 0 || this.GarbageMeter.length > 0) {
      const entry = this.GarbageMeter.minBy(x => x.TickEnqueued);
      if (entry.Lines >= lines) {
        entry.Lines -= lines;
        lines = 0;
      } else {
        lines -= entry.Lines;
        this.GarbageMeter.splice(this.GarbageMeter.indexOf(entry), 1);
      }
    }
    return lines;
  }

  public Tick(): void {
    if (this.IsDead) return;
    this.GarbageMeter.forEach(entry => {
      if (entry.Lines <= 0) return;
      if (this.TicksElapsed - entry.TickEnqueued >= this.Configuration.GarbageDelay) {
        this.SpawnGarbageLines(entry.Lines);
      }
    });
    this.GarbageMeter = this.GarbageMeter.filter(
      x => this.TicksElapsed - x.TickEnqueued < this.Configuration.GarbageDelay && x.Lines > 0
    );
    super.Tick();
  }
}
