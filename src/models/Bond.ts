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

  public getLength(): number {
    const deltaX = this.atoms[0].x - this.atoms[1].x;
    const deltaY = this.atoms[0].y - this.atoms[1].y;
    const deltaZ = this.atoms[0].z - this.atoms[1].z;

    return Math.sqrt(
      Math.pow(deltaX, 2) + Math.pow(deltaY, 2) + Math.pow(deltaZ, 2),
    );
  }

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
    return `{
      bondType: ${type},
      atoms: ${this.atoms.map((atom) => atom.toString()).toString()}
    }`;
  }
}
