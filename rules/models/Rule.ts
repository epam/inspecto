import { type RuleAlgorithm } from "@rules/infrastructure";

export class Rule<TConfig extends object> {
  private readonly _name: string;
  private _enabled: boolean;
  private readonly _algorithm: RuleAlgorithm<TConfig>;
  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  private _config: TConfig;
  private readonly _tags: string[];
  private readonly _description: string;

  constructor(
    name: string,
    algorithm: RuleAlgorithm<TConfig>,
    config: TConfig,
    tags?: string[],
    description?: string,
    enabled?: boolean
  ) {
    this._name = name;
    this._algorithm = algorithm;
    this._config = config;
    this._tags = tags ?? [];
    this._description = description ?? "";
    this._enabled = enabled ?? false;
  }

  public get name(): string {
    return this._name;
  }

  public get enabled(): boolean {
    return this._enabled;
  }

  public set enabled(value: boolean) {
    this._enabled = value;
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
}
