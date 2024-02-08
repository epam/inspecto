import { type IPresentable } from "../infrastructure/types";

export class Location implements IPresentable {
  constructor(
    private readonly _x: number,
    private readonly _y: number,
    private readonly _z: number,
  ) {}

  public toJSON(): Record<string, unknown> {
    return { x: this._x, y: this._y, z: this._z };
  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public get z(): number {
    return this._z;
  }
}
