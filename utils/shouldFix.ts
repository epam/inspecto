import { type FixingScope } from "@infrastructure";
import { type RuleConfig } from "@rules/algorithms/base";

export const shouldFix = (config: RuleConfig, errorCode: string, path: string): boolean => {
  const fixingScope = config.fixingScope?.find(
    (scope: FixingScope) => scope.errorCode === errorCode && scope.path === path
  );

  return config.fixingRule === true || fixingScope !== undefined;
};
