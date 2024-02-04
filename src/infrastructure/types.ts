export interface IIndigoProcessor {
  checkMoleculeForRules: () => Promise<void>;
}
