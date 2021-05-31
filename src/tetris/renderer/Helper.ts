import p5Types from 'p5';
import { TetrominoType } from '../Tetrominos';
import Vector from '../utils/Vector';

export function TetrominoColor(p5: p5Types, tetromino: TetrominoType): p5Types.Color {
  switch (tetromino) {
    case TetrominoType.None:
      return p5.color(50);
    case TetrominoType.I:
      return p5.color(77,208,225);
    case TetrominoType.J:
      return p5.color(33,150,243);
    case TetrominoType.L:
      return p5.color(255,152,0);
    case TetrominoType.O:
      return p5.color(253,216,53);
    case TetrominoType.S:
      return p5.color(76,175,80);
    case TetrominoType.T:
      return p5.color(224,64,251);
    case TetrominoType.Z:
      return p5.color(229,115,115);
  }
}

export function DrawTetromino(
  p5: p5Types,
  type: TetrominoType | null,
  origin: Vector,
  points: Vector[],
  blockSize: number,
  alpha: number,
): void {
  const c = TetrominoColor(p5, type ?? TetrominoType.None);
  c.setAlpha(alpha);
  p5.fill(c);
  points.forEach(p => {
    p5.rect(origin.X + p.X * blockSize, origin.Y + p.Y * blockSize, blockSize, blockSize);
  });
}

export function p5text(
  p5: p5Types,
  str: string | number | boolean | object | any[],
  x: number,
  y: number,
  x2?: number | undefined,
  y2?: number | undefined,
): void {
  p5.push();
  p5.scale(1, -1);
  p5.text(str, x, -y, x2, -y2);
  p5.pop();
}