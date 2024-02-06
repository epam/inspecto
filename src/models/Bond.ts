import { type IPresentable } from "../infrastructure/types";
import { type Atom } from "./Atom";

export enum BOND_TYPES {
  SINGLE = 1,
  DOUBLE = 2,
  TRIPLE = 3,
  AROMATIC = 4,
}

export class Bond implements IPresentable {
  constructor(
    private readonly type: BOND_TYPES,
    private readonly atoms: [Atom, Atom],
  ) {}

  public toJSON(): Record<string, unknown> {
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
    return {
      type,
      atoms: this.atoms.map((atom) => atom.toJSON()),
    };
  }
}
