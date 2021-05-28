import { Tetrominos, Tetromino, RotationDirection } from './Tetrominos';
import Point from './utils/Point';
import './utils/Array';
import { DROP_INTERVAL, GRID_HEIGHT, GRID_WIDTH, LOCK_DELAY, PLAYFIELD_HEIGHT, QUEUE_LENGTH } from './Consts';
import PieceGenerator from './PieceGenerator';
import FallingTetromino  from './FallingTetromino';


export class VisibleGameState {
  Grid: Tetromino[][];
  Falling: FallingTetromino | null;
  Hold: Tetromino;
  BlockHold: boolean;
  TicksElapsed: number;
  PieceQueue: Tetromino[];
  PieceIndex: number;

  constructor(
    pieceQueue: Tetromino[] = [],
    pieceIndex = 0,
    grid: Tetromino[][] | undefined = undefined,
    falling: FallingTetromino | null = null,
    hold: Tetromino = Tetromino.None,
    elapsed = 0,
    blockHold = false,
  ) {
    this.Grid = new Array(40).fill(null).map(() => new Array(10).fill(Tetromino.None));
    if (grid)
      grid.forEach((arr, i) => arr.forEach((p, j) => this.Grid[i][j] = p));
    this.Falling = falling ? falling.Clone() : null;
    this.Hold = hold;
    this.BlockHold = blockHold;
    this.TicksElapsed = elapsed;
    this.PieceQueue = pieceQueue;
    this.PieceIndex = pieceIndex;
  }
}
export class GameState {
  Grid: Tetromino[][];
  Falling: FallingTetromino | null;
  Hold: Tetromino;
  /**
   * Whether to disallow hold, reset when a new tetromino is dequeued
   */
  BlockHold: boolean;
  /**
   * see Consts/TICK_RATE
   */
  TicksElapsed: number;
  #pieces: PieceGenerator;
  /**
   * Index of the next piece in queue
   */
  PieceIndex: number;

  get GridWidth(): number {
    return GRID_WIDTH;
  }

  get GridHeight(): number {
    return GRID_HEIGHT;
  }

  get PlayfieldHeight(): number {
    return PLAYFIELD_HEIGHT;
  }

  get PieceQueue(): Tetromino[] {
    return this.#pieces.GetRange(this.PieceIndex, QUEUE_LENGTH);
  }

  Get(x: number, y: number): Tetromino | null;

  Get(p: Point): Tetromino | null;

  Get(xOrP: number|Point, y: number | undefined = undefined): Tetromino | null {
    let _x: number, _y: number;
    if (xOrP instanceof Point) {
      _x = xOrP.X;
      _y = xOrP.Y;
    }
    else if (y !== undefined) {
      _x = xOrP;
      _y = y;
    }
    else{
      return null;
    }
    if (_x < 0 || _y < 0 || _x >= GRID_WIDTH || _y >= GRID_HEIGHT)
      return null;
    return this.Grid[_y][_x];
  }

  /**
   * Test whether the currently falling piece, or another falling piece is valid
   * for this game grid.
   * @param falling Optionally specify a falling piece to be tested
   * @returns Whether the falling piece is not out of bounds and is not overlapping with locked pieces
   */
  IsPieceValid(falling: FallingTetromino | undefined = undefined): boolean {
    if (falling)
      return !falling.Points.some(p => (this.Get(p) ?? Tetromino.I) !== Tetromino.None);
    if (this.Falling)
      return !this.Falling.Points.some(p => (this.Get(p) ?? Tetromino.I) !== Tetromino.None);
    return true;
  }

