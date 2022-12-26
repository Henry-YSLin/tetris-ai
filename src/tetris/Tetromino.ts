import Tetrominos, { TetrominoType, Rotation, RotationDirection } from './Tetrominos';
import Vector from './utils/Vector';
import './utils/Array';
import GameInput from './GameInput';
import GlobalConfiguration from './GlobalConfiguration';

export default class Tetromino {
  public Type: TetrominoType;

  public Rotation: Rotation;

  public Position: Vector;

  /**
   * Lock the piece if it hasn't moved for LOCK_DELAY ticks
   */
  public LastActionTick: number;

  /**
   * Drop by 1 if TickElapsed - DropTick >= Consts/DROP_INTERVAL
   */
  public DropTick: number;

  /**
   * The number of actions performed without dropping
   */
  public ActionCount: number;

  /**
   * Used for detecting T-spin
   */
  public LastAction: GameInput;

  /**
   * Position of this tetromino in the piece queue
   */
  public PieceIndex: number;

  public constructor(
    type: TetrominoType,
    position: Vector,
    rotation: Rotation = Rotation.R0,
    lastActionTick = NaN,
    actionCount = 0,
    dropTick = NaN,
    lastAction = GameInput.None,
    pieceIndex = 0
  ) {
    this.Type = type;
    this.Position = position;
    this.Rotation = rotation;
    this.LastActionTick = lastActionTick;
    this.ActionCount = actionCount;
    this.DropTick = dropTick;
    this.LastAction = lastAction;
    this.PieceIndex = pieceIndex;
  }

  public Clone(): Tetromino {
    return new Tetromino(
      this.Type,
      this.Position.Clone(),
      this.Rotation,
      this.LastActionTick,
      this.ActionCount,
      this.DropTick,
      this.LastAction,
      this.PieceIndex
    );
  }

  public static Spawn(
    type: TetrominoType,
    config: GlobalConfiguration,
    ticksElapsed: number,
    pieceIndex: number
  ): Tetromino {
    const tetromino = new Tetromino(
      type,
      new Vector(4, 21),
      undefined,
      ticksElapsed,
      0,
      ticksElapsed,
      undefined,
      pieceIndex
    );
    tetromino.Bottom = 21; // spawns just above playfield
    tetromino.Left = Math.floor(config.GridWidth / 2 - tetromino.Width / 2); // spawns centered, rounds to the left
    return tetromino;
  }

  public Rotate(direction: RotationDirection = RotationDirection.CW): void {
    this.Rotation += direction;
    const { length } = Tetrominos[this.Type].rotations;
    if (this.Rotation >= length) this.Rotation = 0;
    if (this.Rotation < 0) this.Rotation = length - 1;
  }

  // #region Helper Getters
  public get InternalPoints(): readonly Vector[] {
    return Tetrominos[this.Type].rotations[this.Rotation];
  }

  public get Points(): Vector[] {
    return Tetrominos[this.Type].rotations[this.Rotation].map(p => p.Add(this.Position));
  }

  public get InternalLeft(): number {
    return this.InternalPoints.map(x => x.X).min();
  }

  public get InternalRight(): number {
    return this.InternalPoints.map(x => x.X).max();
  }

  public get InternalTop(): number {
    return this.InternalPoints.map(x => x.Y).max();
  }

  public get InternalBottom(): number {
    return this.InternalPoints.map(x => x.Y).min();
  }

  public get Left(): number {
    return this.Position.X + this.InternalLeft;
  }

  public set Left(left: number) {
    this.Position.X = left - this.InternalLeft;
  }

  public get Right(): number {
    return this.Position.X + this.InternalRight;
  }

  public set Right(right: number) {
    this.Position.X = right - this.InternalRight;
  }

  public get Top(): number {
    return this.Position.Y + this.InternalTop;
  }

  public set Top(top: number) {
    this.Position.Y = top - this.InternalTop;
  }

  public get Bottom(): number {
    return this.Position.Y + this.InternalBottom;
  }

  public set Bottom(bottom: number) {
    this.Position.Y = bottom - this.InternalBottom;
  }

  public get Width(): number {
    return this.InternalRight - this.InternalLeft + 1;
  }

  public get Height(): number {
    return this.InternalTop - this.InternalBottom + 1;
  }
  // #endregion
}
