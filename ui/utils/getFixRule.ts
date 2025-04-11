import { type Rules, type RulesValidationResults } from "@infrastructure";
import { Rule, RulesManager } from "@rules";

export function getFixRule(
  ruleName: Rules,
  validationResult: RulesValidationResults,
  overwriteFixingScope: boolean = true
): Rule<any> | null {
  const existingRule = RulesManager.getRuleByName(ruleName);
  if (existingRule === null) {
    return null;
  }
  const enabledRule = new Rule(
    ruleName,
    existingRule._algorithm,
    existingRule.config,
    existingRule.tags,
    existingRule.description
  );
  let data = null;
  if (validationResult.fixMeta?.requireUserInput === true) {
    data = prompt(validationResult.fixMeta?.prompt);
    if (data === null) {
      return null;
    }
  }
  if (overwriteFixingScope) {
    enabledRule.getOriginalConfig().fixingScope = [
      {
        path: validationResult.path,
        errorCode: validationResult.errorCode,
        data,
      },
    ];
  } else {
    enabledRule.getOriginalConfig().fixingScope = enabledRule.getOriginalConfig().fixingScope ?? [];
    enabledRule.getOriginalConfig().fixingScope.push({
      path: validationResult.path,
      errorCode: validationResult.errorCode,
      data,
    });
  }
  return enabledRule;
}
