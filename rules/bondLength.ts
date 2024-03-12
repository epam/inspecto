import { type RuleAlgorithm } from "@infrastructure";
import { type Structure } from "@models";

export const bondLengthAlgorithm: RuleAlgorithm = (structure: Structure) => {
  const DEFAULT_LENGTH = 0.5;
  const output: ReturnType<RuleAlgorithm> = [];

  for (const molecule of structure) {
    for (const bond of molecule.bonds()) {
      const bondLength = bond.getLength();

      if (Math.abs(bondLength - DEFAULT_LENGTH) > 0.01) {
        output.push({
          message: "Bond Length Rule validation error",
          path: `${molecule.id}->bonds->${molecule.getBondIndex(bond)}`,
        });
      }
    }
  }

  return output;
};
