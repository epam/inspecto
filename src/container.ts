import "reflect-metadata";
import { Container } from "inversify";

import {
  TOKENS,
  type IInspectoProcessor,
  type IFileProvider,
  type IRulesProcessor,
} from "@infrastructure";
import { InspectoProcessor } from "@processors";
import { FileProvider } from "@providers";
import { RulesProcessor } from "./processors/RulesProcessor";

export const createContainer = (): Container => {
  const container = new Container({ defaultScope: "Singleton" });

  // processors
  container
    .bind<IInspectoProcessor>(TOKENS.INSPECTO_PROCESSOR)
    .to(InspectoProcessor);
  container.bind<IRulesProcessor>(TOKENS.RULES_PROCESSOR).to(RulesProcessor);

  // providers
  container.bind<IFileProvider>(TOKENS.FILE_PROVIDER).to(FileProvider);

  return container;
};
