import { type RuleAlgorithm } from "@infrastructure";
import { type Structure } from "@models";

export class Rule {
  constructor(
    private readonly _name: string,
    private readonly algorithm: RuleAlgorithm,
  ) {}

  public get name(): string {
    return this._name;
  }

  public applyRule(structure: Structure): ReturnType<RuleAlgorithm> {
    return this.algorithm(structure);
  }
}
