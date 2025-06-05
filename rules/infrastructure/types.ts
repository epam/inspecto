import { type RulesValidationResults } from "@inspecto/infrastructure";
import { type Structure } from "@inspecto/models";
import type { ConcreteRuleClass, RuleConfig } from "@rules/algorithms/base";
import { type Rule } from "@rules/models";
import type { Rules as RuleNames } from "@inspecto/infrastructure/rules";
import type { Registry } from "@rules/infrastructure";

export type RuleAlgorithm<TConfig> = (structure: Structure, config: TConfig) => RulesValidationResults[];

export interface IRulesManager {
  applyRule: (rule: Rule<any>, structure: Structure) => RulesValidationResults[];
  getAllRules: () => Array<Rule<any>>;
  createRule: <TConfig extends RuleConfig>(
    name: RuleNames,
    algorithm: RuleAlgorithm<TConfig> | ConcreteRuleClass<TConfig>,
    config: TConfig,
    tags?: string[],
    description?: string,
  ) => Rule<TConfig>;
  updateRuleConfig: <TConfig extends RuleConfig>(rule: Rule<TConfig>, config: Partial<TConfig>) => void;
  getRuleByName: <T extends RuleNames>(ruleName: T) => Rule<Registry[T]> | null;
  getRulesByTags: (tags: string[]) => Array<Rule<any>>;
  getRulesMeta: () => Array<Pick<Rule<any>, "name" | "tags" | "description">>;
}
