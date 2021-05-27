export default class Point {
  X: number;
  Y: number;
  constructor(x: number, y: number) {
    this.X = x;
    this.Y = y;
  }

  add(other: Point): Point {
    return new Point(this.X + other.X, this.Y + other.Y);
  }

  subtract(other: Point): Point {
    return new Point(this.X - other.X, this.Y - other.Y);
  }
}