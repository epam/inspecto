import {
  TOKENS,
  type IInspectoProcessor,
  IFileProvider,
  IIndigoProvider,
  ERRORS,
  ERROR_MESSAGES,
  IMoleculeCheckerProvider,
} from "@infrastructure";
import { inject, injectable } from "inversify";

@injectable()
export class InspectoProcessor implements IInspectoProcessor {
  constructor(
    @inject(TOKENS.FILE_PROVIDER) private readonly _fileProvide: IFileProvider,
    @inject(TOKENS.INDIGO_PROVIDER)
    private readonly _indigoProvider: IIndigoProvider,
    @inject(TOKENS.MOLECULE_CHECKER_PROVIDER)
    private readonly _moleculeChecker: IMoleculeCheckerProvider,
  ) {}

  public async checkMoleculeFromFileForRules(path: string): Promise<string[]> {
    const moleculeFileContentResponse =
      await this._fileProvide.getFileContent(path);
    if (moleculeFileContentResponse === ERRORS.WRONG_FILE_FORMAT) {
      throw new Error(ERROR_MESSAGES[moleculeFileContentResponse]);
    } else {
      return await this._handleMoleculeChecking(moleculeFileContentResponse);
    }
  }

  public async checkMoleculeForRules(): Promise<void> {}

  private async _handleMoleculeChecking(molecule: string): Promise<string[]> {
    try {
      const ketMolecule =
        await this._indigoProvider.convertToKetFormat(molecule);
      const response =
        await this._moleculeChecker.checkKetMolecule(ketMolecule);

      return response as string[];
    } catch (error) {
      // throw a proper exception
      console.error(error);
      throw error;
    }
  }
}
