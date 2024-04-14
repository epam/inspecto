import IndigoModule from "indigo-ketcher";
import { injectable } from "inversify";
import { type IConverterProvider } from "@infrastructure";

@injectable()
export class ConverterProvider implements IConverterProvider {
  public async convertToKetFormat(structure: string | Buffer): Promise<string> {
    const indigo = await IndigoModule();
    const options = new indigo.MapStringString();
    const ket = indigo.convert(structure, "ket", options);
    options.delete();

    return ket;
  }
}
