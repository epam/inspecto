import type { FixingScope, RulesValidationResults } from "@infrastructure";
import type { Structure } from "@models";

export interface RuleConfig {
  fixingRule?: boolean;
  fixingScope?: FixingScope[];
}
export interface RuleDocs {
  name: string;
  description: string;
  url: string;
}

export abstract class BaseRule<T extends RuleConfig> {
  declare static docs: RuleDocs;
  declare config: T;
  constructor(config: T) {
    this.config = config;
  }

  abstract verify(structure: Structure): RulesValidationResults[];
}

export type ConcreteRuleClass<T extends RuleConfig> = new (config: T) => BaseRule<T>;
