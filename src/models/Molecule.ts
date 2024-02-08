import { type IPresentable } from "../infrastructure/types";
import { type Atom } from "./Atom";
import { type Bond } from "./Bond";

export class Molecule implements IPresentable {
  constructor(
    private readonly _atoms: Atom[],
    private readonly _bonds: Bond[],
  ) {}

  /**
   * It's used for for...of loops
   */
  public *bonds(): Generator<Bond> {
    for (const bond of this._bonds) {
      yield bond;
    }
  }

  public toJSON(): Record<string, unknown> {
    return {
      atoms: this._atoms.map((atom) => atom.toJSON()),
      bonds: this._bonds.map((bond) => bond.toJSON()),
    };
  }
}
