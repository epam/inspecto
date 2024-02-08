import { type RuleAlgoritm } from "@infrastructure";
import { type Structure } from "@models";

export class Rule {
  constructor(
    private readonly _name: string,
    private readonly algorithm: RuleAlgoritm,
  ) {}

  public get name(): string {
    return this._name;
  }

  public applyRule(structure: Structure): ReturnType<RuleAlgoritm> {
    return this.algorithm(structure);
  }
}
