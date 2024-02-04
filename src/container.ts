import "reflect-metadata";
import { Container } from "inversify";

import { TOKENS, type IIndigoProcessor } from "@infrastructure";
import { IndigoProcessor } from "@processors";

export const createContainer = (): Container => {
  const container = new Container();

  // processors
  container.bind<IIndigoProcessor>(TOKENS.INDIGO_PROCESSOR).to(IndigoProcessor);

  return container;
};
