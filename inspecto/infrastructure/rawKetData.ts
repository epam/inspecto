/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { QueryProperties } from "../models/Atom";

import type { Types } from "@inspecto/models/types";

export type RawKetAtom = {
  label: string;
  location: [number, number, number];
  charge?: number;
  stereoLabel?: string;
  isotope?: number;
  queryProperties?: QueryProperties;
  cip?: string | undefined;
  explicitValence?: number | undefined;
  mapping?: number | undefined;
  implicitHCount?: number | undefined;
  radical?: number | undefined;
};

export type RawKetBonds = {
  type: number;
  atoms: [number, number];
  stereo?: number;
  cip?: string | undefined;
};

export type AttachmentPoint = {
  attachmentAtom: number;
  attachmentId: string;
};

export type RawKetSGroups = {
  type: string;
  atoms: number[];
  name: string;
  id: number;
  attachmentPoints: AttachmentPoint[];
};

export type RawKetMolecule = {
  type: Types.MOLECULE;
  atoms: RawKetAtom[];
  bonds: RawKetBonds[];
  sgroups: RawKetSGroups[];
};

export type RawKetMonomer = {
  type: Types.MONOMER;
  id: string;
  position: Record<"x" | "y", number>;
  alias: string;
  templateId: string;
};

export type RawKetMonomerTemplate = {
  type: Types.MONOMER_TEMPLATE;
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
