import {
  type RawKetData,
  type IDataModelProcessor,
  type RawKetAtom,
  type RawKetBonds,
  RawKetType,
  type RawKetChems,
  type RawKetMolecule,
  type RawKetMonomer,
  type RawKetMonomerTemplate,
  type RawKetSGroups,
  type Types,
} from "@infrastructure";
import { injectable } from "inversify";
import { Atom, Structure, Location, Bond, Molecule, type KetcherNode, MonomerTemplate, Monomer, SGroup } from "@models";

@injectable()
export class DataModelProcessor implements IDataModelProcessor {
  public createDataModel(structure: string): Structure {
    try {
      const rawKetData: RawKetData = JSON.parse(structure);
      const nodes = rawKetData.root.nodes.map(({ $ref }) => $ref);
      const nodesMap = nodes.map(nodeId => {
        const rawNodeData = rawKetData[nodeId] as RawKetChems;

        // TODO: create smart type definitions
        if (rawNodeData.type === RawKetType.MOLECULE) {
          return this._createMolecule(nodeId, rawNodeData);
        }

        if (rawNodeData.type === RawKetType.MONOMER) {
          const rawMonomerTemplate: RawKetMonomerTemplate = rawKetData[
            `monomerTemplate-${rawNodeData.templateId}`
          ] as unknown as RawKetMonomerTemplate;
          return this._createMonomer(nodeId, rawNodeData, rawMonomerTemplate);
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

  private _createMolecule(nodeId: string, rawNodeData: RawKetMolecule): [string, KetcherNode] {
    const atoms = this._createAtoms(rawNodeData.atoms);
    const bonds = this._createBonds(rawNodeData.bonds ?? [], atoms);
    const sgroups = this._createSGroups(rawNodeData.sgroups ?? []);

    const molecule = new Molecule(nodeId, atoms, bonds, sgroups);

    return [nodeId, molecule] as [string, KetcherNode];
  }

  private _createMonomer(
    nodeId: string,
    rawNodeData: RawKetMonomer,
    rawMonomerTemplate: RawKetMonomerTemplate
  ): [string, KetcherNode] {
    const atoms = this._createAtoms(rawMonomerTemplate.atoms);
    const bonds = this._createBonds(rawMonomerTemplate.bonds ?? [], atoms);
    const monomerTemplate = new MonomerTemplate(
      `monomerTemplate-${rawMonomerTemplate.id}`,
      rawMonomerTemplate.id,
      atoms,
      bonds
    );
    const monomer = new Monomer(
      nodeId,
      rawNodeData.id,
      new Location(rawNodeData.position.x, rawNodeData.position.y, 0),
      monomerTemplate
    );

    return [nodeId, monomer] as [string, KetcherNode];
  }

  private _createAtoms(rawKetAtoms: RawKetAtom[]): Atom[] {
    return rawKetAtoms.map(({ location: rawLocation, label, charge, stereoLabel }) => {
      const location = new Location(...rawLocation);
      return new Atom(label, location, charge, stereoLabel);
    });
  }

  private _createBonds(rawKetBonds: RawKetBonds[], atoms: Atom[]): Bond[] {
    return rawKetBonds.map(({ type, stereo, atoms: atomsIndexes }) => {
      return new Bond(type, [atoms[atomsIndexes[0]], atoms[atomsIndexes[1]]], atomsIndexes, stereo);
    });
  }

  private _createSGroups(rawKetSGroups: RawKetSGroups[]): SGroup[] {
    return rawKetSGroups.map(({ type, atoms, name, id, attachmentPoints }) => {
      return new SGroup(type as Types.SGROUP, atoms, name, id, attachmentPoints);
    });
  }

  private _ketcherNodeToKet(ketcherNode: KetcherNode): RawKetChems {
    // Hack, fix it
    const result = { type: ketcherNode.type } as unknown as RawKetChems;
    // TODO: add proper types coersion
    if (ketcherNode.type === RawKetType.MOLECULE) {
      const atoms: RawKetAtom[] = [];
      const bonds: RawKetBonds[] = [];
      const sgroups: RawKetSGroups[] = [];

      for (const atom of (ketcherNode as Molecule).atoms()) {
        atoms.push({
          label: atom.label,
          location: atom.vector,
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          ...(atom.charge && { charge: atom.charge }),
          stereoLabel: atom.stereolabel,
        });
      }

      for (const bond of (ketcherNode as Molecule).bonds()) {
        bonds.push({
          type: bond.bondType,
          atoms: bond.atomsIndexes,
          stereo: bond.stereo,
        });
      }

      for (const sgroup of (ketcherNode as Molecule).sgroups()) {
        sgroups.push({
          type: sgroup.type,
          atoms: sgroup.atoms,
          name: sgroup.name,
          id: sgroup.id,
          attachmentPoints: JSON.parse(JSON.stringify(sgroup.attachmentPoints ?? [])),
        });
      }

      return { type: ketcherNode.type, atoms, bonds, sgroups };
    }

    return result;
  }
}
