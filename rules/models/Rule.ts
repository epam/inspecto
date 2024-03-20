import { type RuleAlgorithm } from "@infrastructure";
import { type Structure } from "@models";

export class Rule<TConfig extends object> {
  private readonly _name: string;
  private readonly _algorithm: RuleAlgorithm<TConfig>;
  private _config: TConfig;

  constructor(
    name: string,
    algorithm: RuleAlgorithm<TConfig>,
    config: TConfig,
  ) {
    this._name = name;
    this._algorithm = algorithm;
    this._config = config;
  }

  public get name(): string {
    return this._name;
  }

  public applyRule(structure: Structure): ReturnType<RuleAlgorithm<TConfig>> {
    return this._algorithm(structure, this._config);
  }

  public updateConfig(config: Partial<TConfig>): void {
    this._config = {
      ...this._config,
      ...config,
    };
  }

  public get config(): TConfig {
    return JSON.parse(JSON.stringify(this._config));
  }
}
