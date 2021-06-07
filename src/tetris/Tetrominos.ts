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

type WallKickInfo = Readonly<[
  {[RotationDirection.CCW]:Readonly<Vector[]>, [RotationDirection.CW]: Readonly<Vector[]>},
  {[RotationDirection.CCW]:Readonly<Vector[]>, [RotationDirection.CW]: Readonly<Vector[]>},
  {[RotationDirection.CCW]:Readonly<Vector[]>, [RotationDirection.CW]: Readonly<Vector[]>},
  {[RotationDirection.CCW]:Readonly<Vector[]>, [RotationDirection.CW]: Readonly<Vector[]>},
]>;
const WallKick3x3: WallKickInfo = Object.freeze([
  {
    [-1]: [new Vector(0, 0), new Vector(1, 0), new Vector(1, 1), new Vector(0, -2), new Vector(1, -2)],
    [1]: [new Vector(0, 0), new Vector(-1, 0), new Vector(-1, 1), new Vector(0, -2), new Vector(-1, -2)],
  },
  {
    [-1]: [new Vector(0, 0), new Vector(1, 0), new Vector(1, -1), new Vector(0, 2), new Vector(1, 2)],
    [1]: [new Vector(0, 0), new Vector(1, 0), new Vector(1, -1), new Vector(0, 2), new Vector(1, 2)],
  },
  {
    [-1]: [new Vector(0, 0), new Vector(-1, 0), new Vector(-1, 1), new Vector(0, -2), new Vector(-1, -2)],
    [1]: [new Vector(0, 0), new Vector(1, 0), new Vector(1, 1), new Vector(0, -2), new Vector(1, -2)],
  },
  {
    [-1]: [new Vector(0, 0), new Vector(-1, 0), new Vector(-1, -1), new Vector(0, 2), new Vector(-1, 2)],
    [1]: [new Vector(0, 0), new Vector(-1, 0), new Vector(-1, -1), new Vector(0, 2), new Vector(-1, 2)],
  },
] as const);
const WallKick4x4: WallKickInfo = Object.freeze([
  {
    [-1]: [new Vector(0, 0), new Vector(-1, 0), new Vector(2, 0), new Vector(-1, 2), new Vector(2, -1)],
    [1]: [new Vector(0, 0), new Vector(-2, 0), new Vector(1, 0), new Vector(-2, -1), new Vector(1, 2)],
  },
  {
    [-1]: [new Vector(0, 0), new Vector(2, 0), new Vector(-1, 0), new Vector(2, 1), new Vector(-1, -2)],
    [1]: [new Vector(0, 0), new Vector(-1, 0), new Vector(2, 0), new Vector(-1, 2), new Vector(2, -1)],
  },
  {
    [-1]: [new Vector(0, 0), new Vector(1, 0), new Vector(-2, 0), new Vector(1, -2), new Vector(-2, 1)],
    [1]: [new Vector(0, 0), new Vector(2, 0), new Vector(-1, 0), new Vector(2, 1), new Vector(-1, -2)],
  },
  {
    [-1]: [new Vector(0, 0), new Vector(-2, 0), new Vector(1, 0), new Vector(-2, -1), new Vector(1, 2)],
    [1]: [new Vector(0, 0), new Vector(1, 0), new Vector(-2, 0), new Vector(1, -2), new Vector(-2, 1)],
  },
] as const);
const WallKickDisable: WallKickInfo = Object.freeze([
  {
    [-1]: [new Vector(0, 0)],
    [1]: [new Vector(0, 0)],
  },
  {
    [-1]: [new Vector(0, 0)],
    [1]: [new Vector(0, 0)],
  },
  {
    [-1]: [new Vector(0, 0)],
    [1]: [new Vector(0, 0)],
  },
  {
    [-1]: [new Vector(0, 0)],
    [1]: [new Vector(0, 0)],
  },
] as const);

