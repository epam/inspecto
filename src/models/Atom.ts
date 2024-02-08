import { type IPresentable } from "@infrastructure";
import { type Location } from "./Location";

export enum CHARGE {
  POSITIVE = 1,
  NEGATIVE = -1,
}

export class Atom implements IPresentable {
  constructor(
    private readonly label: string,
    private readonly location: Location,
    private readonly charge?: CHARGE,
  ) {}

  public get x(): number {
    return this.location.x;
  }

  public get y(): number {
    return this.location.y;
  }

  public get z(): number {
    return this.location.z;
  }

  public get vector(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  public toString(): string {
    const charge =
      this.charge != null
        ? this.charge === 1
          ? "positive"
          : "negative"
        : "neutral";

    return `{
      label: ${this.label},
      location: ${this.vector.toString()},
      charge: ${charge}
    }`;
  }

  public toJSON(): Record<string, unknown> {
    const json: Record<string, unknown> = {
      label: this.label,
      location: this.location.toJSON(),
    };

    if (this.charge !== undefined) {
      json.charge = this.charge === 1 ? "positive" : "negative";
    }

    return json;
  }
}
