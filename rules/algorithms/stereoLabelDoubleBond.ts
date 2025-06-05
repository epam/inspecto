import { type RulesValidationResults } from "@infrastructure";
import { BOND_TYPES, type Molecule, type Atom, type Bond } from "@models";
import { type RuleAlgorithm } from "@rules/infrastructure";
import { shouldFix } from "@utils";
import { createGraph, findAllCyclesInGraph } from "@utils/graph";
import { ATOMIC_NUMBER } from "@utils/atomicNumberAndMass";
import { VALENCE_RULES } from "@utils/valence";
import { compareSubstituentPair, findSubstituents } from "@utils/substituents";
import type { RuleConfig } from "./base";

export const STEREO_LABEL_NON_DOUBLE_BOND = "stereoLabelDoubleBond:9.1";
export const STEREO_LABEL_INVALID_BOND_ATOMS = "stereoLabelDoubleBond:9.2-3";
export const STEREO_LABEL_EQUAL_PRIORITIES = "stereoLabelDoubleBond:9.6";
export const STEREO_LABEL_MISMATCH = "stereoLabelDoubleBond:9.7-8";
export const STEREO_LABEL_OMITTED_REQUIRED = "stereoLabelDoubleBond:9.";

export interface StereoLabelDoubleRuleConfig extends RuleConfig {}

export const stereoLabelDoubleBondAlgorithm: RuleAlgorithm<StereoLabelDoubleRuleConfig> = (structure, config) => {
  const output: RulesValidationResults[] = [];
  structure.molecules().forEach(molecule => {
    verifyStereoLabelOnNonDoubleBondAtom(molecule, output, config);
    checkAndCorrectDoubleBondStereoLabels(molecule, output, config);
  });
  return output;
};

function calculateValence(atom: Atom, molecule: Molecule): number {
  let totalValence = 0;
  const relevantBonds = molecule.bonds.filter(bond => bond.from === atom || bond.to === atom);
  relevantBonds.forEach(bond => {
    switch (bond.bondType) {
      case BOND_TYPES.SINGLE:
        totalValence += 1;
        break;
      case BOND_TYPES.DOUBLE:
        totalValence += 2;
        break;
      case BOND_TYPES.TRIPLE:
        totalValence += 3;
        break;
      default:
        console.error(`[Rule] Stereo Label Double Bond: We didn't expect this bond type: ${bond.bondType}`);
    }
  });
  return totalValence;
}

export function validateAndAdjustValence(atom: Atom, molecule: Molecule): number {
  const currentValence = calculateValence(atom, molecule);
  const validValences = VALENCE_RULES[atom.label];
  let additionalHydrogens = 0;
  if (validValences === undefined) {
    console.warn(`No valence rules defined for atom type ${atom.label}. Cannot validate or adjust valence.`);
    return additionalHydrogens;
  }
  if (validValences.includes(currentValence)) {
    return additionalHydrogens;
  }
  const nearestValidValence = validValences.find(valence => valence > currentValence);
  if (nearestValidValence == null) {
    console.error(`No higher valid valence available for atom ${atom.label} with current valence ${currentValence}.`);
    return additionalHydrogens;
  }
  if (nearestValidValence === 0) {
    console.error(`Unexpected '0' valence value for atom ${atom.label}.`);
    return additionalHydrogens;
  }
  additionalHydrogens = nearestValidValence - currentValence;
  return additionalHydrogens;
}

