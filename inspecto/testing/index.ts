import type { Structure } from "../..";
import IndigoModule from "indigo-ketcher";
import { DataModelProcessor } from "@processors";
import { type Rule } from "@rules/models/Rule";
import { RulesManager } from "@rules";
import { type Rules as RuleNames, type RulesValidationResults } from "@infrastructure";
import { type Registry } from "@rules/infrastructure";

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

class TestRuleWrapper<T extends RuleNames> {
  rule: Rule<Registry[T]>;
  constructor(rule: Rule<Registry[T]>) {
    this.rule = rule;
  }

  verify(structure: Structure): RulesValidationResults[] {
    const result = RulesManager.applyRule(this.rule, structure);
    if (!Array.isArray(result)) {
      throw new Error("Rule verification failed, incorrect rule output");
    }
    return result;
  }

  configure(config: Partial<Registry[T]>): this {
    RulesManager.updateRuleConfig(this.rule, config);
    return this;
  }
}

export function getRule<T extends RuleNames>(ruleName: T, config?: Registry[T]): TestRuleWrapper<T> {
  const rule = RulesManager.getRuleByName(ruleName);
  if (rule === null) {
    throw new Error(`Rule ${ruleName} not found`);
  }
  if (config !== undefined) {
    RulesManager.updateRuleConfig(rule, config);
  }
  return new TestRuleWrapper<T>(rule);
}
