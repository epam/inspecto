import { type Bond } from "@models";

export function isBondsOverlapping(bondOne: Bond, bondTwo: Bond): boolean {
  if (new Set([bondOne.from, bondOne.to, bondTwo.from, bondTwo.to]).size < 4) {
    return false;
  }

  const { x: x1, y: y1 } = bondOne.to;
  const { x: x2, y: y2 } = bondOne.from;

  const { x: x3, y: y3 } = bondTwo.to;
  const { x: x4, y: y4 } = bondTwo.from;

  const t1 = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  const t2 = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  return t1 > 0 && t1 <= 1 && t2 > 0 && t2 <= 1;
}
