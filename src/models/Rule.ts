import { type RuleAlgorithm } from "@infrastructure";
import { type Structure } from "@models";

export class Rule {
  private readonly _name: string;

  constructor(
    name: string,
    private readonly _algorithm: RuleAlgorithm,
  ) {
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public applyRule(structure: Structure): ReturnType<RuleAlgorithm> {
    return this._algorithm(structure);
  }
}
