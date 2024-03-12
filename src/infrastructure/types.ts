/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { type Rule, type Structure } from "@models";

export type RulesValidationResults = {
  message: string;
  path: string;
};

export type InspectoResults = Record<string, RulesValidationResults[]>;
export interface IInspectoProcessor {
  convertFileContentToStructure: (fileContent: string) => Promise<Structure>;
  applyRulesToStructure: (
    rules: Rule[],
    structure: Structure,
  ) => Promise<InspectoResults>;
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

export type RuleAlgorithm = (structure: Structure) => RulesValidationResults[];
