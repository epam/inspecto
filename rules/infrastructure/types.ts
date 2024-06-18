import { type RulesValidationResults } from "@inspecto/infrastructure";
import { type Structure } from "@inspecto/models";
import { type Rule } from "@rules/models";

export type RuleAlgorithm<TConfig> = (structure: Structure, config: TConfig) => RulesValidationResults[];

export interface IRulesManager {
  applyRule: (rule: Rule<any>, structure: Structure) => RulesValidationResults[];
  getAllRules: () => Array<Rule<any>>;
  createRule: <TConfig extends object>(
    name: string,
    algorithm: RuleAlgorithm<TConfig>,
    config: TConfig,
    tags?: string[],
    description?: string
  ) => Rule<TConfig>;
  updateRuleConfig: <TConfig extends object>(rule: Rule<TConfig>, config: Partial<TConfig>) => void;
  getRuleByName: (ruleName: string) => Rule<any> | null;
  getRulesByTags: (tags: string[]) => Array<Rule<any>>;
  getRulesMeta: () => Array<Pick<Rule<any>, "name" | "tags" | "description">>;
}
