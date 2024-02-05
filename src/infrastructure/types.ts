import { type ERRORS } from "@infrastructure";

export interface IInspectoProcessor {
  applyRulesToMolMolecule: () => Promise<void>;
  applyRulesToMolMoleculeFromFile: (path: string) => Promise<string[]>;
}

export interface IFileProvider {
  getFileContent: (
    path: string,
  ) => Promise<Buffer | ERRORS.WRONG_FILE_FORMAT | ERRORS.FILE_READING_FAILURE>;
}

export interface IIndigoProvider {
  convertToKetFormat: (molecule: string) => Promise<string>;
}

export interface IRulesProcessor {
  applyRulesToMolecule: (molecule: string) => Promise<string[]>;
}
