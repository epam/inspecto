import { Molecule, type KetcherNode } from "@models";

export class Structure {
  constructor(public nodes: KetcherNode[]) {}

  public molecules(): Molecule[] {
    return this.nodes.filter(node => node instanceof Molecule);
  }

  public removeMolecule(moleculeId: string): boolean {
    const originalLength = this.nodes.length;
    this.nodes = this.nodes.filter(node => !(node instanceof Molecule && node.id === moleculeId));
    return this.nodes.length !== originalLength;
  }
}
