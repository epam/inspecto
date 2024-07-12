import { type Atom } from "@models";

export function findCoordinatesForAngle(
  referenceAtom: Atom,
  centerAtom: Atom,
  distance: number,
  angle: number
): { x: number; y: number } {
  const radians = (180 - angle) * (Math.PI / 180);

  const referenceVectorX = centerAtom.x - referenceAtom.x;
  const referenceVectorY = centerAtom.y - referenceAtom.y;

  const referenceVectorLength = Math.sqrt(Math.pow(referenceVectorX, 2) + Math.pow(referenceVectorY, 2));

  const referenceVectorXNorm = referenceVectorX / referenceVectorLength;
  const referenceVectorYNorm = referenceVectorY / referenceVectorLength;

  const cosA = Math.cos(radians);
  const sinA = Math.sin(radians);

  const rotatedVectorXNorm = referenceVectorXNorm * cosA - referenceVectorYNorm * sinA;
  const rotatedVectorYNorm = referenceVectorXNorm * sinA + referenceVectorYNorm * cosA;

  const rotatedVectorXScaled = rotatedVectorXNorm * distance;
  const rotatedVectorYScaled = rotatedVectorYNorm * distance;

  const newX = centerAtom.x + rotatedVectorXScaled;
  const newY = centerAtom.y + rotatedVectorYScaled;

  return { x: newX, y: newY };
}
