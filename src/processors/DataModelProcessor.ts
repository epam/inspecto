import {
  type RawKetData,
  type IDataModelProcessor,
  type RawKetAtom,
  type RawKetBonds,
  RawKetMoleculeType,
  type RawKetChems,
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
          const atoms = this._createAtoms(rawNodeData.atoms);
          const bonds = this._createBonds(rawNodeData.bonds, atoms);
          const molecule = new Molecule(nodeId, atoms, bonds);

          return [nodeId, molecule] as [string, KetcherNode];
        }

        return [nodeId, null] as [string, null];
      });

      return new Structure(nodesMap);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private _createAtoms(rawKetAtoms: RawKetAtom[]): Atom[] {
    return rawKetAtoms.map(({ location: rawLocation, label, charge }) => {
      const location = new Location(...rawLocation);
      return new Atom(label, location, charge);
    });
  }

  private _createBonds(rawKetBonds: RawKetBonds[], atoms: Atom[]): Bond[] {
    return rawKetBonds.map(({ type, atoms: atomsIndexes }) => {
      return new Bond(type, [atoms[atomsIndexes[0]], atoms[atomsIndexes[1]]]);
    });
  }
}
