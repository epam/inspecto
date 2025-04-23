import IndigoModule from "indigo-ketcher";
import { type IConverterProvider } from "@infrastructure";

export class ConverterProvider implements IConverterProvider {
  public async convertToKetFormat(structure: string): Promise<string> {
    const indigo = await IndigoModule();
    const options = new indigo.MapStringString();
    const ket = indigo.convert(structure, "ket", options);
    options.delete();

    return ket;
  }
}
