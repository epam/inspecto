import { type RulesValidationResults } from "@infrastructure";
import { type Atom, type Molecule } from "@models";
import { type RuleAlgorithm } from "@rules/infrastructure";

const ALKALI = ["Li", "Na", "K", "Rb", "Cs", "Fr"];
const ALKALI_EARTH = ["Mg", "Ca", "Sr", "Ba", "Ra"];
const MAXIMUM_ALKALI_BONDS = 1;
const MAXIMUM_ALKALI_EARTH_BONDS = 2;

export interface AlkaliBondsAlgorithmType {
  fixingRule?: boolean;
}

export const alkaliBondsAlgorithm: RuleAlgorithm<AlkaliBondsAlgorithmType> = (structure, config) => {
  const output: RulesValidationResults[] = [];

  // eslint-disable-next-line no-unreachable-loop
  for (const molecule of structure.molecules()) {
    const alkaliInMolecula: Atom[] = [];
    const alkaliEarthInMolecula: Atom[] = [];

    // eslint-disable-next-line @typescript-eslint/no-for-in-array
    for (const atom of molecule.atoms()) {
      const isAtomAlkali = ALKALI.includes(atom.label);
      const isAtomAlkaliEarth = ALKALI_EARTH.includes(atom.label);
      if (isAtomAlkali) {
        alkaliInMolecula.push(atom);
      }
      if (isAtomAlkaliEarth) {
        alkaliEarthInMolecula.push(atom);
      }
    }
    checkMultipleBonds(alkaliInMolecula, molecule, output, MAXIMUM_ALKALI_BONDS, "1.3.4");
    checkMultipleBonds(alkaliEarthInMolecula, molecule, output, MAXIMUM_ALKALI_EARTH_BONDS, "1.3.8");
  }

  return output;
};

const checkMultipleBonds = (
  atoms: Atom[],
  molecule: Molecule,
  output: RulesValidationResults[],
  maximumBonds: number,
  errorCode: string
): void => {
  const bonds = Array.from(molecule.bonds());
  for (const atom of atoms) {
    const atomBonds = bonds.filter(bond => bond.from === atom || bond.to === atom);

    const atomBondsSum = atomBonds.reduce((previous, current) => previous + current.bondType, 0);
    if (atomBondsSum > maximumBonds) {
      output.push({
        errorCode: `covalent-counterion:${errorCode}`,
        message: `Inspecto has detected an alkali metal with multiple covalent bonds: ${atomBondsSum}`,
        path: `${molecule.id}->atoms->${molecule.getAtomIndex(atom)}->${atom.label}`,
      });
    }
  }
};
