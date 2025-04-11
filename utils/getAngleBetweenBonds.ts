import { getDistanceBetweenTwoPoints } from "@utils";
import { type Bond } from "../inspecto/models/Bond";

type GetAngleBetweenBonds = (bond1: Bond, bond2: Bond) => number;
export const getAngleBetweenBonds: GetAngleBetweenBonds = (bond1, bond2) => {
  const thirdSideLength = getThridSideLength(bond1, bond2);

  if (thirdSideLength != null) {
    const a = bond1.getLength();
    const b = bond2.getLength();
    const c = thirdSideLength;

    return Math.acos((a ** 2 + b ** 2 - c ** 2) / (2 * a * b));
  }
  throw new Error("Bonds are not connected to each other directly or not conntecte at all");
};

type GetThridSideLength = (bond1: Bond, bond2: Bond) => number | null;

const getThridSideLength: GetThridSideLength = (bond1, bond2) => {
  if (bond1.to === bond2.to) {
    return getDistanceBetweenTwoPoints(bond1.from, bond2.from);
  }

  if (bond1.to === bond2.from) {
    return getDistanceBetweenTwoPoints(bond1.from, bond2.to);
  }

  if (bond1.from === bond2.to) {
    return getDistanceBetweenTwoPoints(bond1.to, bond2.from);
  }

  if (bond1.from === bond2.from) {
    return getDistanceBetweenTwoPoints(bond1.to, bond2.to);
  }

  return null;
};
