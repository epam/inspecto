import { type RuleAlgorithm } from "@infrastructure";
import { BOND_TYPES, Rule, type Structure } from "@models";
import { getAngleBetweenBonds } from "@utils";

const bondLength: RuleAlgorithm = (structure: Structure) => {
  const DEFAULT_LENGTH = 0.5;
  const output: string[] = [];

  const message = (
    strings: any,
    bondExp: string,
    bondLengthExp: number,
  ): string => {
    const str0 = strings[0];
    const str1 = strings[1];
    const str2 = strings[2];

    const result = bondLengthExp < DEFAULT_LENGTH ? "shorter" : "longer";
    return `${str0}${bondExp}${str1}${result}${str2}${DEFAULT_LENGTH}.`;
  };

  for (const molecule of structure) {
    for (const bond of molecule.bonds()) {
      const bondLength = bond.getLength();

      if (Math.abs(bondLength - DEFAULT_LENGTH) > 0.01) {
        output.push(
          message`The bond with the following metadata ${bond.toString()} is ${bondLength} than default length `,
        );
      }
    }
  }

  return output;
};

const bondAngleTrippleBondAngle: RuleAlgorithm = (structure: Structure) => {
  const output: string[] = [];

  for (const molecule of structure) {
    const trippleBonds = molecule.filterBondsByType(BOND_TYPES.TRIPLE);

    if (trippleBonds.length > 0) {
      for (const bond of trippleBonds) {
        const adjacentBonds = molecule.getAdjacentBonds(bond);

        for (const adjacentBond of adjacentBonds) {
          const angle = getAngleBetweenBonds(adjacentBond, bond);
          if (Math.abs(angle - Math.PI) > 0.5) {
            output.push(
              `The triple bond with the following metadata ${bond.toString()} violets the rule`,
            );
          }
        }
      }
    } else {
      output.push("There is no tripple bonds in molecule " + molecule.id);
    }
  }
  return output;
};

export const defaultRules = [
  new Rule("Bond Length", bondLength),
  new Rule("Bond Angle: Triple Bond Angle", bondAngleTrippleBondAngle),
];
