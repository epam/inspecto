import { type RawKetMoleculeType } from "@infrastructure";

export abstract class KetcherNode {
  protected readonly _id: string;
  protected readonly _type: RawKetMoleculeType;

  constructor(id: string, type: RawKetMoleculeType) {
    this._id = id;
    this._type = type;
  }

  public get id(): string {
    return this._id;
  }

  public get type(): string {
    return this._type;
  }
}
