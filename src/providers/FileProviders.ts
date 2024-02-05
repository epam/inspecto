import { type ERRORS, type IFileProvider } from "@infrastructure";
import { injectable } from "inversify";

@injectable()
export class FileProvider implements IFileProvider {
  public async getFileContent(path: string): Promise<string | ERRORS> {
    return "success";
  }
}
