import { type AttachmentPoint } from "@infrastructure";
import { type Types } from "@inspecto/infrastructure/enums";

export class SGroup {
  constructor(
    private readonly _type: Types.SGROUP,
    private readonly _atoms: number[],
    private _name: string,
    private readonly _id: number,
    private readonly _attachmentPoints: AttachmentPoint[]
  ) {}

  get type(): Types.SGROUP {
    return this._type;
  }

  get atoms(): number[] {
    return this._atoms;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get id(): number {
    return this._id;
  }

  get attachmentPoints(): AttachmentPoint[] {
    return this._attachmentPoints;
  }
}
