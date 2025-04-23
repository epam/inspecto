const epsilon = 1;

// Normalize angle to be within [0, 360)
function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

export function isAngleEquals(first: number, second: number): boolean {
  const normalizedFirst = normalizeAngle(first);
  const normalizedSecond = normalizeAngle(second);

  const diff = Math.abs(normalizedFirst - normalizedSecond);
  const circularDiff = 360 - diff;

  const minDiff = Math.min(diff, circularDiff);
  return minDiff <= epsilon;
}
