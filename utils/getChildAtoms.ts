import { type Atom, type Molecule } from "@models";

export function getChildAtoms(parentAtom: Atom, molecule: Molecule, exclude: Set<Atom>): Set<Atom> {
  let childAtoms = new Set<Atom>();
  const connectedAtoms = molecule.getConnectedAtoms(parentAtom);
  const notVisitedConnectedAtoms = connectedAtoms.filter(connectedAtom => !exclude.has(connectedAtom));
  exclude.add(parentAtom);
  for (const notVisitedConnectedAtom of notVisitedConnectedAtoms) {
    childAtoms = new Set([...childAtoms, notVisitedConnectedAtom]);
    exclude.add(notVisitedConnectedAtom);
    childAtoms = new Set([...childAtoms, ...getChildAtoms(notVisitedConnectedAtom, molecule, exclude)]);
  }
  return childAtoms;
}
