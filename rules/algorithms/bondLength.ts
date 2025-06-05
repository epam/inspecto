import { type RulesValidationResults } from "@infrastructure";
import { type Structure, type Bond, type Atom, type Molecule } from "@models";
import { BaseRule, type RuleConfig } from "./base";
import {
  createGraph,
  findAllCyclesInGraph,
  getChildAtoms,
  getDistanceBetweenTwoPoints,
  removeCyclesInGraph,
  shouldFix,
} from "@utils";

export interface BondLengthRuleConfig extends RuleConfig {
  bondLength: number;
  differenceError: number;
}

export const BOND_LENGTH = "bond-length";

export class BondLengthRule extends BaseRule<BondLengthRuleConfig> {
  static docs = {
    name: "Bond Length Validation",
    description: "Validate and adjust bonds that do not meet the specified bond length with permitted error.",
    url: "https://kb.epam.com/pages/viewpage.action?pageId=2311478731",
  };

  verify(structure: Structure): RulesValidationResults[] {
    const output: RulesValidationResults[] = [];
    const { bondLength, differenceError } = this.config;

    for (const molecule of structure.molecules()) {
      const graph = createGraph(molecule);
      const cycles = findAllCyclesInGraph(graph);
      removeCyclesInGraph(graph, cycles);

      for (const bond of molecule.bonds) {
        if (!graph.has(bond.from) || !(graph.get(bond.from)?.has(bond.to) ?? false)) {
          continue;
        }

        const currentBondLength = bond.getLength();
        const path = `${molecule.id}->bond->${molecule.getBondIndex(bond)}`;
        if (Math.abs(currentBondLength - bondLength) > differenceError) {
          if (shouldFix(this.config, BOND_LENGTH, path)) {
            this.fixBond(molecule, bond);
            console.info("bond-length:11 was fixed");
          } else {
            output.push({
              isFixable: true,
              errorCode: BOND_LENGTH,
              message: `Bond Length Rule validation error: current bond length (${currentBondLength}) differs from the standard.`,
              path,
            });
          }
        }
      }
    }

    return output;
  }

  private fixBond(molecule: Molecule, bond: Bond): void {
    const childAtoms = getChildAtoms(bond.to, molecule, new Set<Atom>([bond.from]));
    const distance = getDistanceBetweenTwoPoints(bond.from, bond.to);
    const x3 = (bond.to.x - bond.from.x) / distance + bond.from.x;
    const y3 = (bond.to.y - bond.from.y) / distance + bond.from.y;
    const z3 = (bond.to.z - bond.from.z) / distance + bond.from.z;

    const diffX = x3 - bond.to.x;
    const diffY = y3 - bond.to.y;
    const diffZ = z3 - bond.to.z;

    bond.to.changePosition(x3, y3, z3);

    childAtoms.forEach(atom => {
      const newPositionX = atom.x + diffX;
      const newPositionY = atom.y + diffY;
      const newPositionZ = atom.z + diffZ;
      atom.changePosition(newPositionX, newPositionY, newPositionZ);
    });
  }
}
