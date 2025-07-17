import { type RulesValidationResults } from "@infrastructure";
import { type Molecule, BOND_TYPES, type Atom, type Bond, type Structure } from "@models";
import { BaseRule, type RuleConfig } from "./base";
import { createGraph, findAllCyclesInGraph } from "@utils";
import { VALENCE_RULES } from "@utils/valence";

export interface AromaticityRuleConfig extends RuleConfig {}

export const AROMATICITY_CODE = "aromaticity:10";
const ZERO_ELECTRONS = 0;
const SINGLE_ELECTRON = 1;
const DOUBLE_ELECTRONS = 2;
const TRIPLE_ELECTRONS = 3;
const FIVE_ELECTRONS = 5;
const SIX_ELECTRONS = 6;
const valenceMap = new Map<string, number>([
  ["B", 3],
  ["C", 4],
  ["N", 5],
  ["O", 6],
  ["F", 7],
  ["Al", 3],
  ["Si", 4],
  ["P", 5],
  ["S", 6],
  ["Cl", 7],
  ["Ga", 3],
  ["Ge", 4],
  ["As", 5],
  ["Se", 6],
  ["Br", 7],
  ["In", 3],
  ["Sn", 4],
  ["Sb", 5],
  ["Te", 6],
  ["I", 7],
  ["Tl", 3],
  ["Pb", 4],
  ["Bi", 5],
]);

export class AromaticityRule extends BaseRule<AromaticityRuleConfig> {
  static docs = {
    name: "Aromaticity",
    description: "Check for aromaticity rule compliance in both cyclic and non-cyclic structures",
    url: "https://kb.epam.com/display/EPMLSTRCHC/10.+Aromaticity",
  };

  verify(structure: Structure): RulesValidationResults[] {
    const output: RulesValidationResults[] = [];
    const molecules = structure.molecules();
    const usedBonds = new Map<Bond, boolean>();
    const usedAtoms = new Map<Atom, boolean>();

    molecules.forEach((molecule: Molecule) => {
      const graph = createGraph(molecule);
      const cycles = findAllCyclesInGraph(graph);
      const minimumCycles = this.filterNonMinimalCycles(cycles);
      const aromaticBonds = molecule.bonds.filter(bond => bond.bondType === BOND_TYPES.AROMATIC);
      let hasNonCyclicAromatic = false;
      let invalidAromaticCycles = 0;
      const atomConnections = new Map();

      if (aromaticBonds.length <= 0) {
        return;
      }

      aromaticBonds.forEach(bond => {
        [bond.from, bond.to].forEach(atom => {
          atomConnections.set(atom, atomConnections.has(atom) ? atomConnections.get(atom) + 1 : 1);
        });
      });

      atomConnections.forEach(count => {
        if (count < DOUBLE_ELECTRONS) {
          hasNonCyclicAromatic = true;
        }
      });

      minimumCycles.forEach(cycle => {
        if (!this.cycleIsAromatic(cycle, molecule, usedBonds, usedAtoms)) {
          invalidAromaticCycles++;
        }
      });

      if (invalidAromaticCycles > 0) {
        output.push({
          isFixable: false,
          errorCode: AROMATICITY_CODE,
          message: `Inspecto has detected ${invalidAromaticCycles} ring(s) that doesn't meet the requirements for aromaticity`,
          path: molecule.id,
        });
      }

      if (hasNonCyclicAromatic) {
        output.push({
          isFixable: false,
          errorCode: AROMATICITY_CODE,
          message:
            "Inspecto has detected the structure represented with an aromatic bond that is not a cyclic structure",
          path: molecule.id,
        });
      }
    });

    return output;
  }

  private filterNonMinimalCycles(allCycles: Atom[][]): Atom[][] {
    return allCycles.filter(cycle => {
      const cycleSet = new Set(cycle.map(atom => atom.toString()));
      let subCycleCount = 0;
      allCycles.forEach(otherCycle => {
        const otherCycleSet = new Set(otherCycle.map(atom => atom.toString()));
        if (otherCycle !== cycle && this.isSubset(cycleSet, otherCycleSet)) {
          subCycleCount++;
        }
      });
      return subCycleCount < 2;
    });
  }

  private isSubset(set: Set<string>, subset: Set<string>): boolean {
    for (const elem of subset) {
      if (!set.has(elem)) return false;
    }
    return true;
  }

