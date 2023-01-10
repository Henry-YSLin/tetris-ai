import { FieldsOf } from './utils/TypeUtils';

export default class GlobalConfiguration {
  /**
   * The width of the grid in blocks.
   */
  public GridWidth = 4;

  /**
   * The height of the grid in blocks.
   */
  public GridHeight = 40;

  /**
   * The height of the visible area of the grid, in blocks.
   */
  public PlayfieldHeight = 20;

  /**
   * The number of game ticks per second.
   */
  public TickRate = 60;

  /**
   * The number of ticks from contact to locking the piece.
   */
  public LockDelay = 60;

  /**
   * The number of ticks between each drop by gravity.
   */
  public DropInterval = 50;

  /**
   * The number of visible pieces in the queue.
   */
  public QueueLength = 0;

  /**
   * Number of ticks to wait in the garbage meter before garbage lines are
   * actually created
   */
  public GarbageDelay = 4 * 60;

  public UpdateConfig(options: Partial<FieldsOf<GlobalConfiguration>>): void {
    this.GridWidth = options.gridWidth ?? this.GridWidth;
    this.GridHeight = options.gridHeight ?? this.GridHeight;
    this.PlayfieldHeight = options.playfieldHeight ?? this.PlayfieldHeight;
    this.TickRate = options.tickRate ?? this.TickRate;
    this.LockDelay = options.lockDelay ?? this.LockDelay;
    this.DropInterval = options.dropInterval ?? this.DropInterval;
    this.QueueLength = options.queueLength ?? this.QueueLength;
    this.GarbageDelay = options.garbageDelay ?? this.GarbageDelay;
  }

  public constructor(options: Partial<FieldsOf<GlobalConfiguration>> = {}) {
    this.UpdateConfig(options);
  }

  public Serialize(): FieldsOf<GlobalConfiguration> {
    return {
      gridWidth: this.GridWidth,
      gridHeight: this.GridHeight,
      playfieldHeight: this.PlayfieldHeight,
      tickRate: this.TickRate,
      lockDelay: this.LockDelay,
      dropInterval: this.DropInterval,
      queueLength: this.QueueLength,
      garbageDelay: this.GarbageDelay,
    };
  }
}
