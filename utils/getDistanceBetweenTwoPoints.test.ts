import { describe, it, expect } from "vitest";
import { getDistanceBetweenTwoPoints } from "./getDistanceBetweenTwoPoints";
import { Atom } from "../inspecto/models/Atom";
import { Location } from "../inspecto/models/Location";

describe("getDistanceBetweenTwoPoints tests", () => {
  it("calculates the correct distance between two atoms", () => {
    const atom1 = new Atom("Atom1", new Location(1, 1, 1));
    const atom2 = new Atom("Atom2", new Location(5, 5, 5));

    const result = getDistanceBetweenTwoPoints(atom1, atom2);

    expect(result).toBeCloseTo(6.928, 3);
  });
  it("calculates the correct distance between two atoms with negative coordinates", () => {
    const atom1 = new Atom("Atom1", new Location(-1, -1, -1));
    const atom2 = new Atom("Atom2", new Location(-5, -5, -5));

    const result = getDistanceBetweenTwoPoints(atom1, atom2);

    expect(result).toBeCloseTo(6.928, 3);
  });
  it("calculates the correct distance between two atoms with a mix of positive and negative coordinates", () => {
    const atom1 = new Atom("Atom1", new Location(-1, 5, 6));
    const atom2 = new Atom("Atom2", new Location(4, 2, 9));

    const result = getDistanceBetweenTwoPoints(atom1, atom2);

    expect(result).toBeCloseTo(6.557, 3);
  });

  it("calculates the correct distance for atoms1 and atom2 with coordinates (0, 0, 3)", () => {
    const atom1 = new Atom("Atom1", new Location(1, 1, 1));
    const atom2 = new Atom("Atom2", new Location(0, 0, 3));

    expect(getDistanceBetweenTwoPoints(atom1, atom2)).toBeCloseTo(2.449, 3);
  });

  it("calculates the correct distance for atoms1 and atom2 with coordinates (0, 2, 0)", () => {
    const atom1 = new Atom("Atom1", new Location(1, 1, 1));
    const atom2 = new Atom("Atom2", new Location(0, 2, 0));

    expect(getDistanceBetweenTwoPoints(atom1, atom2)).toBeCloseTo(1.732, 3);
  });

  it("calculates the correct distance for atoms1 and atom2 with coordinates (1, 0, 0)", () => {
    const atom1 = new Atom("Atom1", new Location(1, 1, 1));
    const atom2 = new Atom("Atom2", new Location(1, 0, 0));

    expect(getDistanceBetweenTwoPoints(atom1, atom2)).toBeCloseTo(1.414, 3);
  });

  it("calculates the correct distance for atoms1 and atom2 with coordinates (0,1,1)", () => {
    const atom1 = new Atom("Atom1", new Location(1, 1, 1));
    const atom2 = new Atom("Atom2", new Location(0, 1, 1));

    expect(getDistanceBetweenTwoPoints(atom1, atom2)).toBeCloseTo(1, 3);
  });

  it("calculates the correct distance for atoms1 and atom2 with coordinates (1,0,1)", () => {
    const atom1 = new Atom("Atom1", new Location(1, 1, 1));
    const atom2 = new Atom("Atom2", new Location(1, 0, 1));

    expect(getDistanceBetweenTwoPoints(atom1, atom2)).toBeCloseTo(1, 3);
  });

  it("calculates the correct distance for atoms1 and atom2 with coordinates (1,1,0)", () => {
    const atom1 = new Atom("Atom1", new Location(1, 1, 1));
    const atom2 = new Atom("Atom2", new Location(1, 1, 0));

    expect(getDistanceBetweenTwoPoints(atom1, atom2)).toBeCloseTo(1, 3);
  });

  it("returns 0 for the same atom", () => {
    const atom = new Atom("Atom", new Location(1, 1, 1));

    const result = getDistanceBetweenTwoPoints(atom, atom);

    expect(result).toBe(0);
  });

  it("returns 0 distance for two atoms at the origin", () => {
    const atom1 = new Atom("Atom1", new Location(0, 0, 0));
    const atom2 = new Atom("Atom2", new Location(0, 0, 0));

    expect(getDistanceBetweenTwoPoints(atom1, atom2)).toBe(0);
  });
});
