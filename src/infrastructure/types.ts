export interface IInspectoProcessor {
  applyRulesToMolecule: (structure: string) => Promise<string[]>;
}

export interface IConverterProvider {
  convertToKetFormat: (structure: string) => Promise<string>;
}

export interface IRulesProcessor {
  applyRulesToMolecule: (molecule: string) => Promise<string[]>;
}

export interface IDataModelProcessor {
  createDataModel: (structure: string) => void;
}
