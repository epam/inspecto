import { type RulesValidationResults } from "@infrastructure";
import { type Structure, type Bond, type Atom, type Molecule, BOND_TYPES } from "@models";
import { BaseRule, type RuleConfig } from "./base";
import { electronegativityTable } from "../../utils/electronegativityTable";
import { shouldFix } from "@utils";

export interface IncorrectCovalentBondsRuleConfig extends RuleConfig {
  cutOff?: number;
}

const DEFAULT_CUTOFF = 1.9;
const MIN_CUTOFF = 1.7;
const MAX_CUTOFF = 2.0;
export const INCORRECT_COVALENT_BOND_CODE = "incorrect-covalent-bond";

export class IncorrectCovalentBondsRule extends BaseRule<IncorrectCovalentBondsRuleConfig> {
  static docs = {
    name: "Incorrect Covalent Bonds",
    description: "Detect and fix incorrect covalent bonds based on electronegativity differences.",
    url: "https://kb.epam.com/display/EPMLSTRCHC/13.+Incorrect+covalent+bonds",
  };

  verify(structure: Structure): RulesValidationResults[] {
    const output: RulesValidationResults[] = [];
    const cutOff = this.validateCutOff(this.config.cutOff);

    structure.molecules().forEach((molecule, moleculeIndex) => {
      molecule.bonds.forEach((bond, bondIndex) => {
        if (![BOND_TYPES.SINGLE, BOND_TYPES.DOUBLE, BOND_TYPES.TRIPLE].includes(bond.bondType)) {
          return;
        }

        const firstAtom = bond.from;
        const secondAtom = bond.to;

        if (firstAtom == null || secondAtom == null) {
          console.error("Invalid atoms referenced in a bond.");
          return;
        }

        if (firstAtom.label === "" || secondAtom.label === "") {
          console.error("Atom labels cannot be empty.");
          return;
        }

        const electronegativityOfFirstAtom = electronegativityTable[firstAtom.label];
        const electronegativityOfSecondAtom = electronegativityTable[secondAtom.label];

        if (
          this.isNotValidElectronegativity(electronegativityOfFirstAtom) ||
          this.isNotValidElectronegativity(electronegativityOfSecondAtom)
        ) {
          console.log(
            `Skipped bond calculation due to invalid electronegativity for ${firstAtom.label} (EN=${electronegativityOfFirstAtom}) or ${secondAtom.label} (EN=${electronegativityOfSecondAtom})`
          );
          return;
        }

        const difference = Math.abs(electronegativityOfFirstAtom - electronegativityOfSecondAtom);
        if (difference > cutOff) {
          const path = `molecules[${moleculeIndex}].bonds[${bondIndex}]`;
          if (shouldFix(this.config, INCORRECT_COVALENT_BOND_CODE, path)) {
            this.fixBond(bond, firstAtom, secondAtom, molecule, bondIndex);
          } else {
            output.push({
              isFixable: true,
              errorCode: INCORRECT_COVALENT_BOND_CODE,
              message: `Bond between ${firstAtom.label} and ${secondAtom.label} should be ionic.`,
              path,
            });
          }
        }
      });
    });

    return output;
  }

  private validateCutOff(cutOff?: number): number {
    if (cutOff === undefined) return DEFAULT_CUTOFF;
    if (cutOff < MIN_CUTOFF || cutOff > MAX_CUTOFF) {
      throw new Error(`CutOff value must be between ${MIN_CUTOFF} and ${MAX_CUTOFF}`);
    }
    return cutOff;
  }

  private isNotValidElectronegativity(value: number | undefined): boolean {
    return value === undefined;
  }

  private fixBond(bond: Bond, firstAtom: Atom, secondAtom: Atom, molecule: Molecule, bondIndex: number): void {
    const adjustmentFactor = bond.bondType;

    const chargeAdjustmentFirstAtom =
      electronegativityTable[firstAtom.label] < electronegativityTable[secondAtom.label]
        ? adjustmentFactor
        : -adjustmentFactor;
    const chargeAdjustmentSecondAtom = -chargeAdjustmentFirstAtom;

    firstAtom.charge += chargeAdjustmentFirstAtom;
    secondAtom.charge += chargeAdjustmentSecondAtom;

    molecule.bonds.splice(bondIndex, 1);
  }
}
