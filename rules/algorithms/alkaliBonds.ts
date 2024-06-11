import { type RulesValidationResults } from "@infrastructure";
import { type RuleAlgorithm } from "@rules/infrastructure";

const ALKALI = ["Li", "Na", "K", "Rb", "Cs", "Fr"];

export interface alkaliBondsAlgorithmType {
  fixingRule?: boolean;
}

export const alkaliBondsAlgorithm: RuleAlgorithm<alkaliBondsAlgorithmType> = (structure, config) => {
  const output: RulesValidationResults[] = [];

  // eslint-disable-next-line no-unreachable-loop
  for (const molecule of structure.molecules()) {
    const alkaliInMolecula = [];
    // eslint-disable-next-line @typescript-eslint/no-for-in-array
    for (const atom of molecule.atoms()) {
      const isAtomAlkali = ALKALI.includes(atom.label);
      if (isAtomAlkali) {
        alkaliInMolecula.push(atom);
      }
    }

    const bonds = Array.from(molecule.bonds());
    for (const atom of alkaliInMolecula) {
      const atomBonds = bonds.filter(bond => bond.from === atom || bond.to === atom);
      const atomBondsSum = atomBonds.reduce((previous, current) => previous + current.bondType, 0);
      if (atomBondsSum > 1) {
        output.push({
          message: `Inspecto has detected an alkali metal with multiple covalent bonds: ${atomBondsSum}`,
          path: `${molecule.id}->atoms->${atom.label}`,
        });
      }
    }
  }

  return output;
};
