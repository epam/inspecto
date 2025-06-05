import { type RulesValidationResults } from "@infrastructure";
import { type Molecule, BOND_TYPES, type Bond, type Atom, type Structure } from "@models";
import { BaseRule, type RuleConfig } from "./base";
import { getAngleBetweenAtoms, createGraph, findAllCyclesInGraph, shouldFix } from "@utils";
import { findSubstituents, compareSubstituentPair } from "@utils/substituents";

export interface StraightDoubleBondRuleConfig extends RuleConfig {}
export const STRAIGHT_DOUBLE_BOND_CODE = "straight-double-bond:18";
const MIN_ANGLE = 355;
const MAX_ANGLE = 365;
const VALID_ELEMENTS = ["C", "Si"];
const BOND_COUNT_ONE = 1;
const BOND_COUNT_TWO = 2;
const BOND_COUNT_FOUR = 4;
const enum STEREO {
  wedget = 1,
  crossed = 3,
  either = 4,
  dashed = 6,
}

export class StraightDoubleBondRule extends BaseRule<StraightDoubleBondRuleConfig> {
  static docs = {
    name: "Straight Double Bond",
    description: "Check for straight double bonds in the structure.",
    url: "https://kb.epam.com/display/EPMLSTRCHC/18.+Straight+Double+Bond",
  };

  verify(structure: Structure): RulesValidationResults[] {
    const output: RulesValidationResults[] = [];
    const molecules = structure.molecules();

    molecules.forEach((molecule: Molecule) => {
      molecule.bonds.forEach((bond: Bond) => {
        if (bond.bondType === BOND_TYPES.DOUBLE) {
          const hasStraightDoubleBond = this.validateBondTypeAndAnglesWithNeighborAtoms(molecule, bond);
          const path = `${molecule.id}->bond->${molecule.getBondIndex(bond)}`;
          if (hasStraightDoubleBond) {
            if (shouldFix(this.config, STRAIGHT_DOUBLE_BOND_CODE, path)) {
              bond.stereo = STEREO.crossed;
            } else {
              output.push({
                isFixable: true,
                errorCode: STRAIGHT_DOUBLE_BOND_CODE,
                message: "Inspecto has detected bonds in the canvas that need to be replaced with crossed ones",
                path,
              });
            }
          }
        }
      });
    });

    return output;
  }

  private validateBondTypeAndAnglesWithNeighborAtoms(molecule: Molecule, bond: Bond): boolean {
    const atomA = bond.from;
    const atomB = bond.to;

    if (bond.stereo === STEREO.crossed) return false;
    if (bond.bondType !== BOND_TYPES.DOUBLE) return false;
    if (atomA.charge < 0 || atomB.charge < 0) return false;

    const isValidValenceAtomA = atomA.explicitValence !== undefined && atomA.explicitValence > BOND_COUNT_FOUR;
    const isValidValenceAtomB = atomB.explicitValence !== undefined && atomB.explicitValence > BOND_COUNT_FOUR;
    if (isValidValenceAtomA || isValidValenceAtomB) return false;

    if (!VALID_ELEMENTS.includes(atomA.label) || !VALID_ELEMENTS.includes(atomB.label)) return false;

    const graph = createGraph(molecule);
    const cycles = findAllCyclesInGraph(graph);
    if (cycles.some(cycle => cycle.includes(atomA) && cycle.includes(atomB))) return false;

    if (!this.isValidBondCountAndTypes(molecule, atomA) && !this.isValidBondCountAndTypes(molecule, atomB)) {
      return false;
    }

    const neighborsOfatomA = molecule.getConnectedAtoms(atomA).filter(a => a !== atomB);
    const neighborsOfatomB = molecule.getConnectedAtoms(atomB).filter(a => a !== atomA);
    if (neighborsOfatomA.length === undefined || neighborsOfatomB.length === undefined) return false;

    const anglesValidFromatomAToatomB = this.checkAnglesForBondPair(molecule, atomA, atomB);
    const anglesValidFromatomBToatomA = this.checkAnglesForBondPair(molecule, atomB, atomA);
    if (!anglesValidFromatomAToatomB && !anglesValidFromatomBToatomA) return false;
    if (!this.checkCIPRule(molecule, atomA, atomB)) return false;

    return true;
  }

