import { type RulesValidationResults } from "@infrastructure";
import { Types } from "@inspecto/models/types";
import { type Molecule, type SGroup, type Atom, type Structure } from "@models";
import { PERIODIC_TABLE } from "@utils/periodicTable";
import { FUNCTIONAL_GROUPS, SOLVENTS } from "@utils/functionalGroupsAndSolvents";
import { BaseRule, type RuleConfig } from "./base";

export const ALIAS_CODE = "alias:2.3";

const ALIASES_COLLECTION: Record<string, string> = {
  "Me": "Methyl",
  "Et": "Ethyl",
  "Pr": "Propyl",
  "nPr": "Propyl",
  "n-Pr": "Propyl",
  "iPr": "Iso-propyl",
  "Bu": "Butyl",
  "nBu": "Butyl",
  "n-Bu": "Butyl",
  "iBu": "Iso-butyl",
  "sBu": "Sec-butyl",
  "tBu": "Tert-butyl",
  "Ph": "Phenyl",
};

const FUNCTIONAL_GROUP_NAMES = new Set(Object.values(ALIASES_COLLECTION));

const isNumeric = (str: string): boolean => /^\d+$/.test(str);
const structureGroupNamePartsRegexp = /(?=[A-Z0-9])/;

export interface AliasRuleConfig extends RuleConfig {}
export class AliasRule extends BaseRule<AliasRuleConfig> {
  static docs = {
    name: "Alias",
    description: "Check for incorrect written symbols in the molecule",
    url: "https://kb.epam.com/display/EPMLSTRCHC/2.+Alias",
  };

  verify(structure: Structure): RulesValidationResults[] {
    const output: RulesValidationResults[] = [];
    for (const molecule of structure.molecules()) {
      this.checkAliases(molecule.sgroups, molecule, output);
      this.checkAliases(molecule.atoms, molecule, output);
    }
    return output;
  }

  getMoleculeItemName(moleculeItem: Atom | SGroup): string {
    if (moleculeItem.type === Types.ATOM) {
      return moleculeItem.label;
    }

    return moleculeItem.type === Types.SGROUP ? moleculeItem.name : "";
  }

  setMoleculeItemName(moleculeItem: Atom | SGroup, name: string): void {
    if (moleculeItem.type === Types.ATOM) {
      moleculeItem.label = name;
      return;
    }
    if (moleculeItem.type === Types.SGROUP) {
      moleculeItem.name = name;
    }
  }

  getMoleculeItemIndex(moleculeItem: Atom | SGroup, molecule: Molecule): number {
    if (moleculeItem.type === Types.ATOM) {
      return molecule.getAtomIndex(moleculeItem);
    }
    return moleculeItem.type === Types.SGROUP ? molecule.getGroupIndex(moleculeItem) : -1;
  }

  handleIncorrectSymbols(
    moleculeAliases: string[],
    moleculeItem: Atom | SGroup,
    molecule: Molecule,
    output: RulesValidationResults[],
    incorrectSymbols: string[],
  ): void {
    const abbreviationString = `${moleculeAliases.join("|")}`;
    const itemType = moleculeItem.type;
    const pathIndex = this.getMoleculeItemIndex(moleculeItem, molecule);
    const path = `${molecule.id}->${itemType}->${pathIndex}`;
    const fixingScope = this.config.fixingScope?.find(scope => scope.errorCode === ALIAS_CODE && scope.path === path);
    /* eslint-disable @typescript-eslint/strict-boolean-expressions */
    if (fixingScope) {
      this.setMoleculeItemName(moleculeItem, fixingScope.data as string);
      this.config.fixingScope?.splice(this.config.fixingScope?.indexOf(fixingScope), 1);
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
        url: AliasRule.docs.url,
        message: `Inspecto has detected incorrect written symbols [${incorrectSymbols.join(", ")}] in ${abbreviationString}`,
        path,
      });
    }
  }

  getIncorrectSymbols(moleculeItem: Atom | SGroup, resultOfMolecule: string[]): string[] {
    const incorrectSymbols: string[] = [];
    const originalName = this.getMoleculeItemName(moleculeItem);
    let nameWithReplacedFunctionalGroups: string = originalName;
    for (const [alias, value] of Object.entries(ALIASES_COLLECTION)) {
      nameWithReplacedFunctionalGroups = nameWithReplacedFunctionalGroups.replace(alias, value);
    }
    const symbols = nameWithReplacedFunctionalGroups.split(structureGroupNamePartsRegexp);
    if (moleculeItem.type === Types.ATOM) {
      symbols.forEach(symbol => {
        if (isNumeric(symbol)) {
          resultOfMolecule.push(`number ${symbol}`);
        } else if (FUNCTIONAL_GROUP_NAMES.has(symbol)) {
          resultOfMolecule.push(symbol);
        } else if (PERIODIC_TABLE[symbol]) {
          resultOfMolecule.push(PERIODIC_TABLE[symbol]);
        } else {
          resultOfMolecule.push("unknown");
          incorrectSymbols.push(symbol);
        }
      });
    } else {
      const chemicalInfoMatch = FUNCTIONAL_GROUPS.concat(SOLVENTS).find(info =>
        info.isCaseSensitive ? info.name === originalName : info.name.toLowerCase() === originalName.toLowerCase(),
      );

      if (chemicalInfoMatch) {
        resultOfMolecule.push(chemicalInfoMatch.name);
        return incorrectSymbols;
      }
      symbols.forEach(symbol => {
        if (isNumeric(symbol)) {
          resultOfMolecule.push(`number ${symbol}`);
          return;
        }
        let matched = false;
        const formattedSymbol = symbol.toLowerCase();
        const chemicalInfo = [...FUNCTIONAL_GROUPS, ...SOLVENTS].find(inf =>
          inf.isCaseSensitive ? inf.name === symbol : inf.name.toLowerCase() === formattedSymbol,
        );
        if (chemicalInfo) {
          resultOfMolecule.push(chemicalInfo.name);
          matched = true;
        }
        if (!matched) {
          if (PERIODIC_TABLE[symbol]) {
            resultOfMolecule.push(PERIODIC_TABLE[symbol]);
          } else if (ALIASES_COLLECTION[symbol]) {
            resultOfMolecule.push(ALIASES_COLLECTION[symbol]);
          } else {
            resultOfMolecule.push("unknown");
            incorrectSymbols.push(symbol);
          }
        }
      });
    }
    return incorrectSymbols;
  }

  checkAliases(moleculeItems: Array<Atom | SGroup>, molecule: Molecule, output: RulesValidationResults[]): void {
    for (const moleculeItem of moleculeItems) {
      const moleculeAliases: string[] = [];
      const incorrectSymbols: string[] = this.getIncorrectSymbols(moleculeItem, moleculeAliases);

      if (incorrectSymbols.length) {
        this.handleIncorrectSymbols(moleculeAliases, moleculeItem, molecule, output, incorrectSymbols);
      }
    }
  }
}
