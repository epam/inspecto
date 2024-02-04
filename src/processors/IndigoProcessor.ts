import { type IIndigoProcessor } from "@infrastructure";
import { injectable } from "inversify";

@injectable()
export class IndigoProcessor implements IIndigoProcessor {
  public async checkMoleculeFromFileForRules(path: string): Promise<void> {}

  public async checkMoleculeForRules(): Promise<void> {}
}
