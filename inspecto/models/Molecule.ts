import { KetcherNode } from "./KetcherNode";
import { type Atom } from "./Atom";
import { type BOND_TYPES, type Bond } from "./Bond";
import { GRAPH_ERRORS, Graph } from "./Graph";
import { RawKetType } from "@infrastructure";
import { type SGroup } from "@models";

export class Molecule extends KetcherNode {
  private readonly _graphView: Graph<Atom, Bond>;

  constructor(
    _molId: string,
    private readonly _atoms: Atom[],
    private readonly _bonds: Bond[],
    private readonly _sgroups: SGroup[]
  ) {
    super(_molId, RawKetType.MOLECULE);
    this._graphView = new Graph(atom => atom.toString());
    for (const atom of _atoms) {
      this._graphView.addVertex(atom);
    }

    for (const bond of _bonds) {
      this._graphView.addEdge(bond.from, bond.to, bond);
    }
  }

  /**
   * It's used for for...of loops
   */
  public *atoms(): Generator<Atom> {
    for (const atom of this._atoms) {
      yield atom;
    }
  }

  /**
   * It's used for for...of loops
   */
  public *bonds(): Generator<Bond> {
    for (const bond of this._bonds) {
      yield bond;
    }
  }

  public *sgroups(): Generator<SGroup> {
    for (const sgroup of this._sgroups) {
      yield sgroup;
    }
  }

  public getAtomIndex(atom: Atom): number {
    return this._atoms.indexOf(atom);
  }

  public getBondIndex(bond: Bond): number {
    return this._bonds.indexOf(bond);
  }

  public getGroupIndex(sgroup: SGroup): number {
    return this._sgroups.indexOf(sgroup);
  }

  public filterBondsByType(bondType: BOND_TYPES): Bond[] {
    return this._bonds.filter(bond => bond.bondType === bondType);
  }

  public removeBond(bond: Bond): void {
    this._bonds.splice(this.getBondIndex(bond), 1);
  }

  public getAtomBonds(atom: Atom): Bond[] {
    return this._bonds.filter(bond => bond.from === atom || bond.to === atom);
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
