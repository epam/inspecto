import "reflect-metadata";
import { Container } from "inversify";

import {
  TOKENS,
  type IInspectoProcessor,
  type IFileProvider,
  type IMoleculeCheckerProvider,
} from "@infrastructure";
import { InspectoProcessor } from "@processors";
import { FileProvider } from "@providers";
import { MoleculeChecker } from "./providers/MoleculeCheckerProvider";

export const createContainer = (): Container => {
  const container = new Container();

  // processors
  container
    .bind<IInspectoProcessor>(TOKENS.INSPECTO_PROCESSOR)
    .to(InspectoProcessor);

  // providers
  container.bind<IFileProvider>(TOKENS.FILE_PROVIDER).to(FileProvider);
  container
    .bind<IMoleculeCheckerProvider>(TOKENS.MOLECULE_CHECKER_PROVIDER)
    .to(MoleculeChecker);

  return container;
};
