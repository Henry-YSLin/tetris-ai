import { Tetrominos, Tetromino, Rotation, RotationDirection } from './Tetrominos';
import Point from './utils/Point';
import './utils/Array';
import { GRID_HEIGHT, GRID_WIDTH } from './Consts';


class FallingTetromino {
  Type: Tetromino;
  Rotation: Rotation;
  Position: Point;

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

  Clone(): FallingTetromino {
    return new FallingTetromino(this.Type, this.Rotation, this.Position);
  }

  Rotate(direction: RotationDirection = RotationDirection.CW): void {
    this.Rotation += direction;
    if (this.Rotation > 3) this.Rotation = 0;
    if (this.Rotation < 0) this.Rotation = 3;
  }
  //#endregion

  constructor(type: Tetromino, rotation: Rotation = Rotation.R0, position: Point | undefined = undefined) {
    this.Type = type;
    this.Rotation = rotation;
    if (position)
      this.Position = position;
    else {
      this.Position = new Point(4, 21);
      this.Bottom = 21;                                         // spawns just above playfield
      this.Left = Math.floor(GRID_WIDTH / 2 - this.Width / 2);  // spawns centered, rounds to the left
    }
  }
}

export class GameState {
  Grid: Tetromino[][];
  Falling: FallingTetromino | null;

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
  IsFallingValid(falling: FallingTetromino | undefined = undefined): boolean {
    if (falling)
      return !falling.Points.some(p => (this.Get(p) ?? Tetromino.I) !== Tetromino.None);
    if (this.Falling)
      return !this.Falling.Points.some(p => (this.Get(p) ?? Tetromino.I) !== Tetromino.None);
    return true;
  }

  /**
   * Attempt to lock the currently falling piece.
   * @returns Whether the lock was successful
   */
  LockFalling(): boolean {
    if (this.Falling === null) return false;
    if (!this.IsFallingValid()) return false;
    this.Falling.Points.some(p => this.Grid[p.Y][p.X] = this.Falling?.Type ?? Tetromino.None);
    this.Falling = null;
    return true;
  }

  /**
   * Attempt to rotate the currently falling piece in the specified direction,
   * taking wall kick into consideration.
   * @param direction Direction of rotation, clockwise or counter-clockwise
   * @returns Whether the rotation was successful
   */
  RotateFalling(direction: RotationDirection = RotationDirection.CW): boolean {
    if (this.Falling === null) return false;
    const kick = Tetrominos[this.Falling.Type].WallKick[this.Falling.Rotation][direction]
      .find(p => {
        const falling = this.Falling?.Clone();
        if (!falling) return false;
        falling.Rotate(direction);
        falling.Position.Add(p);
        return this.IsFallingValid(falling);
      });
    if (!kick) return false;
    this.Falling.Rotate(direction);
    this.Falling.Position.Add(kick);
    return true;
  }

  ShiftFalling(offset: number): boolean {
    if (this.Falling === null) return false;
    const falling = this.Falling.Clone();
    falling.Position.X += offset;
    if (this.IsFallingValid(falling)) {
      this.Falling = falling;
      return true;
    }
    else return false;
  }

  constructor() {
    this.Grid = new Array(40).fill(null).map(() => new Array(10).fill(Tetromino.None));
    this.Falling = null;
  }
}
export default GameState;