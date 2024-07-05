import { type FixingScope, type RulesValidationResults } from "@infrastructure";
import { BOND_TYPES, type Bond } from "@models";
import { type RuleAlgorithm } from "@rules/infrastructure";
import { shouldFix } from "../../utils/shouldFix";

const ALKALI = ["Li", "Na", "K", "Rb", "Cs", "Fr"];
const ELECTRONEGATIVES = ["O", "N", "S"];
export const COVALENT_SINGLE_ALC_BONDS = "covalent-counterion:1.3.3";

export interface SingleCovalentBondsAlgorithmType {
  fixingRule?: boolean;
  fixingScope?: FixingScope[];
}

export const singleCovalentBondsAlgorithm: RuleAlgorithm<SingleCovalentBondsAlgorithmType> = (structure, config) => {
  const output: RulesValidationResults[] = [];

  for (const molecule of structure.molecules()) {
    let singleBondsAlkaliWithElectronegatives: Bond[] = [];
    const singleBonds = molecule.filterBondsByType(BOND_TYPES.SINGLE);

    singleBondsAlkaliWithElectronegatives = singleBonds.filter(
      bond =>
        (ALKALI.includes(bond.from.label) || ALKALI.includes(bond.to.label)) &&
        (ELECTRONEGATIVES.includes(bond.from.label) || ELECTRONEGATIVES.includes(bond.to.label))
    );
    for (const bond of singleBondsAlkaliWithElectronegatives) {
      const path = `${molecule.id}->bonds->${molecule.getBondIndex(bond)}`;

      if (shouldFix(config, COVALENT_SINGLE_ALC_BONDS, path)) {
        const atomAlkali = ALKALI.includes(bond.from.label) ? bond.from : bond.to;
        atomAlkali.charge = atomAlkali.charge + 1;
        const atomSecond = atomAlkali === bond.from ? bond.to : bond.from;
        atomSecond.charge = atomSecond.charge - 1;

        molecule.removeBond(bond);
        console.info("covalent-counterion:1.3.3 was fixed");
      } else {
        output.push({
          isFixable: true,
          errorCode: COVALENT_SINGLE_ALC_BONDS,
          message: `Inspecto has detected an alkali with single covalent bonds with electronegative atom: ${bond.from.label} - ${bond.to.label}`,
          path: `${molecule.id}->bonds->${molecule.getBondIndex(bond)}`,
        });
      }
    }
  }
  return output;
};
