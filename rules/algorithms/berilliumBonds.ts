import { type RulesValidationResults } from "@infrastructure";
import { type RuleAlgorithm } from "@rules/infrastructure";

const BE = "Be";
// but The most likely formation of bonds with ["H", "O", "F", "S", "Cl", "N"]
const MORE_ELECTRONEGATIVE_ATOMS_THAN_BE = [
  "H",
  "C",
  "N",
  "O",
  "F",
  "Si",
  "P",
  "S",
  "Cl",
  "Co",
  "Cu",
  "Zn",
  "Ge",
  "As",
  "Se",
  "Br",
  "Cr",
  "Mn",
  "Fe",
  "Cd",
];

export interface BerilliumAlgorithmType {
  fixingRule?: boolean;
}

export const berilliumBondsAlgorithm: RuleAlgorithm<BerilliumAlgorithmType> = (structure, config) => {
  const output: RulesValidationResults[] = [];

  // eslint-disable-next-line no-unreachable-loop
  for (const molecule of structure.molecules()) {
    const bonds = Array.from(molecule.bonds());
    for (const bond of bonds) {
      if (
        (bond.from.label === BE || bond.to.label === BE) &&
        (MORE_ELECTRONEGATIVE_ATOMS_THAN_BE.includes(bond.from.label) ||
          MORE_ELECTRONEGATIVE_ATOMS_THAN_BE.includes(bond.to.label))
      ) {
        output.push({
          errorCode: "covalent-counterion:1.3.9",
          message: "Inspecto has detected a covalently bound beryllium",
          path: `${molecule.id}->bonds->${molecule.getBondIndex(bond)}`,
        });
      }
    }
  }

  return output;
};
