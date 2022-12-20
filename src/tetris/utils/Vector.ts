export default class Vector {
  public X: number;

  public Y: number;

  public constructor(x: number, y: number) {
    this.X = x;
    this.Y = y;
  }

  public Add(other: Vector): Vector {
    return new Vector(this.X + other.X, this.Y + other.Y);
  }

  public Subtract(other: Vector): Vector {
    return new Vector(this.X - other.X, this.Y - other.Y);
  }

  public Multiply(scalar: number): Vector {
    return new Vector(this.X * scalar, this.Y * scalar);
  }

  public Divide(scalar: number): Vector {
    return new Vector(this.X / scalar, this.Y / scalar);
  }

  public Equals(other: Vector): boolean {
    return this.X === other.X && this.Y === other.Y;
  }

  public get Length(): number {
    return Math.sqrt(this.X * this.X + this.Y * this.Y);
  }

  public Clone(): Vector {
    return new Vector(this.X, this.Y);
  }
}
