import { type FixingScope } from "@infrastructure";

export const shouldFix = (config: any, errorCode: string, path: string): boolean => {
  const fixingScope = config.fixingScope?.find(
    (scope: FixingScope) => scope.errorCode === errorCode && scope.path === path
  );

  return config.fixingRule === true || fixingScope !== undefined;
};
