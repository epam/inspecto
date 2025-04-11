import { Atom, Location } from "@models";

export function createAtomWithLocation(label: string, x: number, y: number, z: number): Atom {
  return new Atom(label, new Location(x, y, z));
}
