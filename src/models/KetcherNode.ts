export abstract class KetcherNode {
  protected readonly _id: string;

  constructor(id: string) {
    this._id = id;
  }

  public get id(): string {
    return this._id;
  }
}
