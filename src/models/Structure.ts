import { Molecule, type KetcherNode } from "@models";

export class Structure {
  private readonly _nodes: Map<string, KetcherNode>;

  constructor(moleculesMap: Array<[string, KetcherNode | null]>) {
    const filteredMoleculesMap = moleculesMap.filter(
      ([_, node]) => node !== null,
    ) as Array<[string, KetcherNode]>;
    this._nodes = new Map(filteredMoleculesMap);
  }

  [Symbol.iterator](): Iterator<KetcherNode> {
    return this._nodes.values();
  }

  public *molecules(): Generator<Molecule> {
    for (const node of this._nodes.values()) {
      if (node instanceof Molecule) {
        yield node;
      }
    }
  }

  // public convertToKetFormat(): RawKetData {}
}
