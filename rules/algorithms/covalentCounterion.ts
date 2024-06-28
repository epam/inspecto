import { type RuleAlgorithm } from "@rules/infrastructure";
import { alkaliBondsAlgorithm } from "./alkaliBonds";
import { berilliumBondsAlgorithm } from "./berilliumBonds";
import { singleCovalentBondsAlgorithm } from "./singleCovalentBonds";
import { doubleCovalentBondsAlgorithm } from "./doubleCovalentBonds";
import { type FixingScope } from "@infrastructure";

export interface CovalentCounterionAlgorithmType {
  fixingRule?: boolean;
  fixingScope?: FixingScope[];
}

export const covalentCounterionAlgorithm: RuleAlgorithm<CovalentCounterionAlgorithmType> = (structure, config) => {
  return [
    ...alkaliBondsAlgorithm(structure, config),
    ...berilliumBondsAlgorithm(structure, config),
    ...singleCovalentBondsAlgorithm(structure, config),
    ...doubleCovalentBondsAlgorithm(structure, config),
  ];
};
