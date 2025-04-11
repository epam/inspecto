import type { RuleConfig, BaseRule } from "@rules/algorithms/base";
import { type RuleAlgorithm } from "@rules/infrastructure";

export class Rule<TConfig extends RuleConfig> {
  private readonly _name: string;
  readonly _algorithm: RuleAlgorithm<TConfig> | typeof BaseRule<TConfig>;

  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  private _config: TConfig;
  private readonly _tags: string[];
  private readonly _description: string;

  constructor(
    name: string,
    algorithm: RuleAlgorithm<TConfig> | typeof BaseRule<TConfig>,
    config: TConfig,
    tags?: string[],
    description?: string
  ) {
    this._name = name;
    this._algorithm = algorithm;
    this._config = config;
    this._tags = tags ?? [];
    this._description = description ?? "";
  }

  public get name(): string {
    return this._name;
  }

  public get tags(): string[] {
    return this._tags.slice();
  }

  public get description(): string {
    return this._description;
  }

  public get config(): TConfig {
    return JSON.parse(JSON.stringify(this._config));
  }

  public getOriginalConfig(): TConfig {
    return this._config;
  }
}
