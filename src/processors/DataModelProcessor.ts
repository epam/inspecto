import {
  type RawKetData,
  type IDataModelProcessor,
  type RawKetMolecule,
  type RawKetAtom,
  type RawKetBonds,
} from "@infrastructure";
import { injectable } from "inversify";
import { Atom, Structure, Location, Bond, Molecule } from "@models";

@injectable()
export class DataModelProcessor implements IDataModelProcessor {
  public createDataModel(structure: string): Structure {
    try {
      const rawKetData: RawKetData = JSON.parse(structure);
      const molecules = rawKetData.root.nodes.map(({ $ref }) => $ref);
      const moleculesMap = molecules.map((molId) => {
        const rawMoleculeKetData = rawKetData[molId] as RawKetMolecule;
        const atoms = this._createAtoms(rawMoleculeKetData.atoms);
        const bonds = this._createBonds(rawMoleculeKetData.bonds, atoms);
        const molecule = new Molecule(molId, atoms, bonds);

        return [molId, molecule] as [string, Molecule];
      });

      return new Structure(moleculesMap);
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
