export enum Types {
  SGROUP = "SUP",
  ATOM = "ATOM",
  STRUCTURE = "STRUCTURE",
  BOND = "BOND",
  MOLECULE = "molecule",
  MONOMER = "monomer",
  MONOMER_TEMPLATE = "monomerTemplate",
}

export abstract class GenericNode {
  type!: Types;
}
