import { describe, it, expect } from "vitest";
import { getCommonAtomInAdjacentBonds } from "./getCommonAtomInAdjacentBonds";
import { Atom, Bond, BOND_TYPES, Location } from "@models";

describe("getCommonAtomInAdjacentBonds", () => {
  function createAtomWithLocation(label: string, x: number, y: number, z: number): Atom {
    return new Atom(label, new Location(x, y, z));
  }

  it('returns common atom when both bonds share the same "to" atom', () => {
    const commonAtom = createAtomWithLocation("C", 1, 2, 3);
    const atom1 = createAtomWithLocation("H", 0, 2, 3);
    const atom2 = createAtomWithLocation("O", 2, 2, 3);

    const bond1 = new Bond(BOND_TYPES.SINGLE, [atom1, commonAtom], [0, 1]);
    const bond2 = new Bond(BOND_TYPES.DOUBLE, [atom2, commonAtom], [2, 1]);

    const result = getCommonAtomInAdjacentBonds(bond1, bond2);
    expect(result).toBe(commonAtom);
  });

  it("returns null when bonds share no common atom", () => {
    const atom1 = createAtomWithLocation("С", 1, 2, 3);
    const atom2 = createAtomWithLocation("H", 0, 2, 3);
    const atom3 = createAtomWithLocation("O", 2, 2, 3);
    const atom4 = createAtomWithLocation("N", 3, 2, 3);
    const bond1 = new Bond(BOND_TYPES.SINGLE, [atom1, atom2], [0, 1]);
    const bond2 = new Bond(BOND_TYPES.DOUBLE, [atom3, atom4], [2, 3]);
    const result = getCommonAtomInAdjacentBonds(bond1, bond2);
    expect(result).toBeNull();
  });

  it('returns common atom when both bonds share the same "from" atom', () => {
    const commonAtom = createAtomWithLocation("N", 3, 2, 3);
    const atom1 = createAtomWithLocation("O", 2, 3, 3);
    const atom2 = createAtomWithLocation("C", 1, 1, 3);

    const bond1 = new Bond(BOND_TYPES.SINGLE, [commonAtom, atom1], [1, 0]);
    const bond2 = new Bond(BOND_TYPES.DOUBLE, [commonAtom, atom2], [1, 2]);

    const result = getCommonAtomInAdjacentBonds(bond1, bond2);
    expect(result).toBe(commonAtom);
  });

  it('returns common atom when one bond\'s "from" atom is the other bond\'s "to" atom', () => {
    const commonAtom = createAtomWithLocation("O", 4, 2, 3);
    const atom1 = createAtomWithLocation("C", 5, 1, 3);
    const atom2 = createAtomWithLocation("H", 3, 3, 3);

    const bond1 = new Bond(BOND_TYPES.SINGLE, [commonAtom, atom1], [0, 1]);
    const bond2 = new Bond(BOND_TYPES.DOUBLE, [atom2, commonAtom], [2, 0]);

    const result = getCommonAtomInAdjacentBonds(bond1, bond2);
    expect(result).toBe(commonAtom);
  });

  it('returns common atom when one bond\'s "to" atom is the other bond\'s "from" atom', () => {
    const commonAtom = createAtomWithLocation("H", 6, 2, 3);
    const atom1 = createAtomWithLocation("C", 7, 1, 3);
    const atom2 = createAtomWithLocation("N", 5, 3, 3);

    const bond1 = new Bond(BOND_TYPES.SINGLE, [atom1, commonAtom], [1, 0]);
    const bond2 = new Bond(BOND_TYPES.DOUBLE, [commonAtom, atom2], [0, 2]);

    const result = getCommonAtomInAdjacentBonds(bond1, bond2);
    expect(result).toBe(commonAtom);
  });
});
