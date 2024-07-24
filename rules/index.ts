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
import { type AliasAlgorithmType, aliasAlgorithm } from "./algorithms/alias";
import { Rules } from "@infrastructure";
import { type BondAngleAlgorithmType, bondAngleAlgorithm } from "./algorithms/bondAngle";

export { Rule } from "./models/Rule";

const RulesManager = container.get<IRulesManager>(RULES_TOKENS.RULES_MANAGER);

RulesManager.createRule<ValenceAlgorithmType>(Rules.Valence, valenceAlgorithm, {}, []);

RulesManager.createRule<CovalentCounterionAlgorithmType>(
  Rules.CovalentCounterion,
  covalentCounterionAlgorithm,
  { fixingRule: false },
  []
);

RulesManager.createRule<BondLengthAlgorithmType>(
  Rules.BondLength,
  bondLengthAlgorithm,
  { bondLength: 1, differenceError: 0.01, fixingRule: false },
  []
);

RulesManager.createRule<trippleBondAngleAlgorithmType>(
  Rules.TrippleBondAngle,
  trippleBondAngleAlgorithm,
  { angleDiffError: 0.5, fixingRule: false },
  []
);

RulesManager.createRule<AliasAlgorithmType>(Rules.Alias, aliasAlgorithm, { fixingRule: false }, []);

RulesManager.createRule<BondAngleAlgorithmType>(Rules.BondAngle, bondAngleAlgorithm, { fixingRule: false }, []);

RulesManager.createRule<OverlappingBondsConfigType>(Rules.OverlappingBonds, overlappingBondsAlgorithm, {}, []);

export {
  RulesManager,
  type IRulesManager,
  type OverlappingBondsConfigType,
  type trippleBondAngleAlgorithmType,
  type CovalentCounterionAlgorithmType,
};
