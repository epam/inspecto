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
