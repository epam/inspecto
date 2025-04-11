import {
  TOKENS,
  type IInspectoProcessor,
  IConverterProvider,
  IDataModelProcessor,
} from "@infrastructure";
import { inject, injectable } from "inversify";

@injectable()
export class InspectoProcessor implements IInspectoProcessor {
  constructor(
    @inject(TOKENS.CONVERTER_PROVIDER)
    private readonly _converterProvider: IConverterProvider,
    @inject(TOKENS.DATA_MODEL_PROCESSOR)
    private readonly _dataModelProcessor: IDataModelProcessor,
  ) {}

  public async applyRulesToMolecule(structure: string): Promise<string[]> {
    try {
      const ketMolecule =
        await this._converterProvider.convertToKetFormat(structure);

      this._dataModelProcessor.createDataModel(ketMolecule);
      return [];
    } catch (error) {
      // throw a proper exception
      console.error(error);
      throw error;
    }
  }
}
