import { inject, injectable } from "inversify";

import {
  TOKENS,
  type IInspectoProcessor,
  IConverterProvider,
  IDataModelProcessor,
  type InspectoResults,
  ERROR_MESSAGES,
  ERRORS,
} from "@infrastructure";
import { type Structure } from "../models";
import { type Rule } from "@rules/models";
import { RulesManager } from "@rules";

@injectable()
export class InspectoProcessor implements IInspectoProcessor {
  constructor(
    @inject(TOKENS.CONVERTER_PROVIDER)
    private readonly _converterProvider: IConverterProvider,
    @inject(TOKENS.DATA_MODEL_PROCESSOR)
    private readonly _dataModelProcessor: IDataModelProcessor
  ) {}

  public async convertFileContentToStructure(fileContent: string): Promise<Structure> {
    try {
      let ketFile;
      if (this.isKetFile(fileContent)) {
        ketFile = fileContent;
      } else {
        ketFile = await this._converterProvider.convertToKetFormat(fileContent);
      }
      const structureDataModel: Structure = this._dataModelProcessor.createDataModel(ketFile);

      return structureDataModel;
    } catch (error) {
      // throw a proper exception
      console.error(error);
      throw error;
    }
  }

  public async applyRulesToStructure(
    rules: Array<Rule<any>>,
    structure: Structure | string
  ): Promise<{
    validation: InspectoResults;
    structure: Structure;
  }> {
    try {
      if (rules?.length === 0) {
        throw new Error(ERROR_MESSAGES[ERRORS.RULES_ARE_REQUIRED_PROPERTY]);
      }

      if (typeof structure === "string") {
        structure = await this.convertFileContentToStructure(structure);
      }

      const output: InspectoResults = {};

      for (const rule of rules) {
        const data = RulesManager.applyRule(rule, structure);
        output[rule.name] = {
          hasErrors: !(data.length === 0),
          data,
        };
      }

      return {
        validation: output,
        structure,
      };
    } catch (error) {
      // throw a proper exception
      console.error(error);
      throw error;
    }
  }

  public structureToKet(structure: Structure): string {
    return this._dataModelProcessor.dataModelToKet(structure);
  }

  private isKetFile(value: string): boolean {
    try {
      const file = JSON.parse(value);
      return "root" in file;
    } catch {
      return false;
    }
  }
}
