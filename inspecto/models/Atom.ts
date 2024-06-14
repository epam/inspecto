import { Location } from "./Location";

export enum CHARGE {
  POSITIVE = 1,
  NEGATIVE = -1,
}

export class Atom {
  constructor(
    private readonly _label: string,
    private _location: Location,
    private _charge?: CHARGE
  ) {}

  get charge(): CHARGE | 0 {
    return this._charge ?? 0;
  }

  set charge(newCharge: CHARGE) {
    this._charge = newCharge;
  }

  public get x(): number {
    return this._location.x;
  }

  public get y(): number {
    return this._location.y;
  }

  public get z(): number {
    return this._location.z;
  }

  public get label(): string {
    return this._label;
  }

  public get vector(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  public toString(): string {
    const charge = this.charge !== 0 ? (this.charge === 1 ? "positive" : "negative") : "neutral";

    return `{label=${this._label};location=${this._location.toString()};charge=${charge}}`;
  }

  public changePosition(x: number): void;
  public changePosition(x: number, y: number): void;
  public changePosition(x: number, y: number, z: number): void;
  public changePosition(x: number, y?: number, z?: number): void {
    const newLocation = new Location(x, y ?? this._location.y, z ?? this._location.z);
    this._location = newLocation;
  }
}
