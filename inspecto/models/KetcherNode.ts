import type { GenericNode, Types } from "./types";

export abstract class KetcherNode implements GenericNode {
  protected readonly _id: string;
  protected readonly _type: Types;

  constructor(id: string, type: Types) {
    this._id = id;
    this._type = type;
  }

  public get id(): string {
    return this._id;
  }

  public get type(): Types {
    return this._type;
  }
}
