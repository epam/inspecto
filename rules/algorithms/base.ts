import type { FixingScope, RulesValidationResults } from "@infrastructure";
import type { Structure } from "@models";

export interface RuleConfig {
  fixingRule?: boolean;
  fixingScope?: FixingScope[];
}
export interface RuleDocs {
  name: string;
  description: string;
  url: string;
}

export class BaseRule<T extends RuleConfig> {
  declare static docs: RuleDocs;
  declare config: T;
  constructor(config: T) {
    this.config = config;
  }
  // eslint-disable-next-line @typescript-eslint/lines-between-class-members
  verify(structure: Structure): RulesValidationResults[] {
    throw new Error("Method not implemented.");
  }
}
