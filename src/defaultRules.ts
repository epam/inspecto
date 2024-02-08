import { type RuleAlgoritm } from "@infrastructure";
import { Rule, type Structure } from "@models";

const bondLength: RuleAlgoritm = (structure: Structure) => {
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

export const defaultRules = [new Rule("Bond Length", bondLength)];
