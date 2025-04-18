import "reflect-metadata";
import { Container } from "inversify";

import {
  TOKENS,
  type IInspectoProcessor,
  type IConverterProvider,
  type IDataModelProcessor,
} from "@infrastructure";
import { DataModelProcessor, InspectoProcessor } from "@processors";
import { ConverterProvider } from "@providers";

export const createContainer = (): Container => {
  const container = new Container({ defaultScope: "Singleton" });

  // processors
  container
    .bind<IInspectoProcessor>(TOKENS.INSPECTO_PROCESSOR)
    .to(InspectoProcessor);
  container
    .bind<IDataModelProcessor>(TOKENS.DATA_MODEL_PROCESSOR)
    .to(DataModelProcessor);

  // providers
  container
    .bind<IConverterProvider>(TOKENS.CONVERTER_PROVIDER)
    .to(ConverterProvider);

  return container;
};
