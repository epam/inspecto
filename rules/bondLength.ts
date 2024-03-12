import { type RulesValidationResults, type RuleAlgorithm } from "@infrastructure";

export interface BondLengthAlgorithmType {
  bondLength: number;
  differenceError: number;
}

export const bondLengthAlgorithm: RuleAlgorithm<BondLengthAlgorithmType> = (
  structure,
  config,
) => {
  const output: RulesValidationResults[] = [];

  for (const molecule of structure) {
    for (const bond of molecule.bonds()) {
      const bondLength = bond.getLength();

      if (Math.abs(bondLength - config.bondLength) > config.differenceError) {
        output.push({
          message: `Bond Length Rule validation error`,
          path: `${molecule.id}->bonds->${molecule.getBondIndex(bond)}`,
        });
      }
    }
  }

  return output;
};
