import { type RulesValidationResults } from "@infrastructure";
import { BOND_TYPES, type Molecule, type Atom, type Structure, type Bond } from "@models";
import { BaseRule, type RuleConfig } from "./base";
import { ATOMIC_NUMBER, ATOMIC_MASS } from "@utils/atomicNumberAndMass";
import { shouldFix } from "@utils";
import { findChild } from "../../utils/substituents";

export const STEREO_LABEL_TETRAHEDRAL_CENTER_CODE = "stereoLabelTetrahedralCenter:12";
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
const BOND_COUNT_EQUAL_THREE = 3;
const BOND_COUNT_EQUAL_FOUR = 4;

const VALID_CIP_LABELS = ["R", "S", "r", "s"] as const;
type CIPLabel = (typeof VALID_CIP_LABELS)[number];

const enum STEREO {
  wedget = 1,
  either = 4,
  dashed = 6,
}

export interface StereoLabelTetrahedralCenterRuleConfig extends RuleConfig {}

export class StereoLabelTetrahedralCenterRule extends BaseRule<StereoLabelTetrahedralCenterRuleConfig> {
  static docs = {
    name: "Stereo Label Tetrahedral Center",
    description: "Validates and fixes stereo labels for tetrahedral centers.",
    url: "https://kb.epam.com/pages/viewpage.action?pageId=2341020410",
  };

  verify(structure: Structure): RulesValidationResults[] {
    const output: RulesValidationResults[] = [];
    const molecules = structure.molecules();

    molecules.forEach((molecule: Molecule) => {
      molecule.atoms.forEach(atom => {
        const path = `${molecule.id}->atoms->${molecule.getAtomIndex(atom)}`;

        if (
          atom.cip !== undefined &&
          VALID_CIP_LABELS.includes(atom.cip as CIPLabel) &&
          !this.detectPotentialChiralCenter(atom, molecule)
        ) {
          this.handleIncorrectStereoLabel(atom, path, output);
        } else if (this.detectPotentialChiralCenter(atom, molecule)) {
          this.analyzeAndFixCipLabel(atom, molecule, path, output);
        }
      });
    });
    return output;
  }

  private handleIncorrectStereoLabel(atom: Atom, path: string, output: RulesValidationResults[]): void {
    if (shouldFix(this.config, STEREO_LABEL_TETRAHEDRAL_CENTER_CODE, path)) {
      atom.cip = undefined;
      console.info(`Removed invalid CIP stereo-label from atom at ${path}`);
    } else {
      output.push({
        isFixable: true,
        errorCode: STEREO_LABEL_TETRAHEDRAL_CENTER_CODE,
        message: `Invalid CIP label '${atom.cip}' detected at ${path}`,
        path,
      });
    }
  }

  private detectPotentialChiralCenter(atom: Atom, molecule: Molecule): boolean {
    const atomicNumber = ATOMIC_NUMBER[atom.label];
    const effectiveAtomicNumber = atomicNumber - (atom.charge ?? 0);
    const bonds = molecule.getAtomBonds(atom);
    const uniqueSubstituents = new Set(bonds.map(bond => (bond.from === atom ? bond.to : bond.from)));
    const hasHydrogen = Array.from(uniqueSubstituents).some(substituent => substituent.label === "H");

    if (uniqueSubstituents.size === BOND_COUNT_EQUAL_THREE && hasHydrogen) return false;
    else if (bonds.some(bond => bond.bondType !== BOND_TYPES.SINGLE)) return false;
    else if (bonds.some(bond => bond.stereo === STEREO.either && bond.from === atom)) return false;
    else if (bonds.every(bond => bond.stereo !== STEREO.wedget && bond.stereo !== STEREO.dashed)) return false;
    else if (!chiralCentersAtomicNumbers.has(effectiveAtomicNumber)) return false;
    else if (bonds.length > BOND_COUNT_EQUAL_FOUR || bonds.length < BOND_COUNT_EQUAL_THREE) return false;
    else return true;
  }

