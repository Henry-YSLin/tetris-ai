import Vector from './utils/Vector';

export enum TetrominoType {
  None,
  I,
  J,
  L,
  O,
  S,
  T,
  Z,
  Garbage,
}

export enum Rotation {
  R0,
  R90,
  R180,
  R270,
}

export enum RotationDirection {
  CW = 1,
  CCW = -1,
}

type WallKickInfo = Readonly<
  [
    { [RotationDirection.CCW]: Readonly<Vector[]>; [RotationDirection.CW]: Readonly<Vector[]> },
    { [RotationDirection.CCW]: Readonly<Vector[]>; [RotationDirection.CW]: Readonly<Vector[]> },
    { [RotationDirection.CCW]: Readonly<Vector[]>; [RotationDirection.CW]: Readonly<Vector[]> },
    { [RotationDirection.CCW]: Readonly<Vector[]>; [RotationDirection.CW]: Readonly<Vector[]> }
  ]
>;
const WallKick3x3: WallKickInfo = Object.freeze([
  {
    [-1]: [new Vector(0, 0), new Vector(1, 0), new Vector(1, 1), new Vector(0, -2), new Vector(1, -2)],
    1: [new Vector(0, 0), new Vector(-1, 0), new Vector(-1, 1), new Vector(0, -2), new Vector(-1, -2)],
  },
  {
    [-1]: [new Vector(0, 0), new Vector(1, 0), new Vector(1, -1), new Vector(0, 2), new Vector(1, 2)],
    1: [new Vector(0, 0), new Vector(1, 0), new Vector(1, -1), new Vector(0, 2), new Vector(1, 2)],
  },
  {
    [-1]: [new Vector(0, 0), new Vector(-1, 0), new Vector(-1, 1), new Vector(0, -2), new Vector(-1, -2)],
    1: [new Vector(0, 0), new Vector(1, 0), new Vector(1, 1), new Vector(0, -2), new Vector(1, -2)],
  },
  {
    [-1]: [new Vector(0, 0), new Vector(-1, 0), new Vector(-1, -1), new Vector(0, 2), new Vector(-1, 2)],
    1: [new Vector(0, 0), new Vector(-1, 0), new Vector(-1, -1), new Vector(0, 2), new Vector(-1, 2)],
  },
] as const);
const WallKick4x4: WallKickInfo = Object.freeze([
  {
    [-1]: [new Vector(0, 0), new Vector(-1, 0), new Vector(2, 0), new Vector(-1, 2), new Vector(2, -1)],
    1: [new Vector(0, 0), new Vector(-2, 0), new Vector(1, 0), new Vector(-2, -1), new Vector(1, 2)],
  },
  {
    [-1]: [new Vector(0, 0), new Vector(2, 0), new Vector(-1, 0), new Vector(2, 1), new Vector(-1, -2)],
    1: [new Vector(0, 0), new Vector(-1, 0), new Vector(2, 0), new Vector(-1, 2), new Vector(2, -1)],
  },
  {
    [-1]: [new Vector(0, 0), new Vector(1, 0), new Vector(-2, 0), new Vector(1, -2), new Vector(-2, 1)],
    1: [new Vector(0, 0), new Vector(2, 0), new Vector(-1, 0), new Vector(2, 1), new Vector(-1, -2)],
  },
  {
    [-1]: [new Vector(0, 0), new Vector(-2, 0), new Vector(1, 0), new Vector(-2, -1), new Vector(1, 2)],
    1: [new Vector(0, 0), new Vector(1, 0), new Vector(-2, 0), new Vector(1, -2), new Vector(-2, 1)],
  },
] as const);
const WallKickDisable: WallKickInfo = Object.freeze([
  {
    [-1]: [new Vector(0, 0)],
    1: [new Vector(0, 0)],
  },
  {
    [-1]: [new Vector(0, 0)],
    1: [new Vector(0, 0)],
  },
  {
    [-1]: [new Vector(0, 0)],
    1: [new Vector(0, 0)],
  },
  {
    [-1]: [new Vector(0, 0)],
    1: [new Vector(0, 0)],
  },
] as const);

