import { container } from "@rules/inversify.config";
import { type IRulesManager, RULES_TOKENS } from "@rules/infrastructure";
import {
  bondLengthAlgorithm,
  trippleBondAngleAlgorithm,
  overlappingBondsAlgorithm,
  valenceAlgorithm,
  type OverlappingBondsConfigType,
  type trippleBondAngleAlgorithmType,
  type BondLengthAlgorithmType,
} from "@rules/algorithms";
import type { ValenceAlgorithmType } from "./algorithms/valence";
import { alkaliBondsAlgorithm, type alkaliBondsAlgorithmType } from "./algorithms/alkaliBonds";

export { Rule } from "./models/Rule";

const RulesManager = container.get<IRulesManager>(RULES_TOKENS.RULES_MANAGER);

RulesManager.createRule<ValenceAlgorithmType>("Valence", valenceAlgorithm, { fixingRule: false }, []);

RulesManager.createRule<alkaliBondsAlgorithmType>("Alkali Bonds", alkaliBondsAlgorithm, { fixingRule: false }, []);

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
  type BondLengthAlgorithmType,
  type alkaliBondsAlgorithmType,
};
