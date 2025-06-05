import type { QueryProperties } from "../models/Atom";

import type { Types } from "@inspecto/models/types";

export interface RawKetAtom {
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
}

export interface RawKetBonds {
  type: number;
  atoms: [number, number];
  stereo?: number;
  cip?: string | undefined;
}

export interface AttachmentPoint {
  attachmentAtom: number;
  attachmentId: string;
}

export interface RawKetSGroups {
  type: string;
  atoms: number[];
  name: string;
  id: number;
  attachmentPoints: AttachmentPoint[];
}

export interface RawKetMolecule {
  type: Types.MOLECULE;
  atoms: RawKetAtom[];
  bonds: RawKetBonds[];
  sgroups: RawKetSGroups[];
}

export interface RawKetMonomer {
  type: Types.MONOMER;
  id: string;
  position: Record<"x" | "y", number>;
  alias: string;
  templateId: string;
}

export interface RawKetMonomerTemplate {
  type: Types.MONOMER_TEMPLATE;
  atoms: RawKetAtom[];
  bonds: RawKetBonds[];
  id: string;
  fullName: string;
  alias: string;
}

interface Root {
  nodes: Array<Record<"$ref", string>>;
}

export type RawKetChems = RawKetMolecule | RawKetMonomer;

export interface RawKetData {
  root: Root;
  [key: string]: RawKetChems | Root;
}
