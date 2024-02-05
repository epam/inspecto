import { ERRORS, type IFileProvider } from "@infrastructure";
import { injectable } from "inversify";
import { readFile } from "node:fs/promises";

@injectable()
export class FileProvider implements IFileProvider {
  public async getFileContent(
    path: string,
  ): Promise<Buffer | ERRORS.WRONG_FILE_FORMAT | ERRORS.FILE_READING_FAILURE> {
    const isSupportedFormat = this._validateFileFormat(path);

    if (isSupportedFormat) {
      try {
        return await readFile(path);
      } catch (error) {
        console.error(error);

        return ERRORS.FILE_READING_FAILURE;
      }
    }

    return ERRORS.WRONG_FILE_FORMAT;
  }

  private static get _SUPPORTED_FORMATS(): string[] {
    return ["ket"];
  }

  private _validateFileFormat(path: string): boolean {
    const parts = path.split(".");
    const fileFormat = parts[parts.length - 1].toLowerCase();

    return FileProvider._SUPPORTED_FORMATS.includes(fileFormat);
  }
}