export function doubleBondAtoms(atomA: Atom, atomB: Atom, molecule: Molecule): boolean {
  const graph = createGraph(molecule);
  const cycles = findAllCyclesInGraph(graph);
  const bondsAtomA = molecule.getAtomBonds(atomA);
  const bondsAtomB = molecule.getAtomBonds(atomB);
  const explicitValence1 = atomA.explicitValence;
  const explicitValence2 = atomB.explicitValence;
  const doubleBonds = molecule.filterBondsByType(BOND_TYPES.DOUBLE);
  const cycleWithBothAtoms = cycles.some(cycle => cycle.includes(atomA) && cycle.includes(atomB));
  if (cycleWithBothAtoms) {
    return false;
  }
  const doubleBond = doubleBonds.find(
    bond => (bond.from === atomA && bond.to === atomB) || (bond.from === atomB && bond.to === atomA),
  );
  const extraHatomA = validateAndAdjustValence(atomA, molecule);
  const extraHatomB = validateAndAdjustValence(atomB, molecule);
  if (doubleBond == null) {
    return false;
  }
  if (doubleBond.stereo !== undefined) {
    return false;
  }

  let singleBondsCountAtomA = bondsAtomA.filter(bond => bond.bondType === BOND_TYPES.SINGLE).length;
  const doubleBondsCountAtomA = bondsAtomA.filter(bond => bond.bondType === BOND_TYPES.DOUBLE).length;
  let singleBondsCountAtomB = bondsAtomB.filter(bond => bond.bondType === BOND_TYPES.SINGLE).length;
  const doubleBondsCountAtomB = bondsAtomB.filter(bond => bond.bondType === BOND_TYPES.DOUBLE).length;

  if (
    (explicitValence1 !== undefined && explicitValence1 === 4) ||
    (explicitValence2 !== undefined && explicitValence2 === 4)
  ) {
    return (
      bondsAtomA.length === 3 &&
      singleBondsCountAtomA === 2 &&
      doubleBondsCountAtomA === 1 &&
      bondsAtomB.length === 3 &&
      singleBondsCountAtomB === 2 &&
      doubleBondsCountAtomB === 1
    );
  }

  if (
    (explicitValence1 !== undefined && explicitValence1 > 4) ||
    (explicitValence2 !== undefined && explicitValence2 > 4)
  ) {
    return false;
  }

  if (extraHatomA !== 0) {
    singleBondsCountAtomA += 1;
    bondsAtomA.length += 1;
  }

  if (extraHatomB !== 0) {
    singleBondsCountAtomB += 1;
    bondsAtomB.length += 1;
  }

  if (
    !(
      bondsAtomA.length === 3 &&
      singleBondsCountAtomA === 2 &&
      doubleBondsCountAtomA === 1 &&
      bondsAtomB.length === 3 &&
      singleBondsCountAtomB === 2 &&
      doubleBondsCountAtomB === 1
    )
  ) {
    return false;
  }

  return !cycleWithBothAtoms;
}

export function compareTotalAtomicNumbers(
  children1: Atom[],
  grandChildren1: Atom[],
  children2: Atom[],
  grandChildren2: Atom[],
): number | undefined {
  function sumOfAtomicNumbers(atoms: Atom[]): number {
    return atoms.reduce((sum, atom) => {
      const atomicNumber = ATOMIC_NUMBER[atom.label];
      return sum + atomicNumber;
    }, 0);
  }
  const total1 = sumOfAtomicNumbers([...children1, ...grandChildren1]);
  const total2 = sumOfAtomicNumbers([...children2, ...grandChildren2]);

  if (total1 > total2) {
    return 1;
  } else if (total1 < total2) {
    return 2;
  }

  return undefined;
}

export function calculate2DPseudoscalarProduct(vec1: { x: number; y: number }, vec2: { x: number; y: number }): number {
  return vec1.x * vec2.y - vec1.y * vec2.x;
}

function determineCalculatedLabel(crossProductA: number, crossProductB: number): string | null {
  if (crossProductA * crossProductB < 0) {
    return "E";
  } else if (crossProductA * crossProductB > 0) {
    return "Z";
  } else {
    return null;
  }
}

function verifyStereoLabelOnNonDoubleBondAtom(
  molecule: Molecule,
  output: RulesValidationResults[],
  config: StereoLabelDoubleRuleConfig,
): void {
  molecule.bonds.forEach(bond => {
    if (bond.bondType !== BOND_TYPES.DOUBLE && bond.cip !== undefined && ["E", "Z"].includes(bond.cip)) {
      const path = `${molecule.id}->bonds->${molecule.getBondIndex(bond)}`;
      handleStereoLabelOnNonDoubleBondAtom(STEREO_LABEL_NON_DOUBLE_BOND, bond, path, config, output);
    }
  });
}

function checkAndCorrectDoubleBondStereoLabels(
  molecule: Molecule,
  output: RulesValidationResults[],
  config: StereoLabelDoubleRuleConfig,
): void {
  molecule.filterBondsByType(BOND_TYPES.DOUBLE).forEach(bond => {
    const path = `${molecule.id}->bonds->${molecule.getBondIndex(bond)}`;
    if (!doubleBondAtoms(bond.from, bond.to, molecule)) {
      if (bond.cip !== undefined) {
        handleStereoLabelOnNonDoubleBondAtom(STEREO_LABEL_INVALID_BOND_ATOMS, bond, path, config, output);
      }
    } else {
      validateAndCorrectStereoLabel(path, bond, molecule, config, output);
    }
  });
}

