import { container } from "@rules/inversify.config";
import { type IRulesManager, RULES_TOKENS } from "@rules/infrastructure";
import {
  bondLengthAlgorithm,
  trippleBondAngleAlgorithm,
  overlappingBondsAlgorithm,
  valenceAlgorithm,
  covalentCounterionAlgorithm,
  type OverlappingBondsConfigType,
  type trippleBondAngleAlgorithmType,
  type BondLengthAlgorithmType,
  type CovalentCounterionAlgorithmType,
} from "@rules/algorithms";
import type { ValenceAlgorithmType } from "./algorithms/valence";

export { Rule } from "./models/Rule";

const RulesManager = container.get<IRulesManager>(RULES_TOKENS.RULES_MANAGER);

RulesManager.createRule<ValenceAlgorithmType>("Valence", valenceAlgorithm, {}, []);

RulesManager.createRule<CovalentCounterionAlgorithmType>(
  "Covalent Counterion",
  covalentCounterionAlgorithm,
  { fixingRule: false },
  []
);

RulesManager.createRule<BondLengthAlgorithmType>(
  "Bond Length",
  bondLengthAlgorithm,
  { bondLength: 1, differenceError: 0.01 },
  []
);

RulesManager.createRule<trippleBondAngleAlgorithmType>(
  "Tripple Bond Angle",
  trippleBondAngleAlgorithm,
  { angleDiffError: 0.5, fixingRule: false },
  []
);

RulesManager.createRule<OverlappingBondsConfigType>("Overlapping Bonds", overlappingBondsAlgorithm, {}, []);

export {
  RulesManager,
  type IRulesManager,
  type OverlappingBondsConfigType,
  type trippleBondAngleAlgorithmType,
  type CovalentCounterionAlgorithmType,
};
