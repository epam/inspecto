import { describe, it, expect } from "vitest";
import { createAtomWithLocation } from "./createAtomWithLocation";
import { Atom } from "@models";

describe("createAtomWithLocation", () => {
  it("should create an Atom with the specified label and location", () => {
    const label = "C";
    const x = 1;
    const y = 2;
    const z = 3;
    const atom = createAtomWithLocation(label, x, y, z);

    expect(atom).toBeInstanceOf(Atom);
    expect(atom.label).toBe(label);
    expect(atom.x).toBe(x);
    expect(atom.y).toBe(y);
    expect(atom.z).toBe(z);
  });
});
