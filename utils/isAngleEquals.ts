import { isNumbersEqual } from "@utils";

const epsilon = 1;

export function isAngleEquals(first: number, second: number): boolean {
  return isNumbersEqual(first, second, epsilon);
}
