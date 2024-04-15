import { RawKetType } from "@infrastructure";
import { KetcherNode } from "./KetcherNode";
import { type Atom } from "./Atom";
import { type Bond } from "./Bond";
import { Graph } from "./Graph";

export class MonomerTemplate extends KetcherNode {
  private readonly _graphView: Graph<Atom, Bond>;

  constructor(
    nodeId: string,
    private readonly _monomerTemplateId: string,
    private readonly _atoms: Atom[],
    private readonly _bonds: Bond[],
  ) {
    super(nodeId, RawKetType.MONOMER_TEMPLATE);

    this._graphView = new Graph((atom) => atom.toString());

    for (const atom of _atoms) {
      this._graphView.addVertex(atom);
    }

    for (const bond of _bonds) {
      this._graphView.addEdge(bond.from, bond.to, bond);
    }
  }

  public get templateId(): string {
    return this._monomerTemplateId;
  }
}
