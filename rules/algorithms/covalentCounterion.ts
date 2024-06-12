import { type RuleAlgorithm } from "@rules/infrastructure";
import { alkaliBondsAlgorithm } from "./alkaliBonds";
import { berilliumBondsAlgorithm } from "./berilliumBonds";

export interface CovalentCounterionAlgorithmType {
  fixingRule?: boolean;
}

export const covalentCounterionAlgorithm: RuleAlgorithm<CovalentCounterionAlgorithmType> = (structure, config) => {
  return [...alkaliBondsAlgorithm(structure, config), ...berilliumBondsAlgorithm(structure, config)];
};
