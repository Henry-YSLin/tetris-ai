import Point from './utils/Point';
import p5Types from 'p5';

export enum Tetromino {
  None,
  I,
  J,
  L,
  O,
  S,
  T,
  Z,
}

export function TetrominoColor(p5: p5Types, tetromino: Tetromino): p5Types.Color {
  switch (tetromino) {
    case Tetromino.None:
      return p5.color(200);
    case Tetromino.I:
      return p5.color('cyan');
    case Tetromino.J:
      return p5.color('blue');
    case Tetromino.L:
      return p5.color('orange');
    case Tetromino.O:
      return p5.color('yellow');
    case Tetromino.S:
      return p5.color('green');
    case Tetromino.T:
      return p5.color('purple');
    case Tetromino.Z:
      return p5.color('red');
  }
}

export enum Rotation {
  R0,
  R90,
  R180,
  R270
}

export enum RotationDirection {
  CW = 1,
  CCW = -1
}

type WallKickInfo = Readonly<[
  {[RotationDirection.CCW]:Readonly<Point[]>, [RotationDirection.CW]: Readonly<Point[]>},
  {[RotationDirection.CCW]:Readonly<Point[]>, [RotationDirection.CW]: Readonly<Point[]>},
  {[RotationDirection.CCW]:Readonly<Point[]>, [RotationDirection.CW]: Readonly<Point[]>},
  {[RotationDirection.CCW]:Readonly<Point[]>, [RotationDirection.CW]: Readonly<Point[]>}
]>;
const WallKick3x3: WallKickInfo = Object.freeze([
  {
    [-1]: [new Point(0,0), new Point(1, 0), new Point(1, 1), new Point(0, -2), new Point(1, -2)],
    [1]: [new Point(0,0), new Point(-1, 0), new Point(-1, 1), new Point(0, -2), new Point(-1, -2)],
  },
  {
    [-1]: [new Point(0,0), new Point(1, 0), new Point(1, -1), new Point(0, 2), new Point(1, 2)],
    [1]: [new Point(0,0), new Point(1, 0), new Point(1, -1), new Point(0, 2), new Point(1, 2)],
  },
  {
    [-1]: [new Point(0,0), new Point(-1, 0), new Point(-1, 1), new Point(0, -2), new Point(-1, -2)],
    [1]: [new Point(0,0), new Point(1, 0), new Point(1, 1), new Point(0, -2), new Point(1, -2)],
  },
  {
    [-1]: [new Point(0,0), new Point(-1, 0), new Point(-1, -1), new Point(0, 2), new Point(-1, 2)],
    [1]: [new Point(0,0), new Point(-1, 0), new Point(-1, -1), new Point(0, 2), new Point(-1, 2)],
  },
] as const);
const WallKick4x4: WallKickInfo = Object.freeze([
  {
    [-1]: [new Point(0,0), new Point(-1, 0), new Point(2, 0), new Point(-1, 2), new Point(2, -1)],
    [1]: [new Point(0,0), new Point(-2, 0), new Point(1, 0), new Point(-2, -1), new Point(1, 2)],
  },
  {
    [-1]: [new Point(0,0), new Point(2, 0), new Point(-1, 0), new Point(2, 1), new Point(-1, -2)],
    [1]: [new Point(0,0), new Point(-1, 0), new Point(2, 0), new Point(-1, 2), new Point(2, -1)],
  },
  {
    [-1]: [new Point(0,0), new Point(1, 0), new Point(-2, 0), new Point(1, -2), new Point(-2, 1)],
    [1]: [new Point(0,0), new Point(2, 0), new Point(-1, 0), new Point(2, 1), new Point(-1, -2)],
  },
  {
    [-1]: [new Point(0,0), new Point(-2, 0), new Point(1, 0), new Point(-2, -1), new Point(1, 2)],
    [1]: [new Point(0,0), new Point(1, 0), new Point(-2, 0), new Point(1, -2), new Point(-2, 1)],
  },
] as const);
const WallKickDisable: WallKickInfo = Object.freeze([
  {
    [-1]: [new Point(0,0)],
    [1]: [new Point(0,0)],
  },
  {
    [-1]: [new Point(0,0)],
    [1]: [new Point(0,0)],
  },
  {
    [-1]: [new Point(0,0)],
    [1]: [new Point(0,0)],
  },
  {
    [-1]: [new Point(0,0)],
    [1]: [new Point(0,0)],
  },
] as const);

