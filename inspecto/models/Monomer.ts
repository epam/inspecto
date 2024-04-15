import { RawKetType } from "@infrastructure";
import { KetcherNode } from "./KetcherNode";
import { type Location } from "./Location";
import { type MonomerTemplate } from "./MonomerTemplate";

export class Monomer extends KetcherNode {
  constructor(
    nodeId: string,
    private readonly _monomerId: string,
    private readonly _position: Location,
    private readonly _monomerTemplate: MonomerTemplate,
  ) {
    super(nodeId, RawKetType.MONOMER);
  }

  public get templateId(): string {
    return this._monomerTemplate.templateId;
  }
}
