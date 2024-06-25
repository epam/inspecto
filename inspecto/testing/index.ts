import type { Structure } from "../..";
import IndigoModule from "indigo-ketcher";
import { DataModelProcessor } from "@processors";
import { type BondLengthAlgorithmType, bondLengthAlgorithm } from "@rules/algorithms/bondLength";
import { Rule } from "@rules/models/Rule";
import { RulesManager } from "@rules";
import { type RulesValidationResults } from "@infrastructure";
import { valenceAlgorithm, type ValenceAlgorithmType } from "@rules/algorithms/valence";
import { type CovalentCounterionAlgorithmType, covalentCounterionAlgorithm } from "@rules/algorithms";
import { type AliasAlgorithmType, aliasAlgorithm } from "@rules/algorithms/alias";

const indigoModule = IndigoModule();
const dataProcessor = new DataModelProcessor();

export function ketToStructure(ketcher: string): Structure {
  const structure: Structure = dataProcessor.createDataModel(ketcher);
  return structure;
}

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
  Valence = "Valence",
  CovalentCounterion = "Covalent Counterion",
  Alias = "Alias",
}

interface RuleTypes {
  [RuleNames.BondLength]: BondLengthAlgorithmType;
  [RuleNames.Valence]: ValenceAlgorithmType;
  [RuleNames.CovalentCounterion]: CovalentCounterionAlgorithmType;
  [RuleNames.Alias]: AliasAlgorithmType;
}
const RULES: {
  [key in RuleNames]: (config?: RuleTypes[key]) => Rule<RuleTypes[key]>;
} = {
  [RuleNames.BondLength]: (config?: BondLengthAlgorithmType) => {
    return new Rule<BondLengthAlgorithmType>(
      "Bond Length",
      bondLengthAlgorithm,
      config ?? {
        bondLength: 2,
        differenceError: 0.1,
      }
    );
  },
  [RuleNames.Valence]: (config?: ValenceAlgorithmType) => {
    return new Rule<ValenceAlgorithmType>("Valence", valenceAlgorithm, config ?? {});
  },
  [RuleNames.CovalentCounterion]: (config?: CovalentCounterionAlgorithmType) => {
    return new Rule<CovalentCounterionAlgorithmType>("Covalent Counterion", covalentCounterionAlgorithm, config ?? {});
  },
  [RuleNames.Alias]: (config?: AliasAlgorithmType) => {
    return new Rule<AliasAlgorithmType>("Alias", aliasAlgorithm, config ?? {});
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

export function getRule<T extends RuleNames>(ruleName: T, config?: RuleTypes[T]): TestRuleWrapper<T> {
  return new TestRuleWrapper(RULES[ruleName](config));
}
