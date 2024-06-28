import { type FixingScope, type RulesValidationResults } from "@infrastructure";
import { BOND_TYPES, type Bond } from "@models";
import { type RuleAlgorithm } from "@rules/infrastructure";

const ALKALI_EARTH = ["Mg", "Ca", "Sr", "Ba", "Ra"];
const ELECTRONEGATIVES = ["O", "N", "S"];
export const COVALENT_SINGLE_ALC_EARTH_BONDS = "covalent-counterion:1.3.6";
export const COVALENT_DOUBLE_ALC_EARTH_BONDS = "covalent-counterion:1.3.5";

export interface DoubleCovalentBondsAlgorithmType {
  fixingRule?: boolean;
  fixingScope?: FixingScope[];
}

export const doubleCovalentBondsAlgorithm: RuleAlgorithm<DoubleCovalentBondsAlgorithmType> = (structure, config) => {
  const output: RulesValidationResults[] = [];

  let bondsAlkaliEarthWithElectronegatives: Bond[] = [];

  const singleBondsAlkaliEarthWithElectronegatives: Bond[] = [];
  const doubleBondsAlkaliEarthWithElectronegatives: Bond[] = [];

  for (const molecule of structure.molecules()) {
    const bonds = Array.from(molecule.bonds());

    bondsAlkaliEarthWithElectronegatives = bonds.filter(
      bond =>
        (ALKALI_EARTH.includes(bond.from.label) || ALKALI_EARTH.includes(bond.to.label)) &&
        (ELECTRONEGATIVES.includes(bond.from.label) || ELECTRONEGATIVES.includes(bond.to.label))
    );

    bondsAlkaliEarthWithElectronegatives.forEach(bond =>
      bond.bondType === BOND_TYPES.SINGLE
        ? singleBondsAlkaliEarthWithElectronegatives.push(bond)
        : doubleBondsAlkaliEarthWithElectronegatives.push(bond)
    );

    for (const bond of singleBondsAlkaliEarthWithElectronegatives) {
      const path = `${molecule.id}->bonds->${molecule.getBondIndex(bond)}`;
      const fixingScope = config.fixingScope?.find(
        scope => scope.errorCode === COVALENT_SINGLE_ALC_EARTH_BONDS && scope.path === path
      );

      if (config.fixingRule === true || fixingScope !== undefined) {
        const atomAlkaliEarth = ALKALI_EARTH.includes(bond.from.label) ? bond.from : bond.to;
        atomAlkaliEarth.charge = atomAlkaliEarth.charge + 1;
        const atomSecond = atomAlkaliEarth === bond.from ? bond.to : bond.from;
        atomSecond.charge = atomSecond.charge - 1;

        molecule.removeBond(bond);
        console.info("covalent-counterion:1.3.6 was fixed");
      } else {
        output.push({
          isFixable: true,
          errorCode: COVALENT_SINGLE_ALC_EARTH_BONDS,
          message: `Inspecto has detected an alkali-earth with single covalent bonds with electronegative atom: ${bond.from.label} - ${bond.to.label}`,
          path,
        });
      }
    }
    for (const bond of doubleBondsAlkaliEarthWithElectronegatives) {
      const path = `${molecule.id}->bonds->${molecule.getBondIndex(bond)}`;
      const fixingScope = config.fixingScope?.find(
        scope => scope.errorCode === COVALENT_DOUBLE_ALC_EARTH_BONDS && scope.path === path
      );

      if (config.fixingRule === true || fixingScope !== undefined) {
        const atomAlkaliEarth = ALKALI_EARTH.includes(bond.from.label) ? bond.from : bond.to;
        atomAlkaliEarth.charge = atomAlkaliEarth.charge + 2;
        const atomSecond = atomAlkaliEarth === bond.from ? bond.to : bond.from;
        atomSecond.charge = atomSecond.charge - 2;
        molecule.removeBond(bond);
        console.info("covalent-counterion:1.3.5 was fixed");
      } else {
        output.push({
          isFixable: true,
          errorCode: COVALENT_DOUBLE_ALC_EARTH_BONDS,
          message: `Inspecto has detected an alkali-earth with double covalent bonds with electronegative atom: ${bond.from.label} - ${bond.to.label}`,
          path,
        });
      }
    }
  }

  return output;
};
