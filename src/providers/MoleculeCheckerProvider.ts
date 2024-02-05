import { injectable } from "inversify";
import { type ERRORS, type IMoleculeCheckerProvider } from "@infrastructure";

@injectable()
export class MoleculeChecker implements IMoleculeCheckerProvider {
  public async checkKetMolecule(): Promise<string[] | ERRORS> {
    return [];
  }
}
