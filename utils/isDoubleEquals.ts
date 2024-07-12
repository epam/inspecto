export function isNumbersEqual(first: number, second: number, epsilon?: number): boolean {
  return Math.abs(first - second) < (epsilon ?? Number.EPSILON);
}
