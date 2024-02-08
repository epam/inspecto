import { type Location } from "./Location";

export enum CHARGE {
  POSITIVE = 1,
  NEGATIVE = -1,
}

export class Atom {
  constructor(
    private readonly _label: string,
    private readonly _location: Location,
    private readonly charge?: CHARGE,
  ) {}

  public get x(): number {
    return this._location.x;
  }

  public get y(): number {
    return this._location.y;
  }

  public get z(): number {
    return this._location.z;
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

    return `{label=${this._label};location=${this._location.toString()};charge=${charge}}`;
  }
}
