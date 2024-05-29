import type { Structure } from "../..";
import IndigoModule from "indigo-ketcher";
import { DataModelProcessor } from "@processors";
import {
  type BondLengthAlgorithmType,
  bondLengthAlgorithm,
} from "@rules/algorithms/bondLength";
import { Rule } from "@rules/models/Rule";
import { RulesManager } from "@rules";
import { type RulesValidationResults } from "@infrastructure";

const indigoModule = IndigoModule();
const dataProcessor = new DataModelProcessor();

export async function toStructure(str: string): Promise<Structure> {
  const indigo = await indigoModule;
  const options = new indigo.MapStringString();
  const ket = indigo.convert(str, "ket", options);
  options.delete();

  const structure: Structure = dataProcessor.createDataModel(ket as string);
  return structure;
}

export enum RuleNames {
  BondLength = "Bond Length",
}

interface RuleTypes {
  [RuleNames.BondLength]: BondLengthAlgorithmType;
}
const RULES = {
  [RuleNames.BondLength]: (config?: BondLengthAlgorithmType) => {
    return new Rule<BondLengthAlgorithmType>(
      "Bond Length",
      bondLengthAlgorithm,
      config ?? {
        bondLength: 2,
        differenceError: 0.1,
      },
    );
  },
};

class TestRuleWrapper<T extends RuleNames> {
  rule: Rule<RuleTypes[T]>;
  constructor(rule: Rule<RuleTypes[T]>) {
    this.rule = rule;
  }

  verify(structure: Structure): RulesValidationResults[] {
    return RulesManager.applyRule(this.rule, structure);
  }

  configure(config: Partial<RuleTypes[T]>): this {
    RulesManager.updateRuleConfig(this.rule, config);
    return this;
  }
}

export function getRule<T extends RuleNames>(
  ruleName: T,
  config?: RuleTypes[T],
): TestRuleWrapper<T> {
  return new TestRuleWrapper(RULES[ruleName](config));
}
