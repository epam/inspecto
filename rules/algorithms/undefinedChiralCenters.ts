import { type RulesValidationResults } from "@infrastructure";
import { BOND_TYPES, type Molecule, type Atom } from "@models";
import { type RuleAlgorithm } from "@rules/infrastructure";
import { ATOMIC_NUMBER } from "@utils/atomicNumberAndMass";
import type { RuleConfig } from "./base";
const enum STEREO {
  wedget = 1,
  either = 4,
  dashed = 6,
}
const SUBSTITUENTS_LENGTH_EQUAL_4 = 4;
const SUBSTITUENTS_LENGTH_EQUAL_3 = 3;
const SUBSTITUENTS_LENGTH_EQUAL_2 = 2;

export interface UndefinedChiralCentersAlgorithmType extends RuleConfig {
  fixingRule?: boolean;
}

export const UNDEFINED_CHIRAL_CENTERS_CODE = "undefined-chiral-centers:20";
export const undefinedChiralCentersAlgorithm: RuleAlgorithm<UndefinedChiralCentersAlgorithmType> = structure => {
  const output: RulesValidationResults[] = [];
  structure.molecules().forEach(molecule => {
    handleUndefinedChiralCenters(molecule, output);
  });
  return output;
};

function handleUndefinedChiralCenters(molecule: Molecule, output: RulesValidationResults[]): void {
  const chiralCenters = [];
  const chiralCentersAtoms: string[] = [];
  molecule.atoms.forEach(atom => {
    if (!detectAtomsPotentialChiralCenter(atom, molecule)) {
      chiralCenters.push(atom);
      chiralCentersAtoms.push(atom.label);
    }
  });

  if (chiralCenters.length > 0) {
    const path = `${molecule.id}->chiralCenters`;
    output.push({
      isFixable: false,
      errorCode: UNDEFINED_CHIRAL_CENTERS_CODE,
      message: `Inspecto detected ${chiralCenters.length} undefined chiral centers without established configurations. Atom: ${chiralCentersAtoms.join(", ")}`,
      path,
    });
  }
}

function detectAtomsPotentialChiralCenter(atom: Atom, molecule: Molecule): boolean {
  const chiralCentersAtomicNumbers = new Set([
    ATOMIC_NUMBER.C,
    ATOMIC_NUMBER.N,
    ATOMIC_NUMBER.Si,
    ATOMIC_NUMBER.P,
    ATOMIC_NUMBER.S,
    ATOMIC_NUMBER.As,
    ATOMIC_NUMBER.Se,
    ATOMIC_NUMBER.Te,
  ]);
  const validAtomLabels = new Set(["C", "N", "Si", "P", "S", "As", "Se", "Te"]);
  const validAtomLabelsValenceEqual4 = new Set(["C", "Si", "S", "Se", "Te"]);
  const validAtomLabelsValenceEqual3 = new Set(["N", "P", "As"]);
  const atomicNumber = ATOMIC_NUMBER[atom.label];
  const effectiveAtomicNumber = atomicNumber - (atom.charge ?? 0);
  const bonds = molecule.getAtomBonds(atom);
  const substituents = molecule.getConnectedAtoms(atom);
  const checkLabels = checkUniqueLabels(atom, substituents);

  if (
    (validAtomLabels.has(atom.label) || chiralCentersAtomicNumbers.has(effectiveAtomicNumber)) &&
    bonds.every(bond => bond.bondType === BOND_TYPES.SINGLE)
  ) {
    if (
      (validAtomLabelsValenceEqual4.has(atom.label) &&
        (bonds.length === SUBSTITUENTS_LENGTH_EQUAL_4 ||
          (atom.explicitValence === SUBSTITUENTS_LENGTH_EQUAL_4 && atom.charge === undefined))) ||
      (validAtomLabelsValenceEqual4.has(atom.label) && bonds.length === SUBSTITUENTS_LENGTH_EQUAL_3)
    ) {
      if (checkLabels && bonds.length === SUBSTITUENTS_LENGTH_EQUAL_4) return false;
      let stereoBondCount = 0;
      if (atom.charge < 0) {
        return true;
      }
      for (const bond of bonds) {
        if (
          bond.stereo === STEREO.either ||
          ((bond.stereo === STEREO.wedget || bond.stereo === STEREO.dashed) && bond.to === atom)
        ) {
          return false;
        }
        if (bond.stereo === STEREO.wedget || bond.stereo === STEREO.dashed) {
          stereoBondCount++;
        }
      }
      if (stereoBondCount < SUBSTITUENTS_LENGTH_EQUAL_2 && bonds.length === SUBSTITUENTS_LENGTH_EQUAL_4) return false;
      if (stereoBondCount < SUBSTITUENTS_LENGTH_EQUAL_2) return true;

      return false;
    }

    if (
      (validAtomLabelsValenceEqual3.has(atom.label) &&
        atom.explicitValence === undefined &&
        atom.charge === +1 &&
        substituents.length === SUBSTITUENTS_LENGTH_EQUAL_3) ||
      (atom.explicitValence === SUBSTITUENTS_LENGTH_EQUAL_4 && substituents.length === SUBSTITUENTS_LENGTH_EQUAL_3) ||
      (atom.explicitValence === undefined && substituents.length === SUBSTITUENTS_LENGTH_EQUAL_4)
    ) {
      if (checkLabels && bonds.length === SUBSTITUENTS_LENGTH_EQUAL_4) return false;
      if (atom.explicitValence === SUBSTITUENTS_LENGTH_EQUAL_4 && atom.charge > +1) return true;
      let stereoBondCountWedged = 0;
      let stereoBondCount = 0;
      if (atom.charge < 0) {
        return true;
      }
      for (const bond of bonds) {
        if (
          bond.stereo === STEREO.either ||
          ((bond.stereo === STEREO.wedget || bond.stereo === STEREO.dashed) && bond.to === atom)
        ) {
          return false;
        }
        if (bond.stereo === STEREO.wedget || bond.stereo === STEREO.dashed) {
          stereoBondCount++;
          if (bond.stereo === STEREO.wedget) {
            stereoBondCountWedged++;
          }
        }
      }

      if (stereoBondCount < SUBSTITUENTS_LENGTH_EQUAL_2) return true;
      if (stereoBondCountWedged > SUBSTITUENTS_LENGTH_EQUAL_3) return false;
      return false;
    }
  }
  return true;
}

function checkUniqueLabels(atom: Atom, substituents: Atom[]): boolean {
  const labelSet = new Set<string>();
  for (const substituent of substituents) {
    if (labelSet.has(substituent.label)) {
      return false;
    }
    labelSet.add(substituent.label);
  }
  return true;
}
