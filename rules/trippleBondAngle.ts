import {
  type RulesValidationResults,
  type RuleAlgorithm,
} from "@infrastructure";
import { BOND_TYPES } from "@models";
import { getAngleBetweenBonds } from "@utils";

export interface trippleBondAngleAlgorithmType {
  angleDiffError: number;
}

export const trippleBondAngleAlgorithm: RuleAlgorithm<
  trippleBondAngleAlgorithmType
> = (structure, config) => {
  const output: RulesValidationResults[] = [];

  for (const molecule of structure) {
    const trippleBonds = molecule.filterBondsByType(BOND_TYPES.TRIPLE);

    if (trippleBonds.length > 0) {
      for (const bond of trippleBonds) {
        const adjacentBonds = molecule.getAdjacentBonds(bond);

        for (const adjacentBond of adjacentBonds) {
          const angle = getAngleBetweenBonds(adjacentBond, bond);
          if (Math.abs(angle - Math.PI) > config.angleDiffError) {
            output.push({
              message:
                "adjacent bond:" +
                `${molecule.id}->bonds->${molecule.getBondIndex(adjacentBond)}`,
              path: `${molecule.id}->bonds->${molecule.getBondIndex(bond)}`,
            });
          }
        }
      }
    }
  }

  return output;
};
