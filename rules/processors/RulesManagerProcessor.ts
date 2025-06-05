import { type RuleAlgorithm, type IRulesManager } from "@rules/infrastructure";
import { Rule } from "@rules/models";
import { type RulesValidationResults } from "@inspecto/infrastructure";
import { type Structure } from "@inspecto/models";
import { BaseRule, type RuleConfig, type ConcreteRuleClass } from "@rules/algorithms/base";

export class RulesManagerProcessor implements IRulesManager {
  private readonly rules: Array<Rule<any>> = [];
  private readonly rulesByName = new Map<string, Rule<any>>();
  private readonly rulesByTag = new Map<string, Array<Rule<any>>>();

  public applyRule(rule: Rule<any>, structure: Structure): RulesValidationResults[] {
    const Algo = rule._algorithm;
    if (Algo.prototype instanceof BaseRule) {
      // Type assertion since we know it's a constructor at this point
      const RuleConstructor = Algo as ConcreteRuleClass<any>;
      const ruleInstance = new RuleConstructor(rule.config);
      return ruleInstance.verify(structure);
    }

    // Type assertion since we know it's a function at this point
    const ruleFunction = Algo as RuleAlgorithm<any>;
    return ruleFunction(structure, rule.config);
  }

  public updateRuleConfig<TConfig extends object>(rule: Rule<TConfig>, config: Partial<TConfig>): void {
    rule.config = { ...rule.config, ...config };
  }

  public getAllRules(): Array<Rule<any>> {
    return [...this.rules];
  }

  public createRule<TConfig extends RuleConfig>(
    name: string,
    algorithm: RuleAlgorithm<TConfig> | ConcreteRuleClass<TConfig>,
    config: TConfig,
    tags?: string[],
    description?: string,
  ): Rule<TConfig> {
    const possibleRule = this.getRuleByName(name);
    if (possibleRule !== null) {
      throw new Error("Name should be unique");
    }
    const rule = new Rule(name, algorithm, config, tags, description);
    this.rules.push(rule);
    this.rulesByName.set(rule.name, rule);
    for (const tag of rule.tags) {
      if (!this.rulesByTag.has(tag)) {
        this.rulesByTag.set(tag, []);
      }
      this.rulesByTag.get(tag)?.push(rule);
    }

    return rule;
  }

  public getRuleByName<TConfig extends object>(ruleName: string): Rule<TConfig> | null {
    return (this.rulesByName.get(ruleName) as Rule<TConfig>) ?? null;
  }

  public getRulesByTags(tags: string[]): Array<Rule<any>> {
    const output: Array<Rule<any>> = [];
    const namesSet = new Set<string>();

    for (const tag of tags) {
      const rulesForTag = this.rulesByTag.get(tag) ?? [];
      for (const rule of rulesForTag) {
        if (!namesSet.has(rule.name)) {
          output.push(rule);
          namesSet.add(rule.name);
        }
      }
    }

    return output;
  }

  public getRulesMeta(): Array<Pick<Rule<any>, "name" | "tags" | "description">> {
    const rules = this.getAllRules();

    return rules.map(({ name, description, tags }) => ({
      name,
      description,
      tags,
    }));
  }
}
