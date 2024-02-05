import {
  TOKENS,
  type IInspectoProcessor,
  IFileProvider,
  IIndigoProvider,
  ERRORS,
  ERROR_MESSAGES,
} from "@infrastructure";
import { inject, injectable } from "inversify";

@injectable()
export class InspectoProcessor implements IInspectoProcessor {
  constructor(
    @inject(TOKENS.FILE_PROVIDER) private readonly _fileProvide: IFileProvider,
    @inject(TOKENS.INDIGO_PROVIDER)
    private readonly _indigoProvider: IIndigoProvider,
  ) {}

  public async checkMoleculeFromFileForRules(path: string): Promise<void> {
    const moleculeFileContentResponse =
      await this._fileProvide.getFileContent(path);
    if (moleculeFileContentResponse === ERRORS.WRONG_FILE_FORMAT) {
      throw new Error(ERROR_MESSAGES[moleculeFileContentResponse]);
    } else {
      try {
        const ketMolecule = await this._indigoProvider.convertToKetFormat(
          moleculeFileContentResponse,
        );
        console.log(ketMolecule);
      } catch (error) {
        // throw a proper exception
      }
    }
  }

  public async checkMoleculeForRules(): Promise<void> {}
}
