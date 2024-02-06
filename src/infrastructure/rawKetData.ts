/* eslint-disable @typescript-eslint/consistent-type-definitions */

// TODO: think about it once more time
enum RawKetMoleculeType {
  MOLECULE = "molecule",
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
  type: RawKetMoleculeType;
  atoms: RawKetAtom[];
  bonds: RawKetBonds[];
};

type Root = {
  nodes: Array<Record<"$ref", string>>;
};

export type RawKetData = {
  root: Root;
  [key: string]: RawKetMolecule | Root;
};