interface tetrominoInfo {
  readonly Rotations: Readonly<Readonly<Vector[]>[]>;
  readonly WallKick: WallKickInfo;
}
type TetrominoInfo = Readonly<tetrominoInfo>;
export const Tetrominos : Record<TetrominoType, TetrominoInfo> = Object.freeze({
  [TetrominoType.None]: {
    Rotations: [[]],
    WallKick: WallKickDisable,
  },
  [TetrominoType.I]: {
    Rotations: [
      [new Vector(0, 2), new Vector(1, 2), new Vector(2, 2), new Vector(3, 2)],
      [new Vector(2, 0), new Vector(2, 1), new Vector(2, 2), new Vector(2, 3)],
      [new Vector(0, 1), new Vector(1, 1), new Vector(2, 1), new Vector(3, 1)],
      [new Vector(1, 0), new Vector(1, 1), new Vector(1, 2), new Vector(1, 3)],
    ],
    WallKick: WallKick4x4,
  },
  [TetrominoType.J]: {
    Rotations: [
      [new Vector(0, 2), new Vector(0, 1), new Vector(1, 1), new Vector(2, 1)],
      [new Vector(2, 2), new Vector(1, 2), new Vector(1, 1), new Vector(1, 0)],
      [new Vector(0, 1), new Vector(1, 1), new Vector(2, 1), new Vector(2, 0)],
      [new Vector(0, 0), new Vector(1, 0), new Vector(1, 1), new Vector(1, 2)],
    ],
    WallKick: WallKick3x3,
  },
  [TetrominoType.L]: {
    Rotations: [
      [new Vector(0, 1), new Vector(1, 1), new Vector(2, 1), new Vector(2, 2)],
      [new Vector(1, 2), new Vector(1, 1), new Vector(1, 0), new Vector(2, 0)],
      [new Vector(0, 0), new Vector(0, 1), new Vector(1, 1), new Vector(2, 1)],
      [new Vector(0, 2), new Vector(1, 2), new Vector(1, 1), new Vector(1, 0)],
    ],
    WallKick: WallKick3x3,
  },
  [TetrominoType.O]: {
    Rotations: [
      [new Vector(0, 0), new Vector(0, 1), new Vector(1, 0), new Vector(1, 1)],
    ],
    WallKick: WallKickDisable,
  },
  [TetrominoType.S]: {
    Rotations: [
      [new Vector(0, 1), new Vector(1, 1), new Vector(1, 2), new Vector(2, 2)],
      [new Vector(1, 2), new Vector(1, 1), new Vector(2, 1), new Vector(2, 0)],
      [new Vector(0, 0), new Vector(1, 0), new Vector(1, 1), new Vector(2, 1)],
      [new Vector(0, 2), new Vector(0, 1), new Vector(1, 1), new Vector(1, 0)],
    ],
    WallKick: WallKick3x3,
  },
  [TetrominoType.T]: {
    Rotations: [
      [new Vector(0, 1), new Vector(1, 1), new Vector(1, 2), new Vector(2, 1)],
      [new Vector(1, 2), new Vector(1, 1), new Vector(2, 1), new Vector(1, 0)],
      [new Vector(0, 1), new Vector(1, 0), new Vector(1, 1), new Vector(2, 1)],
      [new Vector(1, 2), new Vector(0, 1), new Vector(1, 1), new Vector(1, 0)],
    ],
    WallKick: WallKick3x3,
  },
  [TetrominoType.Z]: {
    Rotations: [
      [new Vector(0, 2), new Vector(1, 1), new Vector(1, 2), new Vector(2, 1)],
      [new Vector(2, 2), new Vector(1, 1), new Vector(2, 1), new Vector(1, 0)],
      [new Vector(0, 1), new Vector(1, 0), new Vector(1, 1), new Vector(2, 0)],
      [new Vector(1, 2), new Vector(0, 1), new Vector(1, 1), new Vector(0, 0)],
    ],
    WallKick: WallKick3x3,
  },
  [TetrominoType.Garbage]: {
    Rotations: [
      [new Vector(0, 0)],
    ],
    WallKick: WallKickDisable,
  },
} as const);
export default Tetrominos;