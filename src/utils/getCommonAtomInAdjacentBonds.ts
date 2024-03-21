import { type Atom, type Bond } from "@models";

type GetCommonAtomInAdjacentBonds = (bond1: Bond, bond2: Bond) => Atom | null;

export const getCommonAtomInAdjacentBonds: GetCommonAtomInAdjacentBonds = (
  bond1,
  bond2,
) => {
  switch (true) {
    case bond1.to === bond2.to:
    case bond1.to === bond2.from:
      return bond1.to;
    case bond1.from === bond2.to:
    case bond1.from === bond2.from:
      return bond1.from;
    default:
      return null;
  }
};