interface tetrominoInfo {
  readonly Rotations: Readonly<Readonly<Point[]>[]>;
  readonly WallKick: WallKickInfo;
}
type TetrominoInfo = Readonly<tetrominoInfo>;
export const Tetrominos : Record<Tetromino, TetrominoInfo> = Object.freeze({
  [Tetromino.None]: {
    Rotations: [[]],
    WallKick: WallKickDisable,
  },
  [Tetromino.I]: {
    Rotations: [
      [new Point(0, 2), new Point(1, 2), new Point(2, 2), new Point(3, 2)],
      [new Point(2, 0), new Point(2, 1), new Point(2, 2), new Point(2, 3)],
      [new Point(0, 1), new Point(1, 1), new Point(2, 1), new Point(3, 1)],
      [new Point(1, 0), new Point(1, 1), new Point(1, 2), new Point(1, 3)],
    ],
    WallKick: WallKick4x4,
  },
  [Tetromino.J]: {
    Rotations: [
      [new Point(0, 2), new Point(0, 1), new Point(1, 1), new Point(2, 1)],
      [new Point(2, 2), new Point(1, 2), new Point(1, 1), new Point(1, 0)],
      [new Point(0, 1), new Point(1, 1), new Point(2, 1), new Point(2, 0)],
      [new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(1, 2)],
    ],
    WallKick: WallKick3x3,
  },
  [Tetromino.L]: {
    Rotations: [
      [new Point(0, 1), new Point(1, 1), new Point(2, 1), new Point(2, 2)],
      [new Point(1, 2), new Point(1, 1), new Point(1, 0), new Point(2, 0)],
      [new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(2, 1)],
      [new Point(0, 2), new Point(1, 2), new Point(1, 1), new Point(1, 0)],
    ],
    WallKick: WallKick3x3,
  },
  [Tetromino.O]: {
    Rotations: [
      [new Point(0, 0), new Point(0, 1), new Point(1, 0), new Point(1, 1)],
    ],
    WallKick: WallKickDisable,
  },
  [Tetromino.S]: {
    Rotations: [
      [new Point(0, 1), new Point(1, 1), new Point(1, 2), new Point(2, 2)],
      [new Point(1, 2), new Point(1, 1), new Point(2, 1), new Point(2, 0)],
      [new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(2, 1)],
      [new Point(0, 2), new Point(0, 1), new Point(1, 1), new Point(1, 0)],
    ],
    WallKick: WallKick3x3,
  },
  [Tetromino.T]: {
    Rotations: [
      [new Point(0, 1), new Point(1, 1), new Point(1, 2), new Point(2, 1)],
      [new Point(1, 2), new Point(1, 1), new Point(2, 1), new Point(1, 0)],
      [new Point(0, 1), new Point(1, 0), new Point(1, 1), new Point(2, 1)],
      [new Point(1, 2), new Point(0, 1), new Point(1, 1), new Point(1, 0)],
    ],
    WallKick: WallKick3x3,
  },
  [Tetromino.Z]: {
    Rotations: [
      [new Point(0, 2), new Point(1, 1), new Point(1, 2), new Point(2, 1)],
      [new Point(2, 2), new Point(1, 1), new Point(2, 1), new Point(1, 0)],
      [new Point(0, 1), new Point(1, 0), new Point(1, 1), new Point(2, 0)],
      [new Point(1, 2), new Point(0, 1), new Point(1, 1), new Point(0, 0)],
    ],
    WallKick: WallKick3x3,
  },
} as const);
export default Tetrominos;