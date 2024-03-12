import {
  TOKENS,
  type IInspectoProcessor,
  IConverterProvider,
  IDataModelProcessor,
  type InspectoResults,
  ERROR_MESSAGES,
  ERRORS,
} from "@infrastructure";
import { inject, injectable } from "inversify";
import { type Structure } from "../models";
import { type Rule } from "@models";

@injectable()
export class InspectoProcessor implements IInspectoProcessor {
  constructor(
    @inject(TOKENS.CONVERTER_PROVIDER)
    private readonly _converterProvider: IConverterProvider,
    @inject(TOKENS.DATA_MODEL_PROCESSOR)
    private readonly _dataModelProcessor: IDataModelProcessor,
  ) {}

  public async convertFileContentToStructure(
    fileContent: string | Buffer,
  ): Promise<Structure> {
    try {
      const ketMolecule =
        await this._converterProvider.convertToKetFormat(fileContent);

      const structureDataModel: Structure =
        this._dataModelProcessor.createDataModel(ketMolecule);

      return structureDataModel;
    } catch (error) {
      // throw a proper exception
      console.error(error);
      throw error;
    }
  }

  public async applyRulesToStructure(
    rules: Array<Rule<any>>,
    structure: Structure | string,
  ): Promise<InspectoResults> {
    try {
      if (rules?.length === 0) {
        throw new Error(ERROR_MESSAGES[ERRORS.RULES_ARE_REQUIRED_PROPERTY]);
      }

      if (typeof structure === "string" || Buffer.isBuffer(structure)) {
        structure = await this.convertFileContentToStructure(structure);
      }

      const output: InspectoResults = {};

      for (const rule of rules) {
        const data = rule.applyRule(structure);
        output[rule.name] = {
          hasErrors: !(data.length === 0),
          data,
        };
      }

      return output;
    } catch (error) {
      // throw a proper exception
      console.error(error);
      throw error;
    }
  }
}
