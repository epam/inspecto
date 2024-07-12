import { type Atom } from "@models";

export function getAngleBetweenAtoms(centerAtom: Atom, atom1: Atom, atom2: Atom): number {
  const vector1 = { x: atom1.x - centerAtom.x, y: atom1.y - centerAtom.y };
  const vector2 = { x: atom2.x - centerAtom.x, y: atom2.y - centerAtom.y };

  const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;

  const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
  const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);

  const cosTheta = dotProduct / (magnitude1 * magnitude2);

  const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta));

  const angleInRadians = Math.acos(clampedCosTheta);

  const angleInDegrees = angleInRadians * (180 / Math.PI);

  const crossProduct = vector1.x * vector2.y - vector1.y * vector2.x;

  const angle = crossProduct > 0 ? 360 - angleInDegrees : angleInDegrees;

  if (Math.abs(angle) < 1) {
    return 360;
  }

  return angle;
}
