import {
  type RawKetData,
  type IDataModelProcessor,
  type RawKetAtom,
  type RawKetBonds,
  RawKetMoleculeType,
  type RawKetChems,
  type RawKetMolecule,
} from "@infrastructure";
import { injectable } from "inversify";
import {
  Atom,
  Structure,
  Location,
  Bond,
  Molecule,
  type KetcherNode,
} from "@models";

@injectable()
export class DataModelProcessor implements IDataModelProcessor {
  public createDataModel(structure: string): Structure {
    try {
      const rawKetData: RawKetData = JSON.parse(structure);
      const nodes = rawKetData.root.nodes.map(({ $ref }) => $ref);
      const nodesMap = nodes.map((nodeId) => {
        const rawNodeData = rawKetData[nodeId] as RawKetChems;

        // TODO: create smart type definitions
        if (rawNodeData.type === RawKetMoleculeType.MOLECULE) {
          return this._createMolecule(nodeId, rawNodeData);
        }

        return [nodeId, null] as [string, null];
      });

      return new Structure(nodesMap);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public dataModelToKet(structure: Structure): string {
    const result: RawKetData = {
      root: { nodes: [] },
    };

    for (const node of structure.nodes()) {
      const [$ref, ketcherNode] = node;
      result.root.nodes.push({ $ref });
      result[$ref] = this._ketcherNodeToKet(ketcherNode);
    }

    return JSON.stringify(result);
  }

  private _createMolecule(
    nodeId: string,
    rawNodeData: RawKetMolecule,
  ): [string, KetcherNode] {
    const atoms = this._createAtoms(rawNodeData.atoms);
    const bonds = this._createBonds(rawNodeData.bonds, atoms);
    const molecule = new Molecule(nodeId, atoms, bonds);

    return [nodeId, molecule] as [string, KetcherNode];
  }

  private _createAtoms(rawKetAtoms: RawKetAtom[]): Atom[] {
    return rawKetAtoms.map(({ location: rawLocation, label, charge }) => {
      const location = new Location(...rawLocation);
      return new Atom(label, location, charge);
    });
  }

  private _createBonds(rawKetBonds: RawKetBonds[], atoms: Atom[]): Bond[] {
    return rawKetBonds.map(({ type, atoms: atomsIndexes }) => {
      return new Bond(
        type,
        [atoms[atomsIndexes[0]], atoms[atomsIndexes[1]]],
        atomsIndexes,
      );
    });
  }

  private _ketcherNodeToKet(ketcherNode: KetcherNode): RawKetChems {
    // Hack, fix it
    const result = { type: ketcherNode.type } as unknown as RawKetChems;
    // TODO: add proper types coersion
    if (ketcherNode.type === RawKetMoleculeType.MOLECULE) {
      const atoms: RawKetAtom[] = [];
      const bonds: RawKetBonds[] = [];

      for (const atom of (ketcherNode as Molecule).atoms()) {
        atoms.push({
          label: atom.label,
          location: atom.vector,
        });
      }

      for (const bond of (ketcherNode as Molecule).bonds()) {
        bonds.push({
          type: bond.bondType,
          atoms: bond.atomsIndexes,
        });
      }
      return { type: ketcherNode.type, atoms, bonds };
    }

    return result;
  }
}
