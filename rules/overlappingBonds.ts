import {
  type RulesValidationResults,
  type RuleAlgorithm,
} from "../src/infrastructure/types";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OverlappingBondsConfigType {}

export const overlappingBondsAlgorithm: RuleAlgorithm<
  OverlappingBondsConfigType
> = (structure, config) => {
  const output: RulesValidationResults[] = [];

  for (const molecule of structure.molecules()) {
    const bonds = Array.from(molecule.bonds());

    for (let i = 0; i < bonds.length; i++) {
      const bond = bonds[i];
      const { x: x1, y: y1 } = bond.to;
      const { x: x2, y: y2 } = bond.from;

      for (let j = i + 2; j < bonds.length; j++) {
        const nextBond = bonds[j];
        const { x: x3, y: y3 } = nextBond.to;
        const { x: x4, y: y4 } = nextBond.from;

        const t1 =
          ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
          ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

        const t2 =
          ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
          ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

        if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
          output.push({
            path: `${molecule.id}->bonds->${molecule.getBondIndex(bond)}`,
            message:
              "Bond has interaction with " +
              `${molecule.id}->bonds->${molecule.getBondIndex(nextBond)}`,
          });
        }
      }
    }
  }

  return output;
};
