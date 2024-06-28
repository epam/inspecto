import { Types, type FixingScope, type RulesValidationResults } from "@infrastructure";
import { type Molecule, type SGroup, type Atom } from "@models";
import { type RuleAlgorithm } from "@rules/infrastructure";

export interface AliasAlgorithmType {
  fixingRule?: boolean;
  fixingScope?: FixingScope[];
}

export const ALIAS_CODE = "alias:2.3";

const PERIODIC_TABLE: Record<string, string> = {
  H: "Hydrogen",
  Li: "Lithium",
  Na: "Sodium",
  K: "Potassium",
  Rb: "Rubidium",
  Cs: "Cesium",
  Fr: "Francium",
  Be: "Beryllium",
  Mg: "Magnesium",
  Ca: "Calcium",
  Sr: "Strontium",
  Ba: "Barium",
  Ra: "Radium",
  Sc: "Scandium",
  Y: "Yttrium",
  Ti: "Titanium",
  Zr: "Zirconium",
  Hf: "Hafnium",
  Rf: "Rutherfordium",
  V: "Vanadium",
  Nb: "Niobium",
  Ta: "Tantalum",
  Db: "Dubnium",
  Cr: "Chromium",
  Mo: "Molybdenum",
  W: "Tungsten",
  Sg: "Seaborgium",
  Mn: "Manganese",
  Tc: "Technetium",
  Re: "Rhenium",
  Bh: "Bohrium",
  Fe: "Iron",
  Ru: "Ruthenium",
  Os: "Osmium",
  Hs: "Hassium",
  Co: "Cobalt",
  Rh: "Rhodium",
  Ir: "Iridium",
  Mt: "Meitnerium",
  Ni: "Nickel",
  Pd: "Palladium",
  Pt: "Platinum",
  Ds: "Darmstadtium",
  Cu: "Copper",
  Ag: "Silver",
  Au: "Gold",
  Rg: "Roentgenium",
  Zn: "Zinc",
  Cd: "Cadmium",
  Hg: "Mercury",
  Cn: "Copernicium",
  B: "Boron",
  Al: "Aluminium",
  Ga: "Gallium",
  In: "Indium",
  Tl: "Thallium",
  Nh: "Nihonium",
  C: "Carbon",
  Si: "Silicon",
  Ge: "Germanium",
  Sn: "Tin",
  Pb: "Lead",
  Fl: "Flerovium",
  N: "Nitrogen",
  P: "Phosphorus",
  As: "Arsenic",
  Sb: "Antimony",
  Bi: "Bismuth",
  Mc: "Moscovium",
  O: "Oxygen",
  S: "Sulfur",
  Se: "Selenium",
  Te: "Tellurium",
  Po: "Polonium",
  Lv: "Livermorium",
  F: "Fluorine",
  Cl: "Chlorine",
  Br: "Bromine",
  I: "Iodine",
  At: "Astatine",
  Ts: "Tennessine",
  He: "Helium",
  Ne: "Neon",
  Ar: "Argon",
  Kr: "Krypton",
  Xe: "Xenon",
  Rn: "Radon",
  Og: "Oganesson",
  // "La-Lu": "Lanthanoids",
  La: "Lanthanum",
  Ce: "Cerium",
  Pr: "Praseodymium",
  Nd: "Neodymium",
  Pm: "Promethium",
  Sm: "Samarium",
  Eu: "Europium",
  Gd: "Gadolinium",
  Tb: "Terbium",
  Dy: "Dysprosium",
  Ho: "Holmium",
  Er: "Erbium",
  Tm: "Thulium",
  Yb: "Ytterbium",
  Lu: "Lutetium",
  // "Ac-Lr": "Actinoids",
  Ac: "Actinium",
  Th: "Thorium",
  Pa: "Protactinium",
  U: "Uranium",
  Np: "Neptunium",
  Pu: "Plutonium",
  Am: "Americium",
  Cm: "Curium",
  Bk: "Berkelium",
  Cf: "Californium",
  Es: "Einsteinium",
  Fm: "Fermium",
  Md: "Mendelevium",
  No: "Nobelium",
  Lr: "Lawrencium",
};

const ALIASES_COLLECTION: Record<string, string> = {
  Me: "Methyl",
  Et: "Ethyl",
  Pr: "Propyl",
  nPr: "Propyl",
  "n-Pr": "Propyl",
  iPr: "Iso-propyl",
  Bu: "Butyl",
  nBu: "Butyl",
  "n-Bu": "Butyl",
  iBu: "Iso-butyl",
  sBu: "Sec-butyl",
  tBu: "Tert-butyl",
  Ph: "Phenyl",
};

