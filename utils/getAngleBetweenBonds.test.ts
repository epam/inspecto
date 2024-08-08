import { describe, it, expect } from "vitest";
import { getAngleBetweenBonds } from "./getAngleBetweenBonds";
import { Atom } from "../inspecto/models/Atom";
import { Location } from "../inspecto/models/Location";
import { Bond, BOND_TYPES } from "../inspecto/models/Bond";

describe("getAngleBetweenBonds", () => {
  it("calculates the angle correctly for 45 degrees", () => {
    const centerAtom = new Atom("C", new Location(1, 1, 0));
    const atom1 = new Atom("A", new Location(1, 2, 0));
    const atom2 = new Atom("B", new Location(2, 2, 0));
    const bond1 = new Bond(BOND_TYPES.SINGLE, [centerAtom, atom1], [0, 1]);
    const bond2 = new Bond(BOND_TYPES.SINGLE, [centerAtom, atom2], [0, 2]);
    const angle = getAngleBetweenBonds(bond1, bond2);
    expect(angle).toBeCloseTo(Math.PI / 4);
  });

  it("calculates the angle correctly for 120 degrees", () => {
    const centerAtom = new Atom("C", new Location(0, 0, 0));
    const atom1 = new Atom("A", new Location(1, 0, 0));
    const atom2 = new Atom("B", new Location(-0.5, Math.sqrt(3) / 2, 0));
    const bond1 = new Bond(BOND_TYPES.SINGLE, [centerAtom, atom1], [0, 1]);
    const bond2 = new Bond(BOND_TYPES.SINGLE, [centerAtom, atom2], [0, 2]);
    const angle = getAngleBetweenBonds(bond1, bond2);
    expect(angle).toBeCloseTo((2 * Math.PI) / 3);
  });

  it("calculates the angle correctly for 90 degrees", () => {
    const sharedAtom = new Atom("C", new Location(1, 1, 0));
    const atom1 = new Atom("H", new Location(1, 2, 0));
    const atom2 = new Atom("H", new Location(2, 1, 0));
    const bond1 = new Bond(BOND_TYPES.SINGLE, [sharedAtom, atom1], [0, 1]);
    const bond2 = new Bond(BOND_TYPES.SINGLE, [sharedAtom, atom2], [0, 2]);
    const angle = getAngleBetweenBonds(bond1, bond2);
    expect(angle).toBeCloseTo(Math.PI / 2, 6);
  });

  it("calculates the angle correctly for 180 degrees", () => {
    const sharedAtom = new Atom("C", new Location(1, 1, 0));
    const atom1 = new Atom("H", new Location(0, 1, 0));
    const atom2 = new Atom("H", new Location(2, 1, 0));
    const bond1 = new Bond(BOND_TYPES.SINGLE, [sharedAtom, atom1], [0, 1]);
    const bond2 = new Bond(BOND_TYPES.SINGLE, [sharedAtom, atom2], [0, 2]);
    const angle = getAngleBetweenBonds(bond1, bond2);
    expect(angle).toBeCloseTo(Math.PI, 6);
  });

  it("calculates the angle correctly for 60 degrees", () => {
    const centerAtom = new Atom("C", new Location(0, 0, 0));
    const atom1 = new Atom("A", new Location(1, 0, 0));
    const atom2 = new Atom("B", new Location(0.5, Math.sqrt(3) / 2, 0));
    const bond1 = new Bond(BOND_TYPES.SINGLE, [centerAtom, atom1], [0, 1]);
    const bond2 = new Bond(BOND_TYPES.SINGLE, [centerAtom, atom2], [0, 2]);
    const angle = getAngleBetweenBonds(bond1, bond2);
    expect(angle).toBeCloseTo(Math.PI / 3);
  });

  it("throws an error when bonds are not connected", () => {
    const atom1 = new Atom("C", new Location(0, 0, 0));
    const atom2 = new Atom("O", new Location(0, 1, 0));
    const atom3 = new Atom("H", new Location(2, 2, 0));
    const atom4 = new Atom("N", new Location(3, 3, 0));
    const bond1 = new Bond(BOND_TYPES.SINGLE, [atom1, atom2], [0, 1]);
    const bond2 = new Bond(BOND_TYPES.SINGLE, [atom3, atom4], [2, 3]);
    expect(() => getAngleBetweenBonds(bond1, bond2)).toThrowError();
  });

  it("handles edge cases with colinear bonds", () => {
    const atom1 = new Atom("C", new Location(0, 0, 0));
    const atom2 = new Atom("O", new Location(1, 1, 0));
    const atom3 = new Atom("H", new Location(2, 2, 0));
    // Connections form a straight line (collinear), the angle between them must be 0 or 180 degrees
    const bond1 = new Bond(BOND_TYPES.SINGLE, [atom1, atom2], [0, 1]);
    const bond2 = new Bond(BOND_TYPES.SINGLE, [atom2, atom3], [1, 2]);
    const angle = getAngleBetweenBonds(bond1, bond2);
    const isAngleZeroOrPi = Math.abs(angle) < Number.EPSILON || Math.abs(angle - Math.PI) < Number.EPSILON;
    expect(isAngleZeroOrPi).toBe(true);
  });

  it("handles cases where the bonds share more than one atom", () => {
    const atom1 = new Atom("C", new Location(0, 0, 0));
    const atom2 = new Atom("O", new Location(1, 0, 0));
    const bond1 = new Bond(BOND_TYPES.SINGLE, [atom1, atom2], [0, 1]);
    const bond2 = new Bond(BOND_TYPES.DOUBLE, [atom1, atom2], [0, 1]);
    // We expect the angle to be 0, since the bonds coincide
    const angle = getAngleBetweenBonds(bond1, bond2);
    expect(angle).toBeCloseTo(0);
  });

  it("calculates the angle when bonds are connected in a circular manner (chain)", () => {
    const atom1 = new Atom("H", new Location(0, 0, 0));
    const atom2 = new Atom("O", new Location(2, 0, 0));
    const atom3 = new Atom("H", new Location(2, 2, 0));
    const bond1 = new Bond(BOND_TYPES.SINGLE, [atom1, atom2], [0, 1]);
    const bond2 = new Bond(BOND_TYPES.SINGLE, [atom2, atom3], [1, 2]);
    // The angle should be 90 degrees, since the connections create a right triangle
    const angle = getAngleBetweenBonds(bond1, bond2);
    expect(angle).toBeCloseTo(Math.PI / 2, 6);
  });
});