  private checkCIPRule(molecule: Molecule, atomA: Atom, atomB: Atom): boolean {
    const substituentsOfAtomA = findSubstituents(molecule, atomA);
    const substituentsOfAtomB = findSubstituents(molecule, atomB);
    const inCorrectSubstituents =
      substituentsOfAtomA.length !== BOND_COUNT_TWO || substituentsOfAtomB.length !== BOND_COUNT_TWO;
    if (inCorrectSubstituents) return false;

    const substituentLabelsOfAtomA = this.compareSubstituentLabels(molecule, substituentsOfAtomA);
    const substituentLabelsOfAtomB = this.compareSubstituentLabels(molecule, substituentsOfAtomB);
    if (!substituentLabelsOfAtomA || !substituentLabelsOfAtomB) {
      const highPrioritySubstituentOfAtomA = compareSubstituentPair(molecule, atomA);
      const highPrioritySubstituentOfAtomB = compareSubstituentPair(molecule, atomB);
      if (highPrioritySubstituentOfAtomA === null || highPrioritySubstituentOfAtomB === null) return false;
    }

    return true;
  }

  private compareSubstituentLabels(molecule: Molecule, substituents: Atom[]): boolean {
    if (substituents.length < BOND_COUNT_TWO) return false;

    const getAllLabels = (inputSubstituents: Atom[]): string[] => {
      return inputSubstituents.flatMap(substituent =>
        molecule
          .getAtomBonds(substituent)
          .map(bond => bond.cip)
          .filter((cip): cip is string => cip !== null),
      );
    };

    const combinedLabels = getAllLabels([substituents[0], substituents[1]]);
    const uniqueLabels = new Set(combinedLabels);
    const uniqueLabelsSize = uniqueLabels.size;

    if (uniqueLabelsSize > 0) return true;
    return false;
  }

  private checkAnglesForBondPair(molecule: Molecule, atomA: Atom, atomB: Atom): boolean {
    const neighbors = molecule.getConnectedAtoms(atomA).filter(a => a !== atomB);
    return neighbors.every(neighbor => {
      const angle = getAngleBetweenAtoms(neighbor, atomA, atomB);
      const rightAngle = angle > MIN_ANGLE && angle < MAX_ANGLE;
      if (!rightAngle) return false;
      return true;
    });
  }

  private isValidBondCountAndTypes(molecule: Molecule, atom: Atom): boolean {
    const bonds = molecule.getAtomBonds(atom);
    let doubleBondCount = 0;
    let singleBondsWithValidStereo = 0;

    if (atom.charge < 0) return false;
    bonds.forEach(bond => {
      if (bond.bondType === BOND_TYPES.DOUBLE) {
        doubleBondCount++;
      } else if (bond.bondType === BOND_TYPES.SINGLE) {
        const hasValidStereo =
          bond.stereo === undefined ||
          bond.stereo === STEREO.wedget ||
          bond.stereo === STEREO.either ||
          bond.stereo === STEREO.dashed;
        if (hasValidStereo) {
          singleBondsWithValidStereo++;
        }
      }
    });

    const validSingleBondsConfiguration =
      (singleBondsWithValidStereo === BOND_COUNT_ONE &&
        atom.explicitValence === BOND_COUNT_FOUR &&
        atom.charge === undefined) ||
      (singleBondsWithValidStereo === BOND_COUNT_ONE && atom.explicitValence === undefined) ||
      singleBondsWithValidStereo === BOND_COUNT_TWO;

    return doubleBondCount === BOND_COUNT_ONE && validSingleBondsConfiguration;
  }
}