function validateAndCorrectStereoLabel(
  path: string,
  bond: Bond,
  molecule: Molecule,
  config: StereoLabelDoubleRuleConfig,
  output: RulesValidationResults[],
): void {
  const label: string | undefined = bond.cip;
  const calculatedLabel: string | undefined | null = analyzeAndDetermineStereoLabel(molecule, bond);
  if (label !== undefined && (calculatedLabel === undefined || calculatedLabel === null)) {
    handleInvalidLabel(STEREO_LABEL_EQUAL_PRIORITIES, bond, label, `${path}->invalidLabel`, config, output);
  }
  if (label !== undefined && label !== calculatedLabel) {
    handleLabelMismatch(STEREO_LABEL_MISMATCH, bond, label, `${calculatedLabel}`, `${path}->mismatch`, config, output);
  } else if (label === undefined && calculatedLabel !== undefined && calculatedLabel !== null) {
    handleMissingLabel(STEREO_LABEL_OMITTED_REQUIRED, bond, calculatedLabel, `${path}->missing`, config, output);
  }
}

function analyzeAndDetermineStereoLabel(molecule: Molecule, bond: Bond): string | undefined | null {
  const atomA = bond.from;
  const atomB = bond.to;
  const mainStereoLabel = checkCorrectStereoLabel(molecule, bond);
  const initialStereoLabel = determineMainStereoLabel(molecule, atomA, atomB);

  if (initialStereoLabel === null || initialStereoLabel === undefined) {
    return mainStereoLabel;
  }
  return initialStereoLabel;
}

function handleStereoLabelOnNonDoubleBondAtom(
  errorCode: string,
  bond: Bond,
  path: string,
  config: StereoLabelDoubleRuleConfig,
  output: RulesValidationResults[],
): void {
  if (shouldFix(config, errorCode, path)) {
    bond.cip = undefined;
    console.info(`Removed CIP stereo-label from contextually incorrect bond at ${path}`);
  } else {
    output.push({
      isFixable: true,
      errorCode: `${errorCode}`,
      message: `Detected incorrect (E)/(Z) stereo-label on ${path}, bond between ${bond.from.label} - ${bond.to.label}`,
      path,
    });
  }
}

function handleInvalidLabel(
  errorCode: string,
  bond: Bond,
  label: string | undefined,
  path: string,
  config: StereoLabelDoubleRuleConfig,
  output: RulesValidationResults[],
): void {
  if (shouldFix(config, errorCode, path)) {
    bond.cip = undefined;
    console.info(`Label mismatch: expected no label for bond at ${path}, but found one ${label}`);
  }
  output.push({
    isFixable: true,
    errorCode: `${errorCode}`,
    message: `Label mismatch: expected no label for bond at ${path}, but found one ${label} `,
    path,
  });
}

function handleLabelMismatch(
  errorCode: string,
  bond: Bond,
  label: string,
  calculatedLabel: string,
  path: string,
  config: StereoLabelDoubleRuleConfig,
  output: RulesValidationResults[],
): void {
  const atomNames = `${bond.from.label}-${bond.to.label}`;
  if (shouldFix(config, errorCode, path)) {
    bond.cip = calculatedLabel;
    console.info(`Label mismatch: ${label} should be ${calculatedLabel} for bond between ${atomNames}`);
  } else {
    output.push({
      isFixable: true,
      errorCode: `${errorCode}`,
      message: `Label mismatch: ${label} should be ${calculatedLabel} for bond between ${atomNames}`,
      path,
    });
  }
}

