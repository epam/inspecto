import { getAngleBetweenAtoms } from "./getAngleBetweenAtoms";
import { Atom } from "../inspecto/models/Atom";
import { Location } from "../inspecto/models/Location";
import { describe, it, expect } from "vitest";

describe("getAngleBetweenAtoms", () => {
  it("calculates the angle correctly for 45 degrees", () => {
    const centerAtom = new Atom("C", new Location(1, 1, 0));
    const atom1 = new Atom("A", new Location(1, 2, 0));
    const atom2 = new Atom("B", new Location(2, 2, 0));

    const angle = getAngleBetweenAtoms(centerAtom, atom1, atom2);
    expect(angle).toBeCloseTo(45);
  });

  it("calculates the angle correctly for 90 degrees", () => {
    const centerAtom = new Atom("C", new Location(1, 1, 0));
    const atom1 = new Atom("A", new Location(1, 2, 0));
    const atom2 = new Atom("B", new Location(2, 1, 0));

    const angle = getAngleBetweenAtoms(centerAtom, atom1, atom2);
    expect(angle).toBeCloseTo(90);
  });

  it("calculates the angle correctly for 120 degrees", () => {
    const centerAtom = new Atom("C", new Location(2, 1, 0));
    const atom1 = new Atom("A", new Location(1, 1, 0));
    const atom2 = new Atom("B", new Location(3.3655, 3.3655, 0));

    const angle = getAngleBetweenAtoms(centerAtom, atom1, atom2);
    expect(angle).toBeCloseTo(120);
  });

  it("calculates the angle correctly for 180 degrees", () => {
    const centerAtom = new Atom("C", new Location(1, 1, 0));
    const atom1 = new Atom("A", new Location(2, 1, 0));
    const atom2 = new Atom("B", new Location(0, 1, 0));

    const angle = getAngleBetweenAtoms(centerAtom, atom1, atom2);
    expect(angle).toBeCloseTo(180);
  });

  it("calculates the angle correctly for 270 degrees", () => {
    const centerAtom = new Atom("C", new Location(1, 1, 0));
    const atom1 = new Atom("A", new Location(1, 0, 0));
    const atom2 = new Atom("B", new Location(2, 1, 0));

    const angle = getAngleBetweenAtoms(centerAtom, atom1, atom2);
    expect(angle).toBeCloseTo(270);
  });

  it("calculates the angle correctly for 0 and 360 degrees", () => {
    const centerAtom = new Atom("C", new Location(1, 1, 0));
    const atom1 = new Atom("A", new Location(1, 2, 0));
    const atom2 = new Atom("B", new Location(1, 2, 0));

    const angle = getAngleBetweenAtoms(centerAtom, atom1, atom2);
    expect(angle).toBeCloseTo(360);
  });
});