  private analyzeAndFixCipLabel(atom: Atom, molecule: Molecule, path: string, output: RulesValidationResults[]): void {
    const substituents = this.findSubstituentsForChiralCenter(molecule, atom);

    substituents.sort((a, b) => this.compareSubstituents(a, b, molecule, atom));

    if (this.areTwoTopSubstituentsSame(substituents)) {
      atom.cip = "R";
      return;
    }
    const firstSubstituent = substituents[0];
    const secondSubstituent = substituents[1];
    const thirdSubstituent = substituents[2];
    let direction = this.determineDirectionFromRelativeCoordinates(
      atom,
      firstSubstituent,
      secondSubstituent,
      thirdSubstituent
    );

    direction = this.adjustDirectionBasedOnBonds(atom, molecule, substituents, direction);
    const cipDirection = this.mapDirectionToCIP(direction);
    const cipLabel = this.calculateFinalCipLabel(cipDirection, substituents);

    if (atom.cip !== cipLabel) {
      if (shouldFix(this.config, STEREO_LABEL_TETRAHEDRAL_CENTER_CODE, path)) {
        atom.cip = cipLabel;
        console.info(`Updated CIP stereo-label to ${cipLabel} on atom at ${path}`);
      } else {
        output.push({
          isFixable: true,
          errorCode: STEREO_LABEL_TETRAHEDRAL_CENTER_CODE,
          message: `Incorrect CIP stereo-label on atom at ${path}: expected ${cipLabel}, found ${atom.cip ?? "none"}`,
          path,
        });
      }
    }
  }

  private findSubstituentsForChiralCenter(molecule: Molecule, atom: Atom): Atom[] {
    const singleBonds = molecule.getAtomBonds(atom);
    const uniqueSubstituents = new Set(singleBonds.map(bond => (bond.from === atom ? bond.to : bond.from)));
    return Array.from(uniqueSubstituents).filter(substituent => substituent !== atom);
  }

  private compareSubstituents(atomA: Atom, atomB: Atom, molecule: Molecule, excludeAtom: Atom): number {
    const isotopeOfAtomA = atomA.isotope;
    const isotopeOfAtomB = atomB.isotope;

    if (isotopeOfAtomA !== undefined && isotopeOfAtomB !== undefined) {
      if (isotopeOfAtomA !== isotopeOfAtomB) return isotopeOfAtomB - isotopeOfAtomA;
    } else if (isotopeOfAtomA !== undefined) {
      const atomicMassOfAtomB = ATOMIC_MASS[atomB.label];
      return isotopeOfAtomA > atomicMassOfAtomB ? -1 : 1;
    } else if (isotopeOfAtomB !== undefined) {
      const atomicMassOfAtomA = ATOMIC_MASS[atomA.label];
      return isotopeOfAtomB > atomicMassOfAtomA ? 1 : -1;
    }

    const atomicNumberOfAtomA = ATOMIC_NUMBER[atomA.label];
    const atomicNumberOfAtomB = ATOMIC_NUMBER[atomB.label];
    if (atomicNumberOfAtomA !== atomicNumberOfAtomB) {
      return atomicNumberOfAtomB - atomicNumberOfAtomA;
    }

    const childOfAtomA = findChild(atomA, molecule, excludeAtom);
    const childOfAtomB = findChild(atomB, molecule, excludeAtom);

    if (childOfAtomA.length === 0 && childOfAtomB.length === 0) return 0;
    if (childOfAtomA.length === 0) return 1;
    if (childOfAtomB.length === 0) return -1;

    childOfAtomA.sort((atom1, atom2) => ATOMIC_NUMBER[atom2.label] - ATOMIC_NUMBER[atom1.label]);
    childOfAtomB.sort((atom1, atom2) => ATOMIC_NUMBER[atom2.label] - ATOMIC_NUMBER[atom1.label]);

    const topChildOfAtomA = childOfAtomA[0];
    const topChildOfAtomB = childOfAtomB[0];
    const bondsOfAtomA = molecule.getAtomBonds(atomA);
    const bondsOfAtomB = molecule.getAtomBonds(atomB);
    const bondA = bondsOfAtomA.find(
      bond =>
        (bond.from === atomA && bond.to === topChildOfAtomA) || (bond.from === topChildOfAtomA && bond.to === atomA)
    );
    const bondB = bondsOfAtomB.find(
      bond =>
        (bond.from === atomB && bond.to === topChildOfAtomB) || (bond.from === topChildOfAtomB && bond.to === atomB)
    );

    if (bondA !== undefined && bondB !== undefined) {
      if (bondA.bondType === BOND_TYPES.TRIPLE && bondB.bondType === BOND_TYPES.DOUBLE) {
        return -1;
      }
      if (bondA.bondType === BOND_TYPES.DOUBLE && bondB.bondType === BOND_TYPES.TRIPLE) {
        return 1;
      }
    }

    const atomicNumberOfTopChildOfAtomA = ATOMIC_NUMBER[topChildOfAtomA.label];
    const atomicNumberOfTopChildOfAtomB = ATOMIC_NUMBER[topChildOfAtomB.label];
    if (atomicNumberOfTopChildOfAtomA !== atomicNumberOfTopChildOfAtomB) {
      return atomicNumberOfTopChildOfAtomB - atomicNumberOfTopChildOfAtomA;
    }

    return 0;
  }

