import { type RulesValidationResults } from "@infrastructure";
import { type Atom, type Molecule } from "@models";
import { type RuleAlgorithm } from "@rules/infrastructure";
import { type RuleConfig } from "./base";

const ALKALI = ["Li", "Na", "K", "Rb", "Cs", "Fr"];
const ALKALI_EARTH = ["Mg", "Ca", "Sr", "Ba", "Ra"];
const MAXIMUM_ALKALI_BONDS = 1;
const MAXIMUM_ALKALI_EARTH_BONDS = 2;
export const COVALENT_ALKALI_BONDS_EXIST = "covalent-counterion:1.3.4";
export const COVALENT_ALKALI_EARTH_BONDS_EXIST = "covalent-counterion:1.3.8";

export interface AlkaliBondsRuleConfig extends RuleConfig {}

export const alkaliBondsAlgorithm: RuleAlgorithm<AlkaliBondsRuleConfig> = structure => {
  const output: RulesValidationResults[] = [];

  for (const molecule of structure.molecules()) {
    const alkaliInMolecula: Atom[] = [];
    const alkaliEarthInMolecula: Atom[] = [];

    for (const atom of molecule.atoms) {
      const isAtomAlkali = ALKALI.includes(atom.label);
      const isAtomAlkaliEarth = ALKALI_EARTH.includes(atom.label);
      if (isAtomAlkali) {
        alkaliInMolecula.push(atom);
      }
      if (isAtomAlkaliEarth) {
        alkaliEarthInMolecula.push(atom);
      }
    }
    checkMultipleBonds(alkaliInMolecula, molecule, output, MAXIMUM_ALKALI_BONDS, COVALENT_ALKALI_BONDS_EXIST);
    checkMultipleBonds(
      alkaliEarthInMolecula,
      molecule,
      output,
      MAXIMUM_ALKALI_EARTH_BONDS,
      COVALENT_ALKALI_EARTH_BONDS_EXIST,
    );
  }

  return output;
};

const checkMultipleBonds = (
  atoms: Atom[],
  molecule: Molecule,
  output: RulesValidationResults[],
  maximumBonds: number,
  errorCode: string,
): void => {
  for (const atom of atoms) {
    const atomBonds = molecule.bonds.filter(bond => bond.from === atom || bond.to === atom);

    const atomBondsSum = atomBonds.reduce((previous, current) => previous + current.bondType, 0);
    if (atomBondsSum > maximumBonds) {
      output.push({
        isFixable: false,
        errorCode: `${errorCode}`,
        message: `Inspecto has detected an alkali metal with multiple covalent bonds: ${atomBondsSum}`,
        path: `${molecule.id}->atoms->${molecule.getAtomIndex(atom)}->${atom.label}`,
      });
    }
  }
};
