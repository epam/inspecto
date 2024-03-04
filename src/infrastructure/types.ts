import { type Rule, type Structure } from "@models";

export type InspectoResults = Record<string, string[]>;
export interface IInspectoProcessor {
  applyRulesToStructure: (
    structure: string,
    rules?: Rule[],
  ) => Promise<InspectoResults>;
}

export interface IConverterProvider {
  convertToKetFormat: (structure: string) => Promise<string>;
}

export interface IDataModelProcessor {
  createDataModel: (structure: string) => Structure;
}

export interface IPresentable {
  toJSON: () => Record<string, unknown>;
}

export type RuleAlgorithm = (structure: Structure) => string[];
