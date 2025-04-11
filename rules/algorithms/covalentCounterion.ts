import { type RuleAlgorithm } from "@rules/infrastructure";
import { alkaliBondsAlgorithm } from "./alkaliBonds";
import { berilliumBondsAlgorithm } from "./berilliumBonds";
import { singleCovalentBondsAlgorithm } from "./singleCovalentBonds";
import { doubleCovalentBondsAlgorithm } from "./doubleCovalentBonds";
import type { RuleConfig } from "./base";

export interface CovalentCounterionRuleConfig extends RuleConfig {}

export const covalentCounterionAlgorithm: RuleAlgorithm<CovalentCounterionRuleConfig> = (structure, config) => {
  return [
    ...alkaliBondsAlgorithm(structure, config),
    ...berilliumBondsAlgorithm(structure, config),
    ...singleCovalentBondsAlgorithm(structure, config),
    ...doubleCovalentBondsAlgorithm(structure, config),
  ];
};
