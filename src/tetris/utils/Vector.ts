export default class Vector {
  X: number;
  Y: number;
  constructor(x: number, y: number) {
    this.X = x;
    this.Y = y;
  }

  Add(other: Vector): Vector {
    return new Vector(this.X + other.X, this.Y + other.Y);
  }

  Subtract(other: Vector): Vector {
    return new Vector(this.X - other.X, this.Y - other.Y);
  }

  Clone(): Vector {
    return new Vector(this.X, this.Y);
  }
}