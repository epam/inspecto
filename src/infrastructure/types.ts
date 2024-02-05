import { type ERRORS } from "@infrastructure";

export interface IInspectoProcessor {
  checkMoleculeForRules: () => Promise<void>;
  checkMoleculeFromFileForRules: (path: string) => Promise<void>;
}

export interface IFileProvider {
  getFileContent: (path: string) => Promise<string | ERRORS>;
}

export interface IIndigoProvider {
  convertToKetFormat: (molecule: string) => Promise<string>;
}
