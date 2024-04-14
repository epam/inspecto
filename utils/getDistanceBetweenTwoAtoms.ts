import { type Atom } from "../inspecto/models/Atom";

type GetDistanceBetweenTwoAtoms = (atom1: Atom, atom: Atom) => number;

export const getDistanceBetweenTwoAtoms: GetDistanceBetweenTwoAtoms = (
  atom1,
  atom2,
) => {
  const deltaX = atom1.x - atom2.x;
  const deltaY = atom1.y - atom2.y;
  const deltaZ = atom1.z - atom2.z;

  return Math.sqrt(
    Math.pow(deltaX, 2) + Math.pow(deltaY, 2) + Math.pow(deltaZ, 2),
  );
};
