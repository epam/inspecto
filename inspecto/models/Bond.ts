import { getDistanceBetweenTwoAtoms } from "../utils/getDistanceBetweenTwoAtoms";
import { type Atom } from "./Atom";

export enum BOND_TYPES {
  SINGLE = 1,
  DOUBLE = 2,
  TRIPLE = 3,
  AROMATIC = 4,
}

export class Bond {
  constructor(
    private readonly type: BOND_TYPES,
    private readonly atoms: [Atom, Atom],
    private readonly _atomsIndexes: [number, number],
  ) {}

  public get from(): Atom {
    return this.atoms[0];
  }

  public get to(): Atom {
    return this.atoms[1];
  }

  public get bondType(): BOND_TYPES {
    return this.type;
  }

  public getLength(): number {
    return getDistanceBetweenTwoAtoms(...this.atoms);
  }

  public get atomsIndexes(): [number, number] {
    return this._atomsIndexes;
  }

  public toString(): string {
    let type;

    switch (this.type) {
      case BOND_TYPES.SINGLE:
        type = "Single";
        break;
      case BOND_TYPES.DOUBLE:
        type = "Double";
        break;
      case BOND_TYPES.TRIPLE:
        type = "Triple";
        break;
      default:
        type = "Aromatic";
    }
    return `{bond_type=${type} | atom_1=${this.atoms[0].toString()} | atom_2=${this.atoms[1].toString()}}`;
  }
}
