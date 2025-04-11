import { type IDataModelProcessor } from "@infrastructure";
import { injectable } from "inversify";

@injectable()
export class DataModelProcessor implements IDataModelProcessor {
  public createDataModel(structure: string): void {}
}
