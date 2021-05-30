import p5Types from 'p5';
import { Tetromino } from '../Tetrominos';
import Point from '../utils/Point';

export function TetrominoColor(p5: p5Types, tetromino: Tetromino): p5Types.Color {
  switch (tetromino) {
    case Tetromino.None:
      return p5.color(50);
    case Tetromino.I:
      return p5.color(77,208,225);
    case Tetromino.J:
      return p5.color(33,150,243);
    case Tetromino.L:
      return p5.color(255,152,0);
    case Tetromino.O:
      return p5.color(253,216,53);
    case Tetromino.S:
      return p5.color(76,175,80);
    case Tetromino.T:
      return p5.color(224,64,251);
    case Tetromino.Z:
      return p5.color(229,115,115);
  }
}

export function DrawTetromino(
  p5: p5Types,
  type: Tetromino | null,
  origin: Point,
  points: Point[],
  blockSize: number,
  alpha: number,
): void {
  const c = TetrominoColor(p5, type ?? Tetromino.None);
  c.setAlpha(alpha);
  p5.fill(c);
  points.forEach(p => {
    p5.rect(origin.X + p.X * blockSize, origin.Y + p.Y * blockSize, blockSize, blockSize);
  });
}