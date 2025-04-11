/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { type Structure } from "@models";
import { type Rule } from "@rules/models";

export type RulesValidationResults = {
  isFixable?: boolean;
  fixMeta?: FixMeta;
  errorCode: string;
  message?: string;
  url?: string;
  path: string;
};

export type FixMeta = {
  requireUserInput: boolean;
  type: string;
  initialValue: string;
  prompt: string;
};

export type InspectoResults = Record<
  string,
  {
    hasErrors: boolean;
    data: RulesValidationResults[];
  }
>;

export type FixingScope = {
  path: string;
  errorCode: string;
  data: any;
};

export interface IInspectoProcessor {
  convertFileContentToStructure: (fileContent: string) => Promise<Structure>;
  applyRulesToStructure: (
    rules: Array<Rule<any>>,
    structure: Structure | string
  ) => Promise<{
    validation: InspectoResults;
    structure: Structure;
  }>;
  structureToKet: (structure: Structure) => string;
}

export interface IConverterProvider {
  convertToKetFormat: (structure: string) => Promise<string>;
}

export interface IDataModelProcessor {
  createDataModel: (structure: string) => Structure;
  dataModelToKet: (structure: Structure) => string;
}
