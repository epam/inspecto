import { type RawKetType } from "@infrastructure";

export abstract class KetcherNode {
  protected readonly _id: string;
  protected readonly _type: RawKetType;

  constructor(id: string, type: RawKetType) {
    this._id = id;
    this._type = type;
  }

  public get id(): string {
    return this._id;
  }

  public get type(): RawKetType {
    return this._type;
  }
}