function handleMissingLabel(
  errorCode: string,
  bond: Bond,
  calculatedLabel: string,
  path: string,
  config: StereoLabelDoubleRuleConfig,
  output: RulesValidationResults[],
): void {
  const atomNames = `${bond.from.label}-${bond.to.label}`;
  if (shouldFix(config, errorCode, path)) {
    bond.cip = calculatedLabel;
    console.info(`Label should be ${calculatedLabel} for bond between ${atomNames}`);
  } else {
    output.push({
      isFixable: true,
      errorCode: `${errorCode}`,
      message: `Label should be ${calculatedLabel} for bond between ${atomNames}`,
      path,
    });
  }
}
function checkCorrectStereoLabel(molecule: Molecule, bond: Bond): string | undefined | null {
  const atomA = bond.from;
  const atomB = bond.to;
  const substituents1 = findSubstituents(molecule, atomA);
  const substituents2 = findSubstituents(molecule, atomB);

  if (substituents1.length !== 2) {
    throw new Error("inccorrect substitute count for 1 case");
  }

  if (substituents2.length !== 2) {
    throw new Error("inccorrect substitute count for 2 case");
  }

  const highPrioritySubstituentA = compareSubstituentPair(molecule, atomA);
  const highPrioritySubstituentB = compareSubstituentPair(molecule, atomB);
  if (highPrioritySubstituentA === null || highPrioritySubstituentB === null) {
    return undefined;
  }
  if (highPrioritySubstituentA !== null && highPrioritySubstituentB !== null) {
    const vectorAB = {
      x: atomB.x - atomA.x,
      y: atomB.y - atomA.y,
    };

    let vectorASubAtomA = { x: 0, y: 0 };
    if (highPrioritySubstituentA !== undefined) {
      vectorASubAtomA = {
        x: highPrioritySubstituentA.x - atomA.x,
        y: highPrioritySubstituentA.y - atomA.y,
      };
    }

    let vectorBSubAtomB = { x: 0, y: 0 };
    if (highPrioritySubstituentB !== undefined) {
      vectorBSubAtomB = {
        x: highPrioritySubstituentB.x - atomB.x,
        y: highPrioritySubstituentB.y - atomB.y,
      };
    }

    const crossProductA = calculate2DPseudoscalarProduct(vectorAB, vectorASubAtomA);
    const crossProductB = calculate2DPseudoscalarProduct(vectorAB, vectorBSubAtomB);
    const calculatedLabel = determineCalculatedLabel(crossProductA, crossProductB);

    return calculatedLabel ?? undefined;
  }
}

export function determineMainStereoLabel(molecule: Molecule, atomA: Atom, atomB: Atom): string | null | undefined {
  const substituents1 = findSubstituents(molecule, atomA);
  const substituents2 = findSubstituents(molecule, atomB);
  const labelSubstituents1 = checkLabelsOnSubstituentBonds(molecule, substituents1);
  const labelSubstituents2 = checkLabelsOnSubstituentBonds(molecule, substituents2);
  const highPrioritySubstituentA = substituents1.find(sub => labelSubstituents1[substituents1.indexOf(sub)] === "Z");
  const highPrioritySubstituentB = substituents2.find(sub => labelSubstituents2[substituents2.indexOf(sub)] === "Z");

  if (
    highPrioritySubstituentA?.x !== undefined &&
    highPrioritySubstituentA?.y !== undefined &&
    highPrioritySubstituentB?.x !== undefined &&
    highPrioritySubstituentB?.y !== undefined
  ) {
    const vectorAB = {
      x: atomB.x - atomA.x,
      y: atomB.y - atomA.y,
    };

    const vectorASubAtomA = {
      x: highPrioritySubstituentA.x - atomA.x,
      y: highPrioritySubstituentA.y - atomA.y,
    };

    const vectorBSubAtomB = {
      x: highPrioritySubstituentB.x - atomB.x,
      y: highPrioritySubstituentB.y - atomB.y,
    };

    const crossProductA = calculate2DPseudoscalarProduct(vectorAB, vectorASubAtomA);
    const crossProductB = calculate2DPseudoscalarProduct(vectorAB, vectorBSubAtomB);

    const calculatedLabel = determineCalculatedLabel(crossProductA, crossProductB);

    if (calculatedLabel !== null) return calculatedLabel;
  }

  const resultFromSubstituents1 = processLabels(labelSubstituents1);
  const resultFromSubstituents2 = processLabels(labelSubstituents2);

  if (resultFromSubstituents1 === "Z" || resultFromSubstituents2 === "Z") {
    return "Z";
  }

  if (resultFromSubstituents1 === undefined || resultFromSubstituents2 === undefined) {
    return undefined;
  }
  return null;
}

function processLabels(labels: string[]): string | undefined | null {
  if (labels.length === 0) {
    return null;
  } else if (labels.length === 1) {
    return null;
  } else if (labels.length === 2) {
    if (labels.includes("Z")) {
      return "Z";
    }
    if (!labels.includes("Z") && labels.includes("E")) {
      return undefined;
    }
  }
  return undefined;
}

function checkLabelsOnSubstituentBonds(molecule: Molecule, substituents: Atom[]): string[] {
  const labels: string[] = [];
  substituents.forEach(substituent => {
    const bonds = molecule.getAtomBonds(substituent);
    bonds.forEach(bond => {
      const label = bond.cip;
      if (label != null) {
        labels.push(label);
      }
    });
  });

  return labels;
}
