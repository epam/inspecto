import { type RulesValidationResults } from "@infrastructure";
import { type Bond } from "@models";
import { type RuleAlgorithm } from "@rules/infrastructure";

export interface ValenceAlgorithmType {
  fixingRule?: boolean;
}

const VALENCE_RULES: Record<string, number[]> = {
  H: [1],
  O: [2],
  Mn: [2, 3, 4, 6, 7],
  Li: [1],
  F: [1],
  Fe: [2, 3],
  Na: [1],
  Cl: [1, 3, 5, 7],
  Co: [2, 3],
  K: [1],
  Br: [1, 3, 5, 7],
  Ni: [2],
  Mg: [2],
  I: [1, 3, 5, 7],
  Cu: [1, 2],
  Ca: [2],
  Al: [3],
  Zn: [2],
  B: [3],
  P: [3, 5],
  Se: [2, 4, 6],
  C: [4],
  S: [2, 4, 6],
  Mo: [4, 6],
  N: [3, 5],
  Cr: [2, 3, 6],
};

const METHALS = ["Li", "Na", "K", "Mg", "Ca", "Al", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Mo"];
const DEFAULT_HYDROGENES: Record<string, number> = {
  N: 3,
  C: 4,
  F: 1,
  O: 2,
  // S: 2,
  // P: 3,
  // Se: 2,
};
export const valenceAlgorithm: RuleAlgorithm<ValenceAlgorithmType> = (structure, config) => {
  const output: RulesValidationResults[] = [];

  // eslint-disable-next-line no-unreachable-loop
  for (const molecule of structure.molecules()) {
    // eslint-disable-next-line @typescript-eslint/no-for-in-array
    for (const atom of molecule.atoms()) {
      const atomName = atom.label;
      if (!(atomName in VALENCE_RULES)) {
        continue;
      }
      if (METHALS.includes(atomName) && atom.charge < 0) {
        // exclude metals with negative charge
        continue;
      }
      let hydrogenCount = atomName in DEFAULT_HYDROGENES ? DEFAULT_HYDROGENES[atomName] : 0;

      if (atom.charge < 0 && hydrogenCount > 0) {
        hydrogenCount = 0;
        // exclude atoms with negative charge and hydrogenes
      }

      const absCharge = Math.abs(atom.charge);
      const relatedBonds: Bond[] = [];
      for (const bond of molecule.bonds()) {
        if (bond.from === atom || bond.to === atom) {
          relatedBonds.push(bond);
          if (hydrogenCount > 0) {
            hydrogenCount -= bond.bondType;
            if (hydrogenCount < 0) {
              hydrogenCount = 0;
            }
          }
        }
      }
      const bondWeight = relatedBonds.reduce((acc, bond) => {
        return acc + bond.bondType;
      }, 0);

      const currentValence = absCharge + bondWeight + hydrogenCount;

      if (!VALENCE_RULES[atom.label].includes(currentValence)) {
        output.push({
          message: `Atom ${molecule.id}->${molecule.getAtomIndex(atom)} (${atom.label}) has incorrect valence - ${currentValence} instead of ${VALENCE_RULES[atom.label].join(", ")}`,
          path: `${molecule.id}->${molecule.getAtomIndex(atom)}`,
        });
      }
    }
  }

  if (output.length > 0) {
    output.push({
      message: `Inspecto found ${output.length} atoms with the wrong valence`,
      path: "atoms",
    });
  }

  return output;
};
