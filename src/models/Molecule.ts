import { type IPresentable } from "../infrastructure/types";
import { type Atom } from "./Atom";
import { type Bond } from "./Bond";

export class Molecule implements IPresentable {
  constructor(
    private readonly atoms: Atom[],
    private readonly bonds: Bond[],
  ) {}

  public toJSON(): Record<string, unknown> {
    return {
      atoms: this.atoms.map((atom) => atom.toJSON()),
      bonds: this.bonds.map((bond) => bond.toJSON()),
    };
  }
}
