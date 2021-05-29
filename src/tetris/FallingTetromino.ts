import { Tetrominos, Tetromino, Rotation, RotationDirection } from './Tetrominos';
import Point from './utils/Point';
import './utils/Array';
import { GRID_WIDTH } from './Consts';
import GameInput from './GameInput';

export default class FallingTetromino {
  Type: Tetromino;
  Rotation: Rotation;
  Position: Point;
  /**
   * Lock the piece if it hasn't moved for LOCK_DELAY ticks
   */
  LastActionTick: number;
  /**
   * Drop by 1 if TickElapsed - DropTick >= Consts/DROP_INTERVAL
   */
  DropTick: number;
  /**
   * The number of actions performed without dropping
   */
  ActionCount: number;
  /**
   * Used for detecting T-spin
   */
  LastAction: GameInput;


  //#region Helper Functions
  get InternalPoints(): readonly Point[] {
    return Tetrominos[this.Type].Rotations[this.Rotation];
  }

  get Points(): Point[] {
    return Tetrominos[this.Type].Rotations[this.Rotation].map(p => p.Add(this.Position));
  }

  get InternalLeft(): number {
    return this.InternalPoints.map(x=>x.X).min();
  }

  get InternalRight(): number {
    return this.InternalPoints.map(x=>x.X).max();
  }

  get InternalTop(): number {
    return this.InternalPoints.map(x=>x.Y).max();
  }

  get InternalBottom(): number {
    return this.InternalPoints.map(x=>x.Y).min();
  }

  get Left(): number {
    return this.Position.X + this.InternalLeft;
  }

  set Left(left: number) {
    this.Position.X = left - this.InternalLeft;
  }

  get Right(): number {
    return this.Position.X + this.InternalRight;
  }

  set Right(right: number) {
    this.Position.X = right - this.InternalRight;
  }

  get Top(): number {
    return this.Position.Y + this.InternalTop;
  }

  set Top(top: number) {
    this.Position.Y = top - this.InternalTop;
  }

  get Bottom(): number {
    return this.Position.Y + this.InternalBottom;
  }

  set Bottom(bottom: number) {
    this.Position.Y = bottom - this.InternalBottom;
  }

  get Width(): number {
    return this.InternalRight - this.InternalLeft;
  }

  get Height(): number {
    return this.InternalTop - this.InternalBottom;
  }

  Rotate(direction: RotationDirection = RotationDirection.CW): void {
    this.Rotation += direction;
    if (this.Rotation > 3) this.Rotation = 0;
    if (this.Rotation < 0) this.Rotation = 3;
  }
  //#endregion

  Clone(): FallingTetromino {
    return new FallingTetromino(
      this.Type,
      this.Rotation,
      this.Position.Clone(),
      this.LastActionTick,
      this.ActionCount,
      this.DropTick,
      this.LastAction,
    );
  }

  static Spawn(type: Tetromino, ticksElapsed: number): FallingTetromino {
    return new FallingTetromino(type, undefined, undefined, ticksElapsed, 0, ticksElapsed);
  }

  constructor(
    type: Tetromino,
    rotation: Rotation = Rotation.R0,
    position: Point | undefined = undefined,
    lastActionTick = NaN,
    actionCount = 0,
    dropTick = NaN,
    lastAction = GameInput.None,
  ) {
    this.Type = type;
    this.Rotation = rotation;
    if (position)
      this.Position = position;
    else {
      this.Position = new Point(4, 21);
      this.Bottom = 21;                                         // spawns just above playfield
      this.Left = Math.floor(GRID_WIDTH / 2 - this.Width / 2);  // spawns centered, rounds to the left
    }
    this.LastActionTick = lastActionTick;
    this.ActionCount = actionCount;
    this.DropTick = dropTick;
    this.LastAction = lastAction;
  }
}