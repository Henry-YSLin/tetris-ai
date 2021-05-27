import Point from './utils/Point';

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

type WallKickInfo = Readonly<[
  {[-1]:Readonly<Point[]>, [1]: Readonly<Point[]>},
  {[-1]:Readonly<Point[]>, [1]: Readonly<Point[]>},
  {[-1]:Readonly<Point[]>, [1]: Readonly<Point[]>},
  {[-1]:Readonly<Point[]>, [1]: Readonly<Point[]>}
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