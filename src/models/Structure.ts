import { type Molecule } from "./Molecule";

export class Structure {
  private readonly molecules: Map<string, Molecule>;

  constructor(moleculesMap: Array<[string, Molecule]>) {
    this.molecules = new Map(moleculesMap);
  }

  [Symbol.iterator](): Iterator<Molecule> {
    return this.molecules.values();
  }
}
