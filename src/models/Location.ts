import { type IPresentable } from "../infrastructure/types";

export class Location implements IPresentable {
  constructor(
    private readonly x: number,
    private readonly y: number,
    private readonly z: number,
  ) {}

  public toJSON(): Record<string, unknown> {
    return { x: this.x, y: this.y, z: this.z };
  }
}
