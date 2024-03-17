import { Molecule, type KetcherNode } from "@models";

export class Structure {
  private readonly nodes: Map<string, KetcherNode>;

  constructor(moleculesMap: Array<[string, KetcherNode | null]>) {
    const filteredMoleculesMap = moleculesMap.filter(
      ([_, node]) => node !== null,
    ) as Array<[string, KetcherNode]>;
    this.nodes = new Map(filteredMoleculesMap);
  }

  [Symbol.iterator](): Iterator<KetcherNode> {
    return this.nodes.values();
  }

  public *molecules(): Generator<Molecule> {
    for (const molecule of this.nodes.values()) {
      if (molecule instanceof Molecule) {
        yield molecule;
      }
    }
  }
}
