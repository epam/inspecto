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
  const originalConfigRef = enabledRule.getOriginalConfig();
  if (overwriteFixingScope) {
    originalConfigRef.fixingScope = [
      {
        path: validationResult.path,
        errorCode: validationResult.errorCode,
        data,
      },
    ];
  } else {
    originalConfigRef.fixingScope = originalConfigRef.fixingScope ?? [];
    originalConfigRef.fixingScope.push({
      path: validationResult.path,
      errorCode: validationResult.errorCode,
      data,
    });
  }
  return enabledRule;
}