interface BaseTetrominoInfo {
  readonly rotations: Readonly<Readonly<Vector[]>[]>;
  readonly wallKick: WallKickInfo;
}
type TetrominoInfo = Readonly<BaseTetrominoInfo>;
const Tetrominos: Record<TetrominoType, TetrominoInfo> = Object.freeze({
  [TetrominoType.None]: {
    rotations: [[]],
    wallKick: WallKickDisable,
  },
  [TetrominoType.I]: {
    rotations: [
      [new Vector(0, 2), new Vector(1, 2), new Vector(2, 2), new Vector(3, 2)],
      [new Vector(2, 0), new Vector(2, 1), new Vector(2, 2), new Vector(2, 3)],
      [new Vector(0, 1), new Vector(1, 1), new Vector(2, 1), new Vector(3, 1)],
      [new Vector(1, 0), new Vector(1, 1), new Vector(1, 2), new Vector(1, 3)],
    ],
    wallKick: WallKick4x4,
  },
  [TetrominoType.J]: {
    rotations: [
      [new Vector(0, 2), new Vector(0, 1), new Vector(1, 1), new Vector(2, 1)],
      [new Vector(2, 2), new Vector(1, 2), new Vector(1, 1), new Vector(1, 0)],
      [new Vector(0, 1), new Vector(1, 1), new Vector(2, 1), new Vector(2, 0)],
      [new Vector(0, 0), new Vector(1, 0), new Vector(1, 1), new Vector(1, 2)],
    ],
    wallKick: WallKick3x3,
  },
  [TetrominoType.L]: {
    rotations: [
      [new Vector(0, 1), new Vector(1, 1), new Vector(2, 1), new Vector(2, 2)],
      [new Vector(1, 2), new Vector(1, 1), new Vector(1, 0), new Vector(2, 0)],
      [new Vector(0, 0), new Vector(0, 1), new Vector(1, 1), new Vector(2, 1)],
      [new Vector(0, 2), new Vector(1, 2), new Vector(1, 1), new Vector(1, 0)],
    ],
    wallKick: WallKick3x3,
  },
  [TetrominoType.O]: {
    rotations: [[new Vector(0, 0), new Vector(0, 1), new Vector(1, 0), new Vector(1, 1)]],
    wallKick: WallKickDisable,
  },
  [TetrominoType.S]: {
    rotations: [
      [new Vector(0, 1), new Vector(1, 1), new Vector(1, 2), new Vector(2, 2)],
      [new Vector(1, 2), new Vector(1, 1), new Vector(2, 1), new Vector(2, 0)],
      [new Vector(0, 0), new Vector(1, 0), new Vector(1, 1), new Vector(2, 1)],
      [new Vector(0, 2), new Vector(0, 1), new Vector(1, 1), new Vector(1, 0)],
    ],
    wallKick: WallKick3x3,
  },
  [TetrominoType.T]: {
    rotations: [
      [new Vector(0, 1), new Vector(1, 1), new Vector(1, 2), new Vector(2, 1)],
      [new Vector(1, 2), new Vector(1, 1), new Vector(2, 1), new Vector(1, 0)],
      [new Vector(0, 1), new Vector(1, 0), new Vector(1, 1), new Vector(2, 1)],
      [new Vector(1, 2), new Vector(0, 1), new Vector(1, 1), new Vector(1, 0)],
    ],
    wallKick: WallKick3x3,
  },
  [TetrominoType.Z]: {
    rotations: [
      [new Vector(0, 2), new Vector(1, 1), new Vector(1, 2), new Vector(2, 1)],
      [new Vector(2, 2), new Vector(1, 1), new Vector(2, 1), new Vector(1, 0)],
      [new Vector(0, 1), new Vector(1, 0), new Vector(1, 1), new Vector(2, 0)],
      [new Vector(1, 2), new Vector(0, 1), new Vector(1, 1), new Vector(0, 0)],
    ],
    wallKick: WallKick3x3,
  },
  [TetrominoType.Garbage]: {
    rotations: [[new Vector(0, 0)]],
    wallKick: WallKickDisable,
  },
} as const);
export default Tetrominos;
