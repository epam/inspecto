import { TOKENS, type IInspectoProcessor, type IConverterProvider, type IDataModelProcessor } from "@infrastructure";
import { DataModelProcessor, InspectoProcessor } from "@processors";
import { ConverterProvider } from "@providers";

export const createDependencies = (): {
  [TOKENS.INSPECTO_PROCESSOR]: IInspectoProcessor;
  [TOKENS.DATA_MODEL_PROCESSOR]: IDataModelProcessor;
  [TOKENS.CONVERTER_PROVIDER]: IConverterProvider;
} => {
  // Manually create instances and wire dependencies
  const converterProvider: IConverterProvider = new ConverterProvider();
  const dataModelProcessor: IDataModelProcessor = new DataModelProcessor();
  const inspectoProcessor: IInspectoProcessor = new InspectoProcessor(converterProvider, dataModelProcessor);

  return {
    [TOKENS.INSPECTO_PROCESSOR]: inspectoProcessor,
    [TOKENS.DATA_MODEL_PROCESSOR]: dataModelProcessor,
    [TOKENS.CONVERTER_PROVIDER]: converterProvider,
  };
};
