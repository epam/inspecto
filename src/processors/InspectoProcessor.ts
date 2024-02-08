import {
  TOKENS,
  type IInspectoProcessor,
  IConverterProvider,
  IDataModelProcessor,
  type InspectoResults,
} from "@infrastructure";
import { inject, injectable } from "inversify";
import { type Structure } from "../models";
import { type Rule } from "@models";
import { defaultRules } from "../defaultRules";

@injectable()
export class InspectoProcessor implements IInspectoProcessor {
  constructor(
    @inject(TOKENS.CONVERTER_PROVIDER)
    private readonly _converterProvider: IConverterProvider,
    @inject(TOKENS.DATA_MODEL_PROCESSOR)
    private readonly _dataModelProcessor: IDataModelProcessor,
  ) {}

  public async applyRulesToStructure(
    structure: string,
    rules?: Rule[],
  ): Promise<InspectoResults> {
    try {
      const ketMolecule =
        await this._converterProvider.convertToKetFormat(structure);

      const structureDataModel: Structure =
        this._dataModelProcessor.createDataModel(ketMolecule);

      const targetRules = rules ?? defaultRules;

      const output: InspectoResults = {};

      for (const rule of targetRules) {
        output[rule.name] = rule.applyRule(structureDataModel);
      }

      return output;
    } catch (error) {
      // throw a proper exception
      console.error(error);
      throw error;
    }
  }
}
