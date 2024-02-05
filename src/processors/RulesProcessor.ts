import { type IRulesProcessor } from "@infrastructure";
import { injectable } from "inversify";

@injectable()
export class RulesProcessor implements IRulesProcessor {
  public async applyRulesToMolecule(molecule: string): Promise<string[]> {
    return [];
  }
}
