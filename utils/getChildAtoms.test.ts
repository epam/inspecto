import { describe, it, expect, vi } from "vitest";
import { getChildAtoms } from "./getChildAtoms";
import { Atom, Molecule, Location } from "@models";

describe("getChildAtoms", () => {
  function createAtom(label: string): Atom {
    return new Atom(label, new Location(0, 0, 0));
  }

  it("returns an empty set when there are no child atoms", () => {
    const parentAtom = createAtom("C");
    const molecule = new Molecule("mol1", [], [], []);
    molecule.getConnectedAtoms = vi.fn().mockReturnValue([]);

    const exclude = new Set<Atom>();
    const childAtoms = getChildAtoms(parentAtom, molecule, exclude);

    expect(childAtoms.size).toBe(0);
  });

  it("returns child atoms when they are present", () => {
    const parentAtom = createAtom("C");
    const childAtom1 = createAtom("O");
    const childAtom2 = createAtom("H");

    const molecule = new Molecule("mol1", [parentAtom, childAtom1, childAtom2], [], []);
    molecule.getConnectedAtoms = vi.fn(atom => {
      if (atom === parentAtom) return [childAtom1, childAtom2];
      return [];
    });

    const exclude = new Set<Atom>();
    const childAtoms = getChildAtoms(parentAtom, molecule, exclude);

    expect(childAtoms.has(childAtom1)).toBe(true);
    expect(childAtoms.has(childAtom2)).toBe(true);
  });

  it("returns deep child atoms recursively", () => {
    const parentAtom = createAtom("C");
    const childAtom1 = createAtom("O");
    const childAtom2 = createAtom("H");
    const grandchildAtom = createAtom("N");

    const molecule = new Molecule("mol1", [parentAtom, childAtom1, childAtom2, grandchildAtom], [], []);
    molecule.getConnectedAtoms = vi.fn(atom => {
      if (atom === parentAtom) return [childAtom1, childAtom2];
      if (atom === childAtom1) return [grandchildAtom];
      return [];
    });

    const exclude = new Set<Atom>();
    const childAtoms = getChildAtoms(parentAtom, molecule, exclude);

    expect(childAtoms.has(childAtom1)).toBe(true);
    expect(childAtoms.has(childAtom2)).toBe(true);
    expect(childAtoms.has(grandchildAtom)).toBe(true);
  });

  it("excludes already visited atoms to prevent cycles", () => {
    const parentAtom = createAtom("C");
    const childAtom1 = createAtom("O");

    const molecule = new Molecule("mol1", [parentAtom, childAtom1], [], []);
    molecule.getConnectedAtoms = vi.fn(atom => {
      if (atom === parentAtom) return [childAtom1];
      if (atom === childAtom1) return [parentAtom];
      return [];
    });

    const exclude = new Set<Atom>();
    const childAtoms = getChildAtoms(parentAtom, molecule, exclude);

    expect(childAtoms.has(childAtom1)).toBe(true);
    expect(childAtoms.has(parentAtom)).toBe(false);
  });
});