  /**
   * Attempt to dequeue a piece from the queue and start dropping it
   * @returns Whether the dequeue is successful
   */
  DequeuePiece(): boolean {
    if (this.Falling !== null) return false;
    this.Falling = FallingTetromino.Spawn(this.#pieces.Get(this.PieceIndex++), this.TicksElapsed);
    this.BlockHold = false;
    return true;
  }

  /**
   * Attempt to hold the current piece
   * @returns Whether the hold was successful
   */
  HoldPiece(): boolean {
    if (this.Falling === null) return false;
    if (this.BlockHold) return false;
    let hold = this.Hold;
    this.Hold = this.Falling.Type;
    if (hold === Tetromino.None)
      hold = this.#pieces.Get(this.PieceIndex++);
    this.Falling = FallingTetromino.Spawn(hold, this.TicksElapsed);
    this.BlockHold = true;
    return true;
  }

  /**
   * Attempt to lock the currently falling piece.
   * @returns Whether the lock was successful
   */
  LockPiece(): boolean {
    if (this.Falling === null) return false;
    if (!this.IsPieceValid()) return false;
    this.Falling.Points.forEach(p => this.Grid[p.Y][p.X] = this.Falling?.Type ?? Tetromino.None);
    this.Falling = null;
    return true;
  }

  /**
   * Attempt to rotate the currently falling piece in the specified direction,
   * taking wall kick into consideration.
   * @param direction Direction of rotation, clockwise or counter-clockwise
   * @returns Whether the rotation was successful
   */
  RotatePiece(direction: RotationDirection = RotationDirection.CW): boolean {
    if (this.Falling === null) return false;
    const kick = Tetrominos[this.Falling.Type].WallKick[this.Falling.Rotation][direction]
      .find(p => {
        const falling = this.Falling?.Clone();
        if (!falling) return false;
        falling.Rotate(direction);
        falling.Position = falling.Position.Add(p);
        return this.IsPieceValid(falling);
      });
    console.log(kick);
    if (!kick) return false;
    this.Falling.Rotate(direction);
    this.Falling.Position = this.Falling.Position.Add(kick);
    this.Falling.LastActionTick = this.TicksElapsed;
    this.Falling.ActionCount++;
    return true;
  }

  ShiftPiece(offset: number): boolean {
    if (this.Falling === null) return false;
    const falling = this.Falling.Clone();
    falling.Position.X += offset;
    if (!this.IsPieceValid(falling)) return false;
    this.Falling = falling;
    this.Falling.LastActionTick = this.TicksElapsed;
    this.Falling.ActionCount++;
    return true;
  }

  CanPieceDrop(falling: FallingTetromino | undefined = undefined): boolean {
    let f: FallingTetromino;
    if (falling) {
      f = falling.Clone();
    }
    else if (this.Falling) {
      f = this.Falling.Clone();
    }
    else return false;
    f.Position.Y--;
    return this.IsPieceValid(f);
  }

  SoftDropPiece(isAuto = false): boolean {
    if (this.Falling === null) return false;
    if (!this.CanPieceDrop()) return false;
    this.Falling.Position.Y--;
    this.Falling.LastActionTick = this.TicksElapsed;
    this.Falling.ActionCount = 0;
    if (isAuto)
      this.Falling.DropTick = this.TicksElapsed;
    return true;
  }

  HardDropPiece(falling: FallingTetromino | undefined = undefined): boolean {
    let f : FallingTetromino;
    if (falling) {
      f = falling;
    }
    else if (this.Falling) {
      f = this.Falling;
    }
    else return false;
    while (this.IsPieceValid(f)) {
      f.Position.Y--;
    }
    f.Position.Y++;
    if (f === this.Falling)
      return this.LockPiece();
    else return true;
  }

  Tick(): void {
    if (this.Falling === null) {
      this.DequeuePiece();
    }
    else {
      if (this.TicksElapsed - this.Falling.DropTick >= DROP_INTERVAL)
        this.SoftDropPiece(true);
      if (this.TicksElapsed - this.Falling.LastActionTick >= LOCK_DELAY && !this.CanPieceDrop())
        this.LockPiece();
    }

    this.TicksElapsed++;
  }

  /**
   * Get an object containing only information that is currently visible to the player
   * @returns An object representing game states that are currently visible to the player
   */
  GetVisibleState(): VisibleGameState {
    return new VisibleGameState(
      this.PieceQueue,
      this.PieceIndex,
      this.Grid,
      this.Falling,
      this.Hold,
      this.TicksElapsed,
      this.BlockHold,
    );
  }

  /**
   * Create a GameState from visible information, allowing gameplay simulations
   * @param visible A VisibleGameState
   */
  constructor(visible: VisibleGameState);

  /**
   * Create a normal game state
   * @param pieceSeed The seed for the internal PieceGenerator
   * @param pieceIndex The starting index of the piece queue
   * @param falling The currently falling tetromino
   * @param hold The tetromino type of the held piece
   * @param elapsed The ticks elapsed since game start
   * @param blockHold Whether the hold action is disallowed
   */
  constructor(
    pieceSeed?: number,
    pieceIndex?: number,
    falling?: FallingTetromino,
    hold?: Tetromino,
    elapsed?: number,
    blockHold?: boolean,
  );

  constructor(
    pieceSeedOrState: VisibleGameState | number | undefined = undefined,
    pieceIndex = 0,
    falling: FallingTetromino | null = null,
    hold: Tetromino = Tetromino.None,
    elapsed = 0,
    blockHold = false,
  ) {
    if (pieceSeedOrState instanceof VisibleGameState) {
      const state = pieceSeedOrState;
      this.Grid = state.Grid;
      this.Falling = state.Falling;
      this.Hold = state.Hold;
      this.BlockHold = state.BlockHold;
      this.TicksElapsed = state.TicksElapsed;
      this.#pieces = new PieceGenerator(state.PieceQueue, state.PieceIndex);
      this.PieceIndex = state.PieceIndex;
    }
    else {
      this.Grid = new Array(40).fill(null).map(() => new Array(10).fill(Tetromino.None));
      this.Falling = falling;
      this.Hold = hold;
      this.BlockHold = blockHold;
      this.TicksElapsed = elapsed;
      this.#pieces = new PieceGenerator(pieceSeedOrState);
      this.PieceIndex = pieceIndex;
    }
  }
}
export default GameState;