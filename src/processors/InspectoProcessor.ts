import {
  TOKENS,
  type IInspectoProcessor,
  IFileProvider,
  IIndigoProvider,
  ERRORS,
  ERROR_MESSAGES,
  IRulesProcessor,
} from "@infrastructure";
import { inject, injectable } from "inversify";

@injectable()
export class InspectoProcessor implements IInspectoProcessor {
  constructor(
    @inject(TOKENS.FILE_PROVIDER) private readonly _fileProvide: IFileProvider,
    @inject(TOKENS.INDIGO_PROVIDER)
    private readonly _indigoProvider: IIndigoProvider,
    @inject(TOKENS.RULES_PROCESSOR)
    private readonly _rulesProcessor: IRulesProcessor,
  ) {}

  public async applyRulesToMolMoleculeFromFile(
    path: string,
  ): Promise<string[]> {
    const moleculeFileContentResponse =
      await this._fileProvide.getFileContent(path);
    if (
      moleculeFileContentResponse === ERRORS.WRONG_FILE_FORMAT ||
      moleculeFileContentResponse === ERRORS.FILE_READING_FAILURE
    ) {
      throw new Error(ERROR_MESSAGES[moleculeFileContentResponse]);
    } else {
      return [];
    }
  }

  public async applyRulesToMolMolecule(): Promise<void> {}

  private async _handleMoleculeChecking(molecule: string): Promise<string[]> {
    try {
      const ketMolecule =
        await this._indigoProvider.convertToKetFormat(molecule);
      const response =
        await this._rulesProcessor.applyRulesToMolecule(ketMolecule);

      return response;
    } catch (error) {
      // throw a proper exception
      console.error(error);
      throw error;
    }
  }
}