  private determineDirectionFromRelativeCoordinates(
    chiralAtom: Atom,
    firstSubstituent: Atom,
    secondSubstituent: Atom,
    thirdSubstituent: Atom
  ): "clockwise" | "counterClockwise" {
    const normalizedfirstSubstituent = {
      x: firstSubstituent.x - chiralAtom.x,
      y: firstSubstituent.y - chiralAtom.y,
    };
    const normalizedsecondSubstituent = {
      x: secondSubstituent.x - chiralAtom.x,
      y: secondSubstituent.y - chiralAtom.y,
    };
    const normalizedthirdSubstituent = {
      x: thirdSubstituent.x - chiralAtom.x,
      y: thirdSubstituent.y - chiralAtom.y,
    };
    const crossProduct1to2 =
      normalizedfirstSubstituent.x * normalizedsecondSubstituent.y -
      normalizedfirstSubstituent.y * normalizedsecondSubstituent.x;

    const crossProduct2to3 =
      normalizedsecondSubstituent.x * normalizedthirdSubstituent.y -
      normalizedsecondSubstituent.y * normalizedthirdSubstituent.x;

    const combinedCrossProduct = crossProduct1to2 + crossProduct2to3;

    return combinedCrossProduct > 0 ? "counterClockwise" : "clockwise";
  }

  private mapDirectionToCIP(direction: "clockwise" | "counterClockwise"): "R" | "S" {
    return direction === "clockwise" ? "R" : "S";
  }

  private areTwoTopSubstituentsSame(substituents: Atom[]): boolean {
    const [first, second] = substituents;
    const atomicNumberFirst = ATOMIC_NUMBER[first.label];
    const atomicNumberSecond = ATOMIC_NUMBER[second.label];
    if (atomicNumberFirst !== atomicNumberSecond) return false;
    const isotopeOrMassFirst = first.isotope ?? ATOMIC_MASS[first.label];
    const isotopeOrMassSecond = second.isotope ?? ATOMIC_MASS[second.label];

    return isotopeOrMassFirst === isotopeOrMassSecond;
  }

  private adjustDirectionBasedOnBonds(
    atom: Atom,
    molecule: Molecule,
    substituents: Atom[],
    direction: "clockwise" | "counterClockwise"
  ): "clockwise" | "counterClockwise" {
    const bonds = molecule.getAtomBonds(atom);
    const firstBond = bonds.find(
      bond => (bond.from === atom && bond.to === substituents[0]) || (bond.from === substituents[0] && bond.to === atom)
    );

    const secondBond = bonds.find(
      bond => (bond.from === atom && bond.to === substituents[1]) || (bond.from === substituents[1] && bond.to === atom)
    );

    const thirdBond = bonds.find(
      bond => (bond.from === atom && bond.to === substituents[2]) || (bond.from === substituents[2] && bond.to === atom)
    );

    const toClockwise = "clockwise";
    const toCounterClockwise = "counterClockwise";
    const isWedged = (bond?: Bond): boolean => bond?.stereo === STEREO.wedget;
    const isDashed = (bond?: Bond): boolean => bond?.stereo === STEREO.dashed;

    if (isWedged(firstBond) && isWedged(secondBond) && direction === "clockwise") return toClockwise;
    if (isDashed(firstBond) && direction === "clockwise") return toCounterClockwise;
    if (isDashed(firstBond) && direction === "counterClockwise") return toClockwise;
    if (isWedged(secondBond) && isWedged(thirdBond)) return toCounterClockwise;
    if (isWedged(thirdBond) && direction === "clockwise") return toCounterClockwise;
    if (isDashed(secondBond)) {
      direction = direction === "clockwise" ? "counterClockwise" : "clockwise";
    }
    if (isWedged(firstBond) && isDashed(secondBond) && direction === "clockwise") return toCounterClockwise;
    if (isDashed(thirdBond) && direction === "counterClockwise") return toClockwise;

    return direction;
  }

  private calculateFinalCipLabel(cipDirection: "R" | "S", substituents: Atom[]): CIPLabel {
    const rsLabels = substituents
      .map(substituent => substituent.cip)
      .filter(label => label === "R" || label === "S") as CIPLabel[];
    let cipLabel: CIPLabel = cipDirection;

    if (rsLabels.length >= 2 && rsLabels.includes("R") && rsLabels.includes("S")) {
      cipLabel = cipDirection === "R" ? "r" : "s";
    }

    return cipLabel;
  }
}
