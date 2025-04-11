import { type RulesValidationResults } from "@infrastructure";
import { type RuleAlgorithm } from "@rules/infrastructure";

const BE = "Be";
const ELECTRONEGATIVES = ["O", "N", "S"];
export const COVALENT_BERILLIUM_BONDS = "covalent-counterion:1.3.9";

export interface BerilliumAlgorithmType {
  fixingRule?: boolean;
}

export const berilliumBondsAlgorithm: RuleAlgorithm<BerilliumAlgorithmType> = (structure, config) => {
  const output: RulesValidationResults[] = [];

  // eslint-disable-next-line no-unreachable-loop
  for (const molecule of structure.molecules()) {
    for (const bond of molecule.bonds) {
      if (
        (bond.from.label === BE || bond.to.label === BE) &&
        (ELECTRONEGATIVES.includes(bond.from.label) || ELECTRONEGATIVES.includes(bond.to.label))
      ) {
        output.push({
          isFixable: false,
          errorCode: COVALENT_BERILLIUM_BONDS,
          message: "Inspecto has detected a covalently bound beryllium",
          path: `${molecule.id}->bonds->${molecule.getBondIndex(bond)}`,
        });
      }
    }
  }

  return output;
};
