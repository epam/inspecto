import type { RawKetAtom } from "@infrastructure";
import { Atom } from "@models";
import { Location } from "../inspecto/models/Location";
import type { QueryProperties } from "../inspecto/models/Atom";

const dynamicProperties = [
  "ringBondCount",
  "hCount",
  "substitutionCount",
  "unsaturatedAtom",
  "implicitHCount",
  "aromaticity",
  "ringMembership",
  "ringSize",
  "connectivity",
  "chirality",
];

export function rawKetAtomToAtom(rawKetAtom: RawKetAtom): Atom {
  let queryProperties: QueryProperties = {};

  if (rawKetAtom.queryProperties !== null) {
    queryProperties = { ...rawKetAtom.queryProperties };
  }

  dynamicProperties.forEach(prop => {
    if (prop in rawKetAtom && (rawKetAtom as any)[prop] !== undefined) {
      queryProperties[prop as keyof QueryProperties] = (rawKetAtom as any)[prop];
    }
  });

  const location = new Location(...rawKetAtom.location);
  const atom = new Atom(
    rawKetAtom.label,
    location,
    rawKetAtom.charge,
    rawKetAtom.stereoLabel,
    rawKetAtom.isotope,
    queryProperties,
    rawKetAtom.cip,
    rawKetAtom.explicitValence,
    rawKetAtom.mapping,
    rawKetAtom.implicitHCount,
    rawKetAtom.radical
  );

  return atom;
}

export function atomToRawKetAtom(atom: Atom): RawKetAtom {
  const rawKetAtom: RawKetAtom = {
    label: atom.label,
    location: atom.vector,
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    ...(atom.charge && { charge: atom.charge }),
    stereoLabel: atom.stereolabel,
    isotope: atom.isotope,
    cip: atom.cip,
    explicitValence: atom.explicitValence,
    mapping: atom.mapping,
    implicitHCount: atom.implicitHCount,
    radical: atom.radical,
    queryProperties: { ...atom.queryProperties },
  };

  return rawKetAtom;
}
