/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { type Structure } from "@models";
import { type Rule } from "@rules/models";

export type RulesValidationResults = {
  isFixable?: boolean;
  errorCode?: string;
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
    structure: Structure
  ) => Promise<{
    validation: InspectoResults;
    structure: Structure;
  }>;
  structureToKet: (structure: Structure) => string;
}

export interface IConverterProvider {
  convertToKetFormat: (structure: string | Buffer) => Promise<string>;
}

export interface IDataModelProcessor {
  createDataModel: (structure: string) => Structure;
  dataModelToKet: (structure: Structure) => string;
}
