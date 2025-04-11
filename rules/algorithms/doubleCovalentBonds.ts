import { type FixingScope, type RulesValidationResults } from "@infrastructure";
import { BOND_TYPES, type Bond } from "@models";
import { type RuleAlgorithm } from "@rules/infrastructure";
import { shouldFix } from "@utils";

const ALKALI_EARTH = ["Mg", "Ca", "Sr", "Ba", "Ra"];
const ELECTRONEGATIVES = ["O", "N", "S"];

export const COVALENT_DOUBLE_ALC_EARTH_BONDS = "covalent-counterion:1.3.5";
export const COVALENT_SINGLE_ALC_EARTH_BONDS = "covalent-counterion:1.3.6";
export const COVALENT_TWO_SINGLE_ALC_EARTH_BONDS = "covalent-counterion:1.3.7";

export interface DoubleCovalentBondsAlgorithmType {
  fixingRule?: boolean;
  fixingScope?: FixingScope[];
}

export const doubleCovalentBondsAlgorithm: RuleAlgorithm<DoubleCovalentBondsAlgorithmType> = (structure, config) => {
  const output: RulesValidationResults[] = [];

  for (const molecule of structure.molecules()) {
    let bondsAlkaliEarthWithElectronegatives: Bond[] = [];
    const singleBondsAlkaliEarthWithElectronegatives: Bond[] = [];
    const doubleBondsAlkaliEarthWithElectronegatives: Bond[] = [];

    bondsAlkaliEarthWithElectronegatives = molecule.bonds.filter(
      bond =>
        (ALKALI_EARTH.includes(bond.from.label) || ALKALI_EARTH.includes(bond.to.label)) &&
        (ELECTRONEGATIVES.includes(bond.from.label) || ELECTRONEGATIVES.includes(bond.to.label))
    );

    bondsAlkaliEarthWithElectronegatives.forEach(bond =>
      bond.bondType === BOND_TYPES.SINGLE
        ? singleBondsAlkaliEarthWithElectronegatives.push(bond)
        : doubleBondsAlkaliEarthWithElectronegatives.push(bond)
    );

    const singleBondsAlcaliEarthAtoms = singleBondsAlkaliEarthWithElectronegatives
      .flatMap(bond => [bond.from, bond.to])
      .filter(atom => ALKALI_EARTH.includes(atom.label));
    const singleBondsAlcaliEarthAtomsUnique = new Set(singleBondsAlcaliEarthAtoms);
    const alcaliEarthAtomsWithTwoSingleBonds = Array.from(singleBondsAlcaliEarthAtomsUnique).filter(
      atom =>
        singleBondsAlkaliEarthWithElectronegatives.filter(bond => bond.from === atom || bond.to === atom).length === 2
    );

    const oneSingleBondsAlkaliEarthWithElectronegatives = singleBondsAlkaliEarthWithElectronegatives.filter(
      bond =>
        !alcaliEarthAtomsWithTwoSingleBonds.includes(bond.from) && !alcaliEarthAtomsWithTwoSingleBonds.includes(bond.to)
    );

    for (const atom of alcaliEarthAtomsWithTwoSingleBonds) {
      const path = `${molecule.id}->atom->${molecule.getAtomIndex(atom)}`;

      if (shouldFix(config, COVALENT_TWO_SINGLE_ALC_EARTH_BONDS, path)) {
        const alcaliEarthAtomBonds = singleBondsAlkaliEarthWithElectronegatives.filter(
          bond => bond.from === atom || bond.to === atom
        );
        for (const alcaliEarthAtomBond of alcaliEarthAtomBonds) {
          atom.charge = atom.charge + 1;
          const atomSecond = atom === alcaliEarthAtomBond.from ? alcaliEarthAtomBond.to : alcaliEarthAtomBond.from;
          atomSecond.charge = atomSecond.charge - 1;
          molecule.removeBond(alcaliEarthAtomBond);
        }

        console.info("covalent-counterion:1.3.7 was fixed");
      } else {
        output.push({
          isFixable: true,
          errorCode: COVALENT_TWO_SINGLE_ALC_EARTH_BONDS,
          message: `Inspecto has detected an alkali-earth with two single covalent bonds with electronegative atom: ${atom.label}`,
          path,
        });
      }
    }

    for (const bond of oneSingleBondsAlkaliEarthWithElectronegatives) {
      const path = `${molecule.id}->bonds->${molecule.getBondIndex(bond)}`;

      if (shouldFix(config, COVALENT_SINGLE_ALC_EARTH_BONDS, path)) {
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

      if (shouldFix(config, COVALENT_DOUBLE_ALC_EARTH_BONDS, path)) {
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
