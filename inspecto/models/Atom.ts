import { Location } from "./Location";
import { type GenericNode, Types } from "./types";

export enum CHARGE {
  POSITIVE = 1,
  NEGATIVE = -1,
  NEUTRAL = 0,
}

export enum Radical {
  Monoradical = 1,
  Diradical_Singlet = 2,
  Diradical_Triplet = 3,
}

export interface QueryProperties {
  ringBondCount?: number;
  hCount?: number;
  substitutionCount?: number;
  unsaturatedAtom?: boolean;
  implicitHCount?: number;
  aromaticity?: string;
  ringMembership?: number;
  ringSize?: number;
  connectivity?: number;
  chirality?: string;
}
export class Atom implements GenericNode {
  type: Types.ATOM = Types.ATOM;

  constructor(
    private _label: string,
    private _location: Location,
    private _charge?: CHARGE,
    private readonly _stereolabel?: string,
    private _isotope?: number,
    public _queryProperties?: QueryProperties,
    public _cip?: string | undefined,
    public _explicitValence?: number | undefined,
    public _mapping?: number | undefined,
    public _implicitHCount?: number | undefined,
    public _radical?: Radical | undefined,
    public _isPartOfSGroup?: boolean,
  ) {
    this._label = _label;
    this._location = _location;
    this._charge = _charge;
    this._stereolabel = _stereolabel;
    this._isotope = _isotope;
    this._queryProperties = _queryProperties;
    this._cip = _cip;
    this._explicitValence = _explicitValence;
    this._mapping = _mapping;
    this._implicitHCount = _implicitHCount;
    this._radical = _radical;
    this._isPartOfSGroup = _isPartOfSGroup;
  }

  get charge(): CHARGE | 0 {
    return this._charge ?? 0;
  }

  set charge(newCharge: CHARGE) {
    this._charge = newCharge;
  }

  get stereolabel(): string | undefined {
    return this._stereolabel;
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

  public set label(value: string) {
    this._label = value;
  }

  public get isotope(): number | undefined {
    return this._isotope;
  }

  public set isotope(value: number) {
    this._isotope = value;
  }

  public get vector(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  public toString(): string {
    let chargeType: "positive" | "negative" | "neutral";
    switch (this.charge) {
      case 0:
        chargeType = "neutral";
        break;
      case 1:
        chargeType = "positive";
        break;
      case -1:
        chargeType = "negative";
        break;
      default:
        chargeType = "negative";
        console.error(`Atom charge is wrong: ${this.charge}`);
    }

    return `{label=${this._label};location=${this._location.toString()};charge=${chargeType}}`;
  }

  public changePosition(x: number): void;
  public changePosition(x: number, y: number): void;
  public changePosition(x: number, y: number, z: number): void;
  public changePosition(x: number, y?: number, z?: number): void {
    const newLocation = new Location(x, y ?? this._location.y, z ?? this._location.z);
    this._location = newLocation;
  }

  public get queryProperties(): QueryProperties | undefined {
    return this._queryProperties;
  }

  public set queryProperties(value: QueryProperties | undefined) {
    this._queryProperties = value;
  }

  public get cip(): string | undefined {
    return this._cip;
  }

  public set cip(value: string | undefined) {
    this._cip = value;
  }

  public get explicitValence(): number | undefined {
    return this._explicitValence;
  }

  public set explicitValence(value: number | undefined) {
    this._explicitValence = value;
  }

  public get mapping(): number | undefined {
    return this._mapping;
  }

  public set mapping(value: number | undefined) {
    this._mapping = value;
  }

  public get implicitHCount(): number | undefined {
    return this._implicitHCount;
  }

  public set implicitHCount(value: number | undefined) {
    this._implicitHCount = value;
  }

  public get radical(): Radical | undefined {
    return this._radical;
  }

  public set radical(value: Radical | undefined) {
    this._radical = value;
  }

  public get isPartOfSGroup(): boolean | undefined {
    return this._isPartOfSGroup;
  }

  public set isPartOfSGroup(value: boolean | undefined) {
    this._isPartOfSGroup = value;
  }
}
