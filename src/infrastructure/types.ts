/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { type Rule, type Structure } from "@models";

export type RulesValidationResults = {
  message?: string;
  path: string;
};

export type InspectoResults = Record<
  string,
  {
    hasErrors: boolean;
    data: RulesValidationResults[];
  }
>;

export interface IInspectoProcessor {
  convertFileContentToStructure: (fileContent: string) => Promise<Structure>;
  applyRulesToStructure: (
    rules: Array<Rule<any>>,
    structure: Structure,
  ) => Promise<{
    validation: InspectoResults;
    structure: Structure;
  }>;
}

export interface IConverterProvider {
  convertToKetFormat: (structure: string | Buffer) => Promise<string>;
}

export interface IDataModelProcessor {
  createDataModel: (structure: string) => Structure;
}

export interface IPresentable {
  toJSON: () => Record<string, unknown>;
}

export type RuleAlgorithm<TConfig> = (
  structure: Structure,
  config: TConfig,
) => RulesValidationResults[];
