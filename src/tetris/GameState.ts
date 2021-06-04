import { Tetrominos, TetrominoType, RotationDirection } from './Tetrominos';
import Vector from './utils/Vector';
import './utils/Array';
import { DROP_INTERVAL, GRID_HEIGHT, GRID_WIDTH, LOCK_DELAY, PLAYFIELD_HEIGHT, QUEUE_LENGTH } from './Consts';
import PieceGenerator from './PieceGenerator';
import Tetromino  from './Tetromino';
import GameInput, { IsRotation } from './GameInput';
import TypedEvent from './utils/TypedEvent';
import GameAchievement, { AchievementType, BackToBackEligible } from './GameAchievement';


export class VisibleGameState {
  Grid: TetrominoType[][];
  Falling: Tetromino | null;
  Hold: TetrominoType;
  BlockHold: boolean;
  TicksElapsed: number;
  PieceQueue: TetrominoType[];
  PieceIndex: number;
  Combo: number;
  LastAchievement: GameAchievement | null;
  IsDead: boolean;

  constructor(
    pieceQueue: TetrominoType[] = [],
    pieceIndex = 0,
    grid: TetrominoType[][] | undefined = undefined,
    falling: Tetromino | null = null,
    hold: TetrominoType = TetrominoType.None,
    elapsed = 0,
    blockHold = false,
    combo = 0,
    lastAchievement: GameAchievement | null = null,
    isDead = false,
  ) {
    this.Grid = new Array(40).fill(null).map(() => new Array(10).fill(TetrominoType.None));
    if (grid)
      grid.forEach((arr, i) => arr.forEach((p, j) => this.Grid[i][j] = p));
    this.Falling = falling ? falling.Clone() : null;
    this.Hold = hold;
    this.BlockHold = blockHold;
    this.TicksElapsed = elapsed;
    this.PieceQueue = pieceQueue;
    this.PieceIndex = pieceIndex;
    this.Combo = combo;
    this.LastAchievement = lastAchievement;
    this.IsDead = isDead;
  }
}

export class GameState {
  Grid: TetrominoType[][];
  Falling: Tetromino | null;
  Hold: TetrominoType;
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
  /**
   * The number of consecutive line clear
   */
  Combo: number;
  /**
   * Used for detecting back-to-back achievements
   */
  LastAchievement: GameAchievement | null;
  IsDead: boolean;

