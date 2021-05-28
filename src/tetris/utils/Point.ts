export default class Point {
  X: number;
  Y: number;
  constructor(x: number, y: number) {
    this.X = x;
    this.Y = y;
  }

  Add(other: Point): Point {
    return new Point(this.X + other.X, this.Y + other.Y);
  }

  Subtract(other: Point): Point {
    return new Point(this.X - other.X, this.Y - other.Y);
  }

  Clone(): Point {
    return new Point(this.X, this.Y);
  }
}