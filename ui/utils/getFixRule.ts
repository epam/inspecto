import { type RulesValidationResults } from "@infrastructure";
import { type Rule, RulesManager } from "@rules";

export function getFixRule(
  ruleName: string,
  validationResult: RulesValidationResults,
  overwriteFixingScope: boolean = true
): Rule<any> | null {
  const enabledRules = RulesManager.getAllRules().filter(rule => rule.name === ruleName);
  let data = null;
  if (validationResult.fixMeta?.requireUserInput === true) {
    data = prompt(validationResult.fixMeta?.prompt);
    if (data === null) {
      return null;
    }
  }
  if (enabledRules.length !== 1) {
    return null;
  }
  if (overwriteFixingScope) {
    enabledRules[0].getOriginalConfig().fixingScope = [
      {
        path: validationResult.path,
        errorCode: validationResult.errorCode,
        data,
      },
    ];
  } else {
    enabledRules[0].getOriginalConfig().fixingScope = enabledRules[0].getOriginalConfig().fixingScope ?? [];
    enabledRules[0].getOriginalConfig().fixingScope.push({
      path: validationResult.path,
      errorCode: validationResult.errorCode,
      data,
    });
  }
  return enabledRules[0];
}