  #achievement: TypedEvent<GameAchievement>;
  #dead: TypedEvent<void>;

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
  );

  constructor(
    pieceSeedOrState: VisibleGameState | number | undefined = undefined,
    pieceIndex = 0,
    falling: Tetromino | null = null,
    hold: TetrominoType = TetrominoType.None,
    elapsed = 0,
    blockHold = false,
    combo = 0,
    lastAchievement: GameAchievement | null = null,
    isDead = false,
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
      this.Combo = state.Combo;
      this.LastAchievement = state.LastAchievement;
      this.IsDead = state.IsDead;
    }
    else {
      this.Grid = new Array(40).fill(null).map(() => new Array(10).fill(TetrominoType.None));
      this.Falling = falling;
      this.Hold = hold;
      this.BlockHold = blockHold;
      this.TicksElapsed = elapsed;
      this.#pieces = new PieceGenerator(pieceSeedOrState);
      this.PieceIndex = pieceIndex;
      this.Combo = combo;
      this.LastAchievement = lastAchievement;
      this.IsDead = isDead;
    }
    this.#achievement = new TypedEvent();
    this.#dead = new TypedEvent();
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
      this.Combo,
      this.LastAchievement?.Clone(),
      this.IsDead,
    );
  }

  get Achievement(): TypedEvent<GameAchievement> {
    return this.#achievement;
  }

  get Dead(): TypedEvent<void> {
    return this.#dead;
  }

  get GridWidth(): number {
    return GRID_WIDTH;
  }

  get GridHeight(): number {
    return GRID_HEIGHT;
  }

  get PlayfieldHeight(): number {
    return PLAYFIELD_HEIGHT;
  }

  get PieceQueue(): TetrominoType[] {
    return this.#pieces.GetRange(this.PieceIndex, QUEUE_LENGTH);
  }

  Get(x: number, y: number): TetrominoType | null;

  Get(p: Vector): TetrominoType | null;

  Get(xOrP: number|Vector, y: number | undefined = undefined): TetrominoType | null {
    let _x: number, _y: number;
    if (xOrP instanceof Vector) {
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
  IsPieceValid(falling: Tetromino | undefined = undefined): boolean {
    if (falling)
      return !falling.Points.some(p => (this.Get(p) ?? TetrominoType.I) !== TetrominoType.None);
    if (this.Falling)
      return !this.Falling.Points.some(p => (this.Get(p) ?? TetrominoType.I) !== TetrominoType.None);
    return true;
  }

  /**
   * Attempt to dequeue a piece from the queue and start dropping it
   * @returns Whether the dequeue is successful
   */
  DequeuePiece(): boolean {
    if (this.Falling !== null) return false;
    this.Falling = Tetromino.Spawn(this.#pieces.Get(this.PieceIndex++), this.TicksElapsed);
    this.BlockHold = false;
    if (!this.IsPieceValid()) {
      this.IsDead = true;
      this.#dead.emit();
      return false;
    }
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
    if (hold === TetrominoType.None)
      hold = this.#pieces.Get(this.PieceIndex++);
    this.Falling = Tetromino.Spawn(hold, this.TicksElapsed);
    this.BlockHold = true;
    this.Falling.LastAction = GameInput.Hold;
    return true;
  }

  /**
   * Clear lines that are full and emit events
   * @param lastPiece The most recently locked piece
   */
  ClearLines(lastPiece: Tetromino | undefined = undefined): void {
    const linesCleared: number[] = [];
    let type: AchievementType | null = null;
    if (lastPiece?.Type === TetrominoType.T && IsRotation(lastPiece.LastAction)) {
      // check for T-spin
      const corners = [
        [0, 0],
        [2, 0],
        [0, 2],
        [2, 2],
      ].reduce((prev, [x, y]) =>
        this.Get(lastPiece.Position.X + x, lastPiece.Position.Y + y) !== TetrominoType.None
          ? prev + 1
          : prev
        , 0,
      );
      if (corners >= 3) {
        // is a T-spin
        // check if its mini
        const isMini = [
          [1, 0],
          [0, 1],
          [1, 2],
          [2, 1],
        ].some(([x, y]) =>
          !lastPiece.InternalPoints.find(p => p.X === x && p.Y === y)
          && this.Get(lastPiece.Position.X + x, lastPiece.Position.Y + y) !== TetrominoType.None,
        );
        if (isMini)
          type = AchievementType.TSpinMini;
        else
          type = AchievementType.TSpin;
      }
    }
    for (let i = this.GridHeight - 1; i >=0; i--) {
      if (!this.Grid[i].some(t => t === TetrominoType.None)) {
        this.Grid.splice(i, 1);
        this.Grid.push(new Array(this.GridWidth).fill(TetrominoType.None));
        linesCleared.push(i);
      }
    }
    if (linesCleared.length === 0) {
      this.Combo = 0;
      if (type === null)
        return;
    }
    else if (linesCleared.length > 1 && type === AchievementType.TSpinMini) {
      type = AchievementType.TSpin;
    }
    const achievement = new GameAchievement(
      linesCleared,
      type ?? AchievementType.LineClear,
      this.Combo,
      this.LastAchievement ? BackToBackEligible(this.LastAchievement) : false,
    );
    if (linesCleared.length > 0)
      this.Combo++;
    if (!this.Grid.some(row => row.some(c => c !== TetrominoType.None))) {
      achievement.Type = AchievementType.PerfectClear;
    }
    achievement.BackToBack = BackToBackEligible(achievement) && achievement.BackToBack;
    const last = achievement.Clone();
    this.#achievement.emit(achievement);
    this.LastAchievement = last;
  }

  /**
   * Attempt to lock the currently falling piece.
   * @returns Whether the lock was successful
   */
  LockPiece(): boolean {
    if (this.Falling === null) return false;
    if (!this.IsPieceValid()) return false;
    this.Falling.Points.forEach(p => this.Grid[p.Y][p.X] = this.Falling?.Type ?? TetrominoType.None);
    this.ClearLines(this.Falling);
    if (this.Falling.Points.map(p => p.Y).min() >= this.PlayfieldHeight) {
      this.IsDead = true;
      this.#dead.emit();
    }
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
    if (!kick) return false;
    this.Falling.Rotate(direction);
    this.Falling.Position = this.Falling.Position.Add(kick);
    this.Falling.LastActionTick = this.TicksElapsed;
    this.Falling.ActionCount++;
    this.Falling.LastAction = direction === RotationDirection.CW ? GameInput.RotateCW : GameInput.RotateCCW;
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
    this.Falling.LastAction = offset > 0 ? GameInput.ShiftRight : GameInput.ShiftLeft;
    return true;
  }

  CanPieceDrop(falling: Tetromino | undefined = undefined): boolean {
    let f: Tetromino;
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
    else
      this.Falling.LastAction = GameInput.SoftDrop;
    return true;
  }

  HardDropPiece(falling: Tetromino | undefined = undefined): boolean {
    let f : Tetromino;
    if (falling) {
      f = falling;
    }
    else if (this.Falling) {
      f = this.Falling;
    }
    else return false;
    const lastPos = f.Position.Y;
    while (this.IsPieceValid(f)) {
      f.Position.Y--;
    }
    f.Position.Y++;
    // Hard drop should only be recorded if the drop distance > 0
    if (lastPos !== f.Position.Y)
      f.LastAction = GameInput.HardDrop;
    if (f === this.Falling) {
      return this.LockPiece();
    }
    else {
      return true;
    }
  }

  Tick(): void {
    if (this.IsDead) return;
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
}
export default GameState;