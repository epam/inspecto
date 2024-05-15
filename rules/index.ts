import { container } from "@rules/inversify.config";
import { type IRulesManager, RULES_TOKENS } from "@rules/infrastructure";
import {
  bondLengthAlgorithm,
  trippleBondAngleAlgorithm,
  overlappingBondsAlgorithm,
  type OverlappingBondsConfigType,
  type trippleBondAngleAlgorithmType,
  type BondLengthAlgorithmType,
} from "@rules/algorithms";

const RulesManager = container.get<IRulesManager>(RULES_TOKENS.RULES_MANAGER);

RulesManager.createRule<BondLengthAlgorithmType>(
  "Bond Length",
  bondLengthAlgorithm,
  { bondLength: 1, differenceError: 0.01 },
  [],
);

RulesManager.createRule<trippleBondAngleAlgorithmType>(
  "Tripple Bond Angle",
  trippleBondAngleAlgorithm,
  { angleDiffError: 0.5, fixingRule: false },
  [],
);

RulesManager.createRule<OverlappingBondsConfigType>(
  "Overlapping Bonds",
  overlappingBondsAlgorithm,
  {},
  [],
);

export {
  RulesManager,
  type IRulesManager,
  type OverlappingBondsConfigType,
  type trippleBondAngleAlgorithmType,
  type BondLengthAlgorithmType,
};
