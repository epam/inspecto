/* eslint-disable @typescript-eslint/consistent-type-definitions */

export enum RawKetType {
  MOLECULE = "molecule",
  MONOMER = "monomer",
  MONOMER_TEMPLATE = "monomerTemplate",
}

export type RawKetAtom = {
  label: string;
  location: [number, number, number];
  charge?: number;
};

export type RawKetBonds = {
  type: number;
  atoms: [number, number];
};

export type RawKetMolecule = {
  type: RawKetType.MOLECULE;
  atoms: RawKetAtom[];
  bonds: RawKetBonds[];
};

export type RawKetMonomer = {
  type: RawKetType.MONOMER;
  id: string;
  position: Record<"x" | "y", number>;
  alias: string;
  templateId: string;
};

export type RawKetMonomerTemplate = {
  type: RawKetType.MONOMER_TEMPLATE;
  atoms: RawKetAtom[];
  bonds: RawKetBonds[];
  id: string;
  fullName: string;
  alias: string;
};

type Root = {
  nodes: Array<Record<"$ref", string>>;
};

export type RawKetChems = RawKetMolecule | RawKetMonomer;

export type RawKetData = {
  root: Root;
  [key: string]: RawKetChems | Root;
};
