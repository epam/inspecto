import "reflect-metadata";
import { Container } from "inversify";

import {
  TOKENS,
  type IInspectoProcessor,
  type IFileProvider,
} from "@infrastructure";
import { InspectoProcessor } from "@processors";
import { FileProvider } from "@providers";

export const createContainer = (): Container => {
  const container = new Container();

  // processors
  container
    .bind<IInspectoProcessor>(TOKENS.INSPECTO_PROCESSOR)
    .to(InspectoProcessor);

  // providers
  container.bind<IFileProvider>(TOKENS.FILE_PROVIDER).to(FileProvider);

  return container;
};
