import { type Molecule } from "./Molecule";

export class Structure {
  private readonly molecules: Map<string, Molecule>;

  constructor(moleculesMap: Array<[string, Molecule]>) {
    this.molecules = new Map(moleculesMap);
  }

  [Symbol.iterator](): Iterator<Molecule> {
    return this.molecules.values();
  }

  public toJSON(): Record<string, unknown> {
    return Array.from(this.molecules).reduce<Record<string, unknown>>(
      (acc, [molId, molecule]) => {
        acc[molId] = molecule.toJSON();

        return acc;
      },
      {},
    );
  }
}
