export class Location {
  constructor(
    private readonly _x: number,
    private readonly _y: number,
    private readonly _z: number,
  ) {}

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public get z(): number {
    return this._z;
  }

  public toString(): string {
    return `[${this._x},${this._y},${this.z}]`;
  }
}