const FUNCTIONAL_GROUP_NAMES = new Set();
for (const key in ALIASES_COLLECTION) {
  FUNCTIONAL_GROUP_NAMES.add(ALIASES_COLLECTION[key]);
}

const isNumeric = (str: string): boolean => /^\d+$/.test(str);
const structureGroupNamePartsRegexp = /(?=[A-Z0-9])/;

export const aliasAlgorithm: RuleAlgorithm<AliasAlgorithmType> = (structure, config) => {
  const output: RulesValidationResults[] = [];
  for (const molecule of structure.molecules()) {
    checkAliases(Array.from(molecule.sgroups()), molecule, config, output);
    checkAliases(Array.from(molecule.atoms()), molecule, config, output);
  }
  return output;
};

const getMoleculeItemName = (moleculeItem: Atom | SGroup): string => {
  if (moleculeItem.type === Types.ATOM) {
    return moleculeItem.label;
  }

  return moleculeItem.type === Types.SGROUP ? moleculeItem.name : "";
};

const setMoleculeItemName = (moleculeItem: Atom | SGroup, name: string): void => {
  if (moleculeItem.type === Types.ATOM) {
    moleculeItem.label = name;
    return;
  }
  if (moleculeItem.type === Types.SGROUP) {
    moleculeItem.name = name;
  }
};

const getMoleculeItemIndex = (moleculeItem: Atom | SGroup, molecule: Molecule): number => {
  if (moleculeItem.type === Types.ATOM) {
    return molecule.getAtomIndex(moleculeItem);
  }
  return moleculeItem.type === Types.SGROUP ? molecule.getGroupIndex(moleculeItem) : -1;
};

const handleIncorrectSymbols = (
  moleculeAliases: string[],
  moleculeItem: Atom | SGroup,
  molecule: Molecule,
  config: AliasAlgorithmType,
  output: RulesValidationResults[],
  incorrectSymbols: string[]
): void => {
  const abbreviationString = `${moleculeAliases.join("|")}`;
  const itemType = moleculeItem.type;
  const pathIndex = getMoleculeItemIndex(moleculeItem, molecule);
  const path = `${molecule.id}->${itemType}->${pathIndex}`;
  const fixingScope = config.fixingScope?.find(scope => scope.errorCode === ALIAS_CODE && scope.path === path);
  /* eslint-disable @typescript-eslint/strict-boolean-expressions */
  if (fixingScope) {
    setMoleculeItemName(moleculeItem, fixingScope.data);
    config.fixingScope?.splice(config.fixingScope?.indexOf(fixingScope), 1);
  } else {
    output.push({
      isFixable: true,
      fixMeta: {
        requireUserInput: true,
        type: "string",
        initialValue: "",
        prompt: `Inspecto has detected incorrect written symbols [${incorrectSymbols.join(", ")}] in ${abbreviationString}, would you like to change it?`,
      },
      errorCode: ALIAS_CODE,
      message: `Inspecto has detected incorrect written symbols [${incorrectSymbols.join(", ")}] in ${abbreviationString}`,
      path,
    });
  }
};

const getIncorrectSymbols = (moleculeItem: Atom | SGroup, resultOfMolecule: string[]): string[] => {
  const incorrectSymbols: string[] = [];
  let nameWithReplacedFunctionalGroups: string = getMoleculeItemName(moleculeItem);
  for (const alias in ALIASES_COLLECTION) {
    nameWithReplacedFunctionalGroups = nameWithReplacedFunctionalGroups.replace(alias, ALIASES_COLLECTION[alias]);
  }
  const symbols = nameWithReplacedFunctionalGroups.split(structureGroupNamePartsRegexp);
  symbols.forEach(symbol => {
    resultOfMolecule.push(
      isNumeric(symbol)
        ? `number ${symbol}`
        : FUNCTIONAL_GROUP_NAMES.has(symbol)
          ? symbol
          : PERIODIC_TABLE[symbol] ?? "unknown"
    );
    /* eslint-disable @typescript-eslint/strict-boolean-expressions */
    if (!isNumeric(symbol) && !PERIODIC_TABLE[symbol] && !FUNCTIONAL_GROUP_NAMES.has(symbol)) {
      incorrectSymbols.push(symbol);
    }
  });
  return incorrectSymbols;
};

const checkAliases = (
  moleculeItems: Array<Atom | SGroup>,
  molecule: Molecule,
  config: AliasAlgorithmType,
  output: RulesValidationResults[]
): void => {
  for (const moleculeItem of moleculeItems) {
    const moleculeAliases: string[] = [];
    const incorrectSymbols: string[] = getIncorrectSymbols(moleculeItem, moleculeAliases);

    if (incorrectSymbols.length) {
      handleIncorrectSymbols(moleculeAliases, moleculeItem, molecule, config, output, incorrectSymbols);
    }
  }
};