  private cycleIsAromatic(
    cycle: Atom[],
    molecule: Molecule,
    usedBonds: Map<Bond, boolean>,
    usedAtoms: Map<Atom, boolean>,
  ): boolean {
    let piElectrons = 0;
    let skipNextBond = false;

    if (!cycle.every(atom => valenceMap.has(atom.label))) return false;

    const cycleBonds = molecule.bonds.filter(
      bond => !(usedBonds.get(bond) === true) && bond.atoms.every(atom => cycle.includes(atom)),
    );

    for (let i = 0; i < cycleBonds.length; i++) {
      const bond = cycleBonds[i];
      let contributed = false;

      if (skipNextBond) {
        skipNextBond = false;
        continue;
      }

      for (let j = 0; j < bond.atoms.length; j++) {
        const atom = bond.atoms[j];
        const realValence = this.calculateRealValence(atom, molecule);
        const atomValence = valenceMap.get(atom.label);
        const valenceOptions = VALENCE_RULES[atom.label];
        const valenceEqualValenceOptions = valenceOptions.some(allowedValence => allowedValence === realValence);
        if (atomValence === undefined) continue;
        const freeElectrons = atomValence - realValence;
        const isOddCycleWithCriticalValenceAndElectrons =
          cycle.length % 2 !== 0 &&
          (atomValence === TRIPLE_ELECTRONS || atomValence === FIVE_ELECTRONS || atomValence === SIX_ELECTRONS) &&
          (freeElectrons === SINGLE_ELECTRON || freeElectrons === ZERO_ELECTRONS);

        const hasInvalidFreeElectrons = freeElectrons < ZERO_ELECTRONS;

        const hasCriticalValenceWithLowFreeElectrons =
          freeElectrons < DOUBLE_ELECTRONS && (atomValence === FIVE_ELECTRONS || atomValence === SIX_ELECTRONS);

        const meetsHighElectronsValenceRequirements =
          freeElectrons >= DOUBLE_ELECTRONS &&
          valenceEqualValenceOptions &&
          (atomValence === FIVE_ELECTRONS || atomValence === SIX_ELECTRONS);

        if (usedAtoms.has(atom)) {
          continue;
        }

        if (
          isOddCycleWithCriticalValenceAndElectrons ||
          hasInvalidFreeElectrons ||
          hasCriticalValenceWithLowFreeElectrons
        ) {
          return false;
        }

        if (meetsHighElectronsValenceRequirements) {
          piElectrons += DOUBLE_ELECTRONS;
          usedAtoms.set(atom, true);
          contributed = true;

          if (j === 0) {
            break;
          } else {
            skipNextBond = true;
            break;
          }
        }
      }

      if (!contributed) {
        const canDoubleBond = bond.atoms.map(atom => this.canHaveDoubleBondInRing(atom, molecule));

        if (canDoubleBond[0] && canDoubleBond[1]) {
          piElectrons += DOUBLE_ELECTRONS;
          usedBonds.set(bond, true);
          skipNextBond = true;
        } else if (canDoubleBond[0] || canDoubleBond[1]) {
          continue;
        }
      }
    }

    return this.hasValidHuckelCount(piElectrons);
  }

  private hasValidHuckelCount(piElectrons: number): boolean {
    const huckelsN = (piElectrons - 2) / 4;
    return Number.isInteger(huckelsN) && huckelsN >= 0;
  }

  private canHaveDoubleBondInRing(atom: Atom, molecule: Molecule): boolean {
    const valenceOptions = VALENCE_RULES[atom.label];
    const realValence = this.calculateRealValence(atom, molecule);
    const canPotentiallyHaveDoubleBondCase1 = valenceOptions.some(
      allowedValence => allowedValence === realValence + SINGLE_ELECTRON,
    );
    const canPotentiallyHaveDoubleBondCase2 = valenceOptions.some(
      allowedValence => allowedValence === realValence + DOUBLE_ELECTRONS,
    );

    if (valenceOptions.some(allowedValence => allowedValence === realValence)) {
      return false;
    }
    return (
      ((canPotentiallyHaveDoubleBondCase1 || canPotentiallyHaveDoubleBondCase2) && atom.label === "C") ||
      canPotentiallyHaveDoubleBondCase1
    );
  }

  private calculateRealValence(atom: Atom, molecule: Molecule): number {
    const bonds = molecule.bonds.filter(b => b.atoms.includes(atom));
    const implicitHCount = atom.implicitHCount ?? 0;
    const actualCharge = atom.charge ?? 0;

    const drawnBondsCount = bonds.reduce((count, b) => {
      if (b.bondType === BOND_TYPES.SINGLE || b.bondType === BOND_TYPES.AROMATIC) {
        return count + SINGLE_ELECTRON;
      } else if (b.bondType === BOND_TYPES.DOUBLE) {
        return count + DOUBLE_ELECTRONS;
      } else if (b.bondType === BOND_TYPES.TRIPLE) {
        return count + TRIPLE_ELECTRONS;
      }
      return count;
    }, 0);

    return drawnBondsCount + actualCharge + implicitHCount;
  }
}
