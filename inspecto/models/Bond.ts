import { getDistanceBetweenTwoPoints } from "@utils/getDistanceBetweenTwoPoints";
import { type Atom } from "./Atom";
import { type GenericNode, Types } from "./types";

export enum BOND_TYPES {
  SINGLE = 1,
  DOUBLE = 2,
  TRIPLE = 3,
  AROMATIC = 4,
  SINGLE_DOUBLE = 5,
  SINGLE_AROMATIC = 6,
  DOUBLE_AROMATIC = 7,
  ANY = 8,
  HYDROGEN = 9,
}

export class Bond implements GenericNode {
  type: Types.BOND = Types.BOND;
  constructor(
    public _type: BOND_TYPES,
    public atoms: [Atom, Atom],
    private readonly _atomsIndexes: [number, number],
    public _stereo?: number | undefined,
    private _cip?: string | undefined
  ) {}

  public get from(): Atom {
    return this.atoms[0];
  }

  public get to(): Atom {
    return this.atoms[1];
  }

  public get bondType(): BOND_TYPES {
    return this._type;
  }

  public set bondType(value: number) {
    this._type = value;
  }

  public get stereo(): number | undefined {
    return this._stereo;
  }

  public set stereo(value: number | undefined) {
    this._stereo = value;
  }

  public deleteStereo(): void {
    delete this._stereo;
  }

  public get cip(): string | undefined {
    return this._cip;
  }

  public set cip(value: string | undefined) {
    this._cip = value;
  }

  public getLength(): number {
    return getDistanceBetweenTwoPoints(...this.atoms);
  }

  public get atomsIndexes(): [number, number] {
    return this._atomsIndexes;
  }

  public getBondTypeName(): string {
    switch (this.bondType) {
      case BOND_TYPES.SINGLE:
        return "Single";
      case BOND_TYPES.DOUBLE:
        return "Double";
      case BOND_TYPES.TRIPLE:
        return "Triple";
      case BOND_TYPES.SINGLE_DOUBLE:
        return "Single_Double";
      case BOND_TYPES.SINGLE_AROMATIC:
        return "Single_Aromatic";
      case BOND_TYPES.DOUBLE_AROMATIC:
        return "Double_Aromatic";
      case BOND_TYPES.HYDROGEN:
        return "Hydrogen";
      case BOND_TYPES.ANY:
        return "Any";
      case BOND_TYPES.AROMATIC:
      default:
        return "Aromatic";
    }
  }

  public toString(): string {
    let type;

    switch (this.bondType) {
      case BOND_TYPES.SINGLE:
        type = "Single";
        break;
      case BOND_TYPES.DOUBLE:
        type = "Double";
        break;
      case BOND_TYPES.TRIPLE:
        type = "Triple";
        break;
      case BOND_TYPES.SINGLE_DOUBLE:
        type = "Single_Double";
        break;
      case BOND_TYPES.SINGLE_AROMATIC:
        type = "Single_Aromatic";
        break;
      case BOND_TYPES.DOUBLE_AROMATIC:
        type = "Double_Aromatic";
        break;
      case BOND_TYPES.HYDROGEN:
        type = "Hydrogen";
        break;
      case BOND_TYPES.ANY:
        type = "Any";
        break;
      default:
        type = "Aromatic";
    }
    return `{bond_type=${type} | atom_1=${this.atoms[0].toString()} | atom_2=${this.atoms[1].toString()}}`;
  }
}
