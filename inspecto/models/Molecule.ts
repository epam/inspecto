import { KetcherNode } from "./KetcherNode";
import { type Atom } from "./Atom";
import { type BOND_TYPES, type Bond } from "./Bond";
import { GRAPH_ERRORS, Graph } from "./Graph";
import { type SGroup } from "@models";
import { Types } from "./types";

export class Molecule extends KetcherNode {
  private readonly _graphView: Graph<Atom, Bond>;

  constructor(
    _molId: string,
    public readonly atoms: Atom[],
    public readonly bonds: Bond[],
    public readonly sgroups: SGroup[]
  ) {
    super(_molId, Types.MOLECULE);
    this._graphView = new Graph(atom => atom.toString());
    for (const atom of atoms) {
      this._graphView.addVertex(atom);
    }

    for (const bond of bonds) {
      this._graphView.addEdge(bond.from, bond.to, bond);
    }
  }

  public getAtomIndex(atom: Atom): number {
    return this.atoms.indexOf(atom);
  }

  public getBondIndex(bond: Bond): number {
    return this.bonds.indexOf(bond);
  }

  public getGroupIndex(sgroup: SGroup): number {
    return this.sgroups.indexOf(sgroup);
  }

  public filterBondsByType(bondType: BOND_TYPES): Bond[] {
    return this.bonds.filter(bond => bond.bondType === bondType);
  }

  public removeBond(bond: Bond): void {
    this.bonds.splice(this.getBondIndex(bond), 1);
  }

  public getAtomBonds(atom: Atom): Bond[] {
    return this.bonds.filter(bond => bond.from === atom || bond.to === atom);
  }

  public getConnectedAtoms(atom: Atom): Atom[] {
    return this.getAtomBonds(atom).map(bond => (bond.from === atom ? bond.to : bond.from));
  }

  public getAdjacentBonds(bond: Bond): Bond[] {
    try {
      const adjacentBondsFrom = this._graphView
        .getAdjacentVertices(bond.from)
        .filter(({ to: atom }) => atom !== bond.to)
        .map(atom => atom.edge);

      const adjacentBondsTo = this._graphView
        .getAdjacentVertices(bond.to)
        .filter(({ to: atom }) => atom !== bond.from)
        .map(atom => atom.edge);

      return [...adjacentBondsFrom, ...adjacentBondsTo];
    } catch (error) {
      if (error === GRAPH_ERRORS.VERTIX_DOES_NOT_EXIST) {
        throw new Error("Atom is not added to model");
      }

      throw error;
    }
  }
}
