import { type FixingScope, type RulesValidationResults } from "@infrastructure";
import { type Atom, type Bond, type Molecule } from "@models";
import { type RuleAlgorithm } from "@rules/infrastructure";
import {
  createGraph,
  findAllCyclesInGraph,
  getChildAtoms,
  getDistanceBetweenTwoAtoms,
  removeCyclesInGraph,
  shouldFix,
} from "@utils";

export interface BondLengthAlgorithmType {
  bondLength: number;
  differenceError: number;
  fixingRule?: boolean;
  fixingScope?: FixingScope[];
}

export const BOND_LENGTH = "bond-length";

export const bondLengthAlgorithm: RuleAlgorithm<BondLengthAlgorithmType> = (structure, config) => {
  const output: RulesValidationResults[] = [];

  for (const molecule of structure.molecules()) {
    const graph = createGraph(molecule);
    const cycles = findAllCyclesInGraph(graph);
    removeCyclesInGraph(graph, cycles);

    for (const bond of molecule.bonds()) {
      /* eslint-disable @typescript-eslint/strict-boolean-expressions */
      if (!graph.has(bond.from) || !graph.get(bond.from)?.has(bond.to)) {
        continue;
      }
      const bondLength = bond.getLength();
      const path = `${molecule.id}->bond->${molecule.getBondIndex(bond)}`;
      if (Math.abs(bondLength - config.bondLength) > config.differenceError) {
        if (shouldFix(config, BOND_LENGTH, path)) {
          fixBonds(molecule, bond, config);
          console.info("bond-length:11 was fixed");
        } else {
          output.push({
            errorCode: BOND_LENGTH,
            isFixable: true,
            message: `Bond Length Rule validation error: ${bond.getLength()}`,
            path,
          });
        }
      }
    }
  }

  return output;
};

const fixBonds = (molecule: Molecule, bond: Bond, config: BondLengthAlgorithmType): void => {
  const childAtoms = getChildAtoms(bond.to, molecule, new Set<Atom>([bond.from]));
  const distance = getDistanceBetweenTwoAtoms(bond.from, bond.to);
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
};
