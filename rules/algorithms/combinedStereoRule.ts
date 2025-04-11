import type { FixingScope, RulesValidationResults } from "@infrastructure";
import { stereoLabelDoubleBondAlgorithm } from "./stereoLabelDoubleBond";
import type { RuleAlgorithm } from "@rules/infrastructure";
import { StereoLabelTetrahedralCenterRule } from "./stereoLabelTetrahedralCenter";
import { Structure } from "@models";

export interface CombinedStereoRuleConfig {
  fixingRule?: boolean;
  fixingScope?: FixingScope[];
}

export const combinedStereoRuleAlgorithm: RuleAlgorithm<CombinedStereoRuleConfig> = (
  structure: Structure,
  config?: CombinedStereoRuleConfig
): RulesValidationResults[] => {
  let output: RulesValidationResults[] = [];
  let previousOutputLength = 0;

  if (!(structure instanceof Structure)) {
    throw new Error("Invalid structure type");
  }

  do {
    previousOutputLength = output.length;
    const newResults: RulesValidationResults[] = [];

    const doubleBondResults = stereoLabelDoubleBondAlgorithm(structure, config ?? {});
    newResults.push(...doubleBondResults);

    const tetrahedralRule = new StereoLabelTetrahedralCenterRule(config ?? {});
    const tetrahedralResults = tetrahedralRule.verify(structure);
    newResults.push(...tetrahedralResults);

    output = handleCombinedStereoResults([...output, ...newResults]);
  } while (output.length > previousOutputLength);

  return output;
};

function handleCombinedStereoResults(results: RulesValidationResults[]): RulesValidationResults[] {
  const combinedResults: RulesValidationResults[] = [];

  results.forEach(result => {
    const existingResult = combinedResults.find(r => r.path === result.path && r.errorCode === result.errorCode);

    if (existingResult?.message !== result.message) {
      console.warn(`Conflict detected for path ${result.path}: ${existingResult?.message} vs ${result.message}`);
      if ((result.message?.length ?? 0) > (existingResult?.message?.length ?? 0)) {
        if (existingResult !== undefined && existingResult !== null) {
          existingResult.message = result.message;
        }
      }
    } else if (existingResult === undefined && existingResult === null) {
      combinedResults.push(result);
    }
  });

  return combinedResults;
}
