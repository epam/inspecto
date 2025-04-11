import { Molecule, type KetcherNode } from "@models";
import { Types } from "./types";

export class Structure {
  constructor(public nodes: KetcherNode[]) {}
  type: Types.STRUCTURE = Types.STRUCTURE;
  public molecules(): Molecule[] {
    return this.nodes.filter(node => node instanceof Molecule);
  }

  public removeMolecule(moleculeId: string): boolean {
    const originalLength = this.nodes.length;
    this.nodes = this.nodes.filter(node => !(node instanceof Molecule && node.id === moleculeId));
    return this.nodes.length !== originalLength;
  }
}
