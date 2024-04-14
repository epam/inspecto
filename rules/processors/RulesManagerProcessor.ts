import { injectable } from "inversify";
import { container } from "@rules/inversify.config";

import {
  type RuleAlgorithm,
  type IRulesManager,
  RULES_TOKENS,
} from "@rules/infrastructure";
import { Rule } from "@rules/models";
import { type RulesValidationResults } from "@inspecto/infrastructure";
import { type Structure } from "@inspecto/models";

@injectable()
export class RulesManagerProcessor implements IRulesManager {
  public applyRule(
    rule: Rule<any>,
    structure: Structure,
  ): RulesValidationResults[] {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    return rule["_algorithm"](structure, rule["_config"]);
  }

  public updateRuleConfig<TConfig extends object>(
    rule: Rule<TConfig>,
    config: TConfig,
  ): void {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    rule["_config"] = { ...rule["_config"], ...config };
  }

  public getAllRules(): Array<Rule<any>> {
    return container.getAll(RULES_TOKENS.RULE);
  }

  public createRule<TConfig extends object>(
    name: string,
    algorithm: RuleAlgorithm<TConfig>,
    config: TConfig,
    tags?: string[],
    description?: string,
  ): Rule<TConfig> {
    const possibleRule = this.getRuleByName(name);
    if (possibleRule !== null) {
      throw new Error("Name should be unique");
    }
    const rule = new Rule(name, algorithm, config, tags, description);
    container
      .bind(RULES_TOKENS.RULE)
      .toConstantValue(rule)
      .whenTargetNamed(rule.name);
    for (const tag of rule.tags) {
      container
        .bind(RULES_TOKENS.RULE)
        .toConstantValue(rule)
        .whenTargetNamed(tag);
    }

    return rule;
  }

  public getRuleByName<TConfig extends object>(
    ruleName: string,
  ): Rule<TConfig> | null {
    try {
      const rule = container.getNamed<Rule<TConfig>>(
        RULES_TOKENS.RULE,
        ruleName,
      );
      return rule;
    } catch (error) {
      return null;
    }
  }

  public getRulesByTags(tags: string[]): Array<Rule<any>> {
    const output: Array<Rule<any>> = [];
    const namesSet = new Set<string>();

    for (const tag of tags) {
      try {
        const rules = container.getAllNamed<Rule<any>>(RULES_TOKENS.RULE, tag);
        for (const rule of rules) {
          if (!namesSet.has(rule.name)) {
            output.push(rule);
            namesSet.add(rule.name);
          }
        }
      } catch (error) {}
    }

    return output;
  }

  public getRulesMeta(): Array<
    Pick<Rule<any>, "name" | "tags" | "description">
  > {
    const rules = this.getAllRules();

    return rules.map(({ name, description, tags }) => ({
      name,
      description,
      tags,
    }));
  }
}
