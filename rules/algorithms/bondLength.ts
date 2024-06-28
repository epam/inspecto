import { type RulesValidationResults } from "@infrastructure";
import { type RuleAlgorithm } from "@rules/infrastructure";

export interface BondLengthAlgorithmType {
  bondLength: number;
  differenceError: number;
}

export const BOND_LENGTH = "bond-lenght";

export const bondLengthAlgorithm: RuleAlgorithm<BondLengthAlgorithmType> = (structure, config) => {
  const output: RulesValidationResults[] = [];

  for (const molecule of structure.molecules()) {
    for (const bond of molecule.bonds()) {
      const bondLength = bond.getLength();

      if (Math.abs(bondLength - config.bondLength) > config.differenceError) {
        output.push({
          errorCode: BOND_LENGTH,
          isFixable: false,
          message: `Bond Length Rule validation error: ${bond.getLength()}`,
          path: `${molecule.id}->bonds->${molecule.getBondIndex(bond)}`,
        });
      }
    }
  }

  return output;
};
