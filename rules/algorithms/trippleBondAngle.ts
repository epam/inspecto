import { type RulesValidationResults } from "@infrastructure";
import { BOND_TYPES } from "@models";
import { getAngleBetweenBonds, getCommonAtomInAdjacentBonds } from "@utils";
import { type RuleAlgorithm } from "@rules/infrastructure";

export interface trippleBondAngleAlgorithmType {
  angleDiffError: number;
  fixingRule?: boolean;
}

export const TRIPLE_BOND_ANGLE = "triple-bond:5.8";

export const trippleBondAngleAlgorithm: RuleAlgorithm<trippleBondAngleAlgorithmType> = (structure, config) => {
  const output: RulesValidationResults[] = [];

  for (const molecule of structure.molecules()) {
    const trippleBonds = molecule.filterBondsByType(BOND_TYPES.TRIPLE);

    if (trippleBonds.length > 0) {
      for (const bond of trippleBonds) {
        const adjacentBonds = molecule.getAdjacentBonds(bond);

        for (const adjacentBond of adjacentBonds) {
          const angle = getAngleBetweenBonds(adjacentBond, bond);
          if (Math.abs(angle - Math.PI) > config.angleDiffError) {
            output.push({
              errorCode: TRIPLE_BOND_ANGLE,
              isFixable: false,
              message: "adjacent bond:" + `${molecule.id}->bonds->${molecule.getBondIndex(adjacentBond)}`,
              path: `${molecule.id}->bonds->${molecule.getBondIndex(bond)}`,
            });

            if (config.fixingRule ?? false) {
              const commonAtom = getCommonAtomInAdjacentBonds(bond, adjacentBond);

              if (commonAtom != null) {
                const coordsOrigin = bond.to === commonAtom ? bond.from : bond.to;
                const x1 = commonAtom.x - coordsOrigin.x;
                const y1 = commonAtom.y - coordsOrigin.y;
                const l1 = bond.getLength();
                const l2 = adjacentBond.getLength();
                const x2 = x1 * (1 + l2 / l1) + coordsOrigin.x;
                const y2 = y1 * (1 + l2 / l1) + coordsOrigin.y;
                const targetAtom = adjacentBond.to === commonAtom ? adjacentBond.from : adjacentBond.to;
                targetAtom.changePosition(x2, y2);
              }
            }
          }
        }
      }
    }
  }

  return output;
};
