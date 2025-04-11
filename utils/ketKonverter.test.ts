import { describe, it, expect } from "vitest";
import { rawKetAtomToAtom, atomToRawKetAtom } from "../utils/ketKonverter";
import { Atom } from "@models";
import type { RawKetAtom } from "@infrastructure";
import E1F from "../tests/mocks/queryProperties/E1F.ket?raw";

const raw = JSON.parse(E1F);

const rawKetAtoms: RawKetAtom[] = raw.mol0.atoms.slice(3, 5);

describe("Function rawKetAtomToAtom", () => {
  it("converts raw KET atom with implicitHCount property correctly", () => {
    const rawAtom = rawKetAtoms[0];
    const atom = rawKetAtomToAtom(rawAtom);

    expect(atom).toBeInstanceOf(Atom);
    expect(atom.label).toBe(rawAtom.label);
    expect(atom.x).toBe(rawAtom.location[0]);
    expect(atom.y).toBe(rawAtom.location[1]);
    expect(atom.z).toBe(rawAtom.location[2]);

    if ("implicitHCount" in rawAtom) {
      expect(atom.queryProperties?.implicitHCount).toBe(rawAtom.implicitHCount);
    }
  });

  it("converts raw KET atom with queryProperties correctly", () => {
    const rawAtom = rawKetAtoms[1];
    const atom = rawKetAtomToAtom(rawAtom);

    expect(atom).toBeInstanceOf(Atom);
    expect(atom.label).toBe(rawAtom.label);

    expect(atom.queryProperties?.aromaticity).toBe(rawAtom.queryProperties?.aromaticity);
  });
});

describe("Function atomToRawKetAtom", () => {
  it("converts Atom objects back into raw KET atoms correctly", () => {
    rawKetAtoms.forEach(rawAtom => {
      const atom = rawKetAtomToAtom(rawAtom);
      const rawAtomConvertedBack = atomToRawKetAtom(atom);

      expect(rawAtomConvertedBack.label).toBe(atom.label);
      expect(rawAtomConvertedBack.location[0]).toBe(atom.x);
      expect(rawAtomConvertedBack.location[1]).toBe(atom.y);
      expect(rawAtomConvertedBack.location[2]).toBe(atom.z);

      expect(rawAtomConvertedBack.queryProperties).toEqual(atom.queryProperties);
    });
  });
});
