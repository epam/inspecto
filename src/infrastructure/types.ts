import { type ERRORS } from "@infrastructure";

export interface IInspectoProcessor {
  checkMoleculeForRules: () => Promise<void>;
  checkMoleculeFromFileForRules: (path: string) => Promise<string[]>;
}

export interface IFileProvider {
  getFileContent: (path: string) => Promise<string | ERRORS.WRONG_FILE_FORMAT>;
}

export interface IIndigoProvider {
  convertToKetFormat: (molecule: string) => Promise<string>;
}

export interface IMoleculeCheckerProvider {
  checkKetMolecule: (molecule: string) => Promise<string[] | ERRORS>;
}
