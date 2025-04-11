import { type AttachmentPoint } from "@infrastructure";
import { type GenericNode, Types } from "./types";

export class SGroup implements GenericNode {
  type: Types.SGROUP = Types.SGROUP;
  constructor(
    public readonly sGroupType: Types.SGROUP,
    public readonly atoms: number[],
    public name: string,
    public readonly id: number,
    public readonly attachmentPoints: AttachmentPoint[]
  ) {}
}
