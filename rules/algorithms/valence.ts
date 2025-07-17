import { type RulesValidationResults } from "@infrastructure";
import { type Bond } from "@models";
import { type RuleAlgorithm } from "@rules/infrastructure";
import { VALENCE_RULES } from "@utils/valence";
import type { RuleConfig } from "./base";
export interface ValenceRuleConfig extends RuleConfig {}

export const VALENCE = "valence:3";

const METHALS = ["Li", "Na", "K", "Mg", "Ca", "Al", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Mo"];
const DEFAULT_HYDROGENES: Record<string, number> = {
  N: 3,
  C: 4,
  F: 1,
  O: 2,
  S: 2,
  P: 3,
  Se: 2,
};

export const valenceAlgorithm: RuleAlgorithm<ValenceRuleConfig> = structure => {
  const output: RulesValidationResults[] = [];

  for (const molecule of structure.molecules()) {
    for (const atom of molecule.atoms) {
      const atomName = atom.label;
      if (!(atomName in VALENCE_RULES)) {
        continue;
      }
      if (METHALS.includes(atomName) && atom.charge < 0) {
        continue;
      }
      let hydrogenCount = atomName in DEFAULT_HYDROGENES ? DEFAULT_HYDROGENES[atomName] : 0;

      if (atom.charge < 0 && hydrogenCount > 0) {
        hydrogenCount = 0;
      }

      const absCharge = Math.abs(atom.charge);
      const relatedBonds: Bond[] = [];
      for (const bond of molecule.bonds) {
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
      const bondWeight = relatedBonds.reduce((acc, bond) => acc + bond.bondType, 0);
      let currentValence = absCharge + bondWeight + hydrogenCount;
      if (atom.explicitValence !== undefined) {
        currentValence = atom.explicitValence;
      }

      if (!VALENCE_RULES[atom.label].includes(currentValence)) {
        output.push({
          errorCode: VALENCE,
          isFixable: false,
          message: `Atom ${molecule.id}->${molecule.getAtomIndex(atom)} (${atom.label}) has incorrect valence - ${currentValence} instead of ${VALENCE_RULES[atom.label].join(", ")}`,
          path: `${molecule.id}->${molecule.getAtomIndex(atom)}`,
        });
      }
    }
  }

  if (output.length > 0) {
    output.push({
      errorCode: VALENCE,
      isFixable: false,
      message: `Inspecto found ${output.length} atoms with the wrong valence`,
      path: "atoms",
    });
  }

  return output;
};
