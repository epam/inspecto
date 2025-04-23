import { describe, it, expect } from "vitest";
import { isBondsOverlapping } from "./isBondsOverlapping";
import { Atom, Bond, BOND_TYPES, Location } from "@models";

// Helper function to create atoms and bonds easily
function createBond(x1: number, y1: number, x2: number, y2: number): Bond {
  const atom1 = new Atom("C", new Location(x1, y1, 0));
  const atom2 = new Atom("C", new Location(x2, y2, 0));
  return new Bond(BOND_TYPES.SINGLE, [atom1, atom2], [0, 0]); // Bond type 1 (single)
}

describe("isBondsOverlapping", () => {
  it("should return true for clearly overlapping bonds", () => {
    const bond1 = createBond(0, 0, 2, 2);
    const bond2 = createBond(0, 2, 2, 0);
    expect(isBondsOverlapping(bond1, bond2)).toBe(true);
  });

  it("should return false for non-overlapping bonds", () => {
    const bond1 = createBond(0, 0, 1, 1);
    const bond2 = createBond(2, 2, 3, 3);
    expect(isBondsOverlapping(bond1, bond2)).toBe(false);
  });

  it("should return false for parallel bonds", () => {
    const bond1 = createBond(0, 0, 2, 0);
    const bond2 = createBond(0, 1, 2, 1);
    expect(isBondsOverlapping(bond1, bond2)).toBe(false);
  });

  it("should return false for collinear bonds that do not overlap", () => {
    const bond1 = createBond(0, 0, 1, 0);
    const bond2 = createBond(2, 0, 3, 0);
    expect(isBondsOverlapping(bond1, bond2)).toBe(false);
  });

  it("should return false if bonds share an atom", () => {
    const atom1 = new Atom("C", new Location(0, 0, 0));
    const atom2 = new Atom("C", new Location(1, 1, 0));
    const atom3 = new Atom("C", new Location(1, -1, 0));
    const bond1 = new Bond(BOND_TYPES.SINGLE, [atom1, atom2], [1, 2]);
    const bond2 = new Bond(BOND_TYPES.SINGLE, [atom1, atom3], [1, 3]);
    expect(isBondsOverlapping(bond1, bond2)).toBe(false);
  });

  it("should return false if bonds share two atoms (identical bonds)", () => {
    const atom1 = new Atom("C", new Location(0, 0, 0));
    const atom2 = new Atom("C", new Location(1, 1, 0));
    const bond1 = new Bond(BOND_TYPES.SINGLE, [atom1, atom2], [1, 2]);
    const bond2 = new Bond(BOND_TYPES.SINGLE, [atom1, atom2], [1, 2]); // Identical bond
    expect(isBondsOverlapping(bond1, bond2)).toBe(false);
  });

  it("should return true when endpoints nearly touch but lines cross", () => {
    const bond1 = createBond(0, 0, 2, 2);
    const bond2 = createBond(0, 2.001, 2, -0.001); // Slightly offset but crossing
    expect(isBondsOverlapping(bond1, bond2)).toBe(true);
  });

  it("should return false when lines would intersect if extended, but segments do not", () => {
    const bond1 = createBond(0, 0, 1, 1);
    const bond2 = createBond(0, 2, 1, 1.5); // Would intersect at (2,2) if extended
    expect(isBondsOverlapping(bond1, bond2)).toBe(false);
  });
});
