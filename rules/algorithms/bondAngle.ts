import { type RulesValidationResults } from "@infrastructure";
import { BOND_TYPES, type Atom, type Molecule } from "@models";
import { type RuleAlgorithm } from "@rules/infrastructure";
import {
  addEdge,
  createGraph,
  findAllCyclesInGraph,
  findCoordinatesForAngle,
  findLongestChainInGraph,
  getAngleBetweenAtoms,
  getChildAtoms,
  getSubGraph,
  type Graph,
  isAngleEquals,
  removeCyclesInGraph,
  shouldFix,
} from "@utils";
import type { RuleConfig } from "./base";

export interface BondAngleRuleConfig extends RuleConfig {}

const BOND_ANGLE_MORE_THAN_FOUR = "bond-angle:5.3.7";
const BOND_ANGLE_THREE_SINGLE_BONDS = "bond-angle:three bonds";
const BOND_ANGLE_WITH_TRIPLE_BOND = "bond-angle:5.3.8";
const BOND_ANGLE_WITH_MIN_TWO_DOUBLE_BOND = "bond-angle:5.3.9";
const BOND_ANGLE_WITH_FOUR_BOND = "bond-angle:5.3.10";
const BOND_ANGLE_WITH_FOUR_BOND_AND_ONE_CONN_ATOM_SINGLE = "bond-angle:5.3.11";
const BOND_ANGLE_WITH_FOUR_BOND_AND_TWO_CONN_ATOM_SINGLE = "bond-angle:5.3.12";
const BOND_ANGLE_WITH_FOUR_BOND_AND_THREE_CONN_ATOM_SINGLE = "bond-angle:5.3.13";
const BOND_ANGLE_WITH_FOUR_BOND_AND_FOUR_CONN_ATOM_SINGLE = "bond-angle:5.3.14";
const BOND_ANGLE_CENTRAL_ATOMS = "bond-angle:5.3.15";

type ErrorMessageFunc = (atom: string) => string;

type FixFunc = (centralAtomData: CentralAtomData, errorCode: string, errorMessage: string) => void;

const ERRORS = new Map<string, ErrorMessageFunc>([
  [
    BOND_ANGLE_MORE_THAN_FOUR,
    (atomLabel: string) =>
      `Inspecto has detected an atom:${atomLabel} in the longest chain with more than 4 bonds with not equal angles`,
  ],
  [
    BOND_ANGLE_THREE_SINGLE_BONDS,
    (atomLabel: string) =>
      `Inspecto has detected an atom:${atomLabel} in the longest chain with 3 bonds with not equal angles`,
  ],
  [
    BOND_ANGLE_WITH_TRIPLE_BOND,
    (atomLabel: string) =>
      `Inspecto has detected an atom:${atomLabel} in the longest chain with triple bond and not equal angles`,
  ],
  [
    BOND_ANGLE_WITH_MIN_TWO_DOUBLE_BOND,
    (atomLabel: string) =>
      `Inspecto has detected an atom:${atomLabel} in the longest chain with min 2 double bond and not equal angles`,
  ],
  [
    BOND_ANGLE_WITH_FOUR_BOND,
    (atomLabel: string) =>
      `Inspecto has detected an atom:${atomLabel} in the longest chain with four not equal angles and each connected atom has more than one bond`,
  ],
  [
    BOND_ANGLE_WITH_FOUR_BOND_AND_ONE_CONN_ATOM_SINGLE,
    (atomLabel: string) =>
      `Inspecto has detected an atom:${atomLabel} in the longest chain with four bonds and only one connected atom with one bond and angles are not equal (120,120,60,60)`,
  ],
  [
    BOND_ANGLE_WITH_FOUR_BOND_AND_TWO_CONN_ATOM_SINGLE,
    (atomLabel: string) =>
      `Inspecto has detected an atom:${atomLabel} in the longest chain with four bonds and only two connected atoms with one bond and angles are not equal (120,120,60,60)`,
  ],
  [
    BOND_ANGLE_WITH_FOUR_BOND_AND_THREE_CONN_ATOM_SINGLE,
    (atomLabel: string) =>
      `Inspecto has detected an atom:${atomLabel} in the longest chain with four bonds and three connected atoms with one bond and angles are not equal (120,120,60,60)`,
  ],
  [
    BOND_ANGLE_WITH_FOUR_BOND_AND_FOUR_CONN_ATOM_SINGLE,
    (atomLabel: string) =>
      `Inspecto has detected an atom:${atomLabel} in the longest chain with four bonds and four connected atoms with one bond and angles are not equal (120,120,60,60)`,
  ],
  [
    BOND_ANGLE_CENTRAL_ATOMS,
    (atomLabel: string) =>
      `Inspecto has detected an atom:${atomLabel} in the longest chain with angles are not equal (120,240)`,
  ],
]);

interface CentralAtomData {
  centralAtom: Atom;
  longestChain: Atom[];
  molecule: Molecule;
  output: RulesValidationResults[];
  config: BondAngleRuleConfig;
}

export const bondAngleAlgorithm: RuleAlgorithm<BondAngleRuleConfig> = (structure, config) => {
  const output: RulesValidationResults[] = [];
  const molecules = structure.molecules();

  for (const molecule of molecules) {
    const graph = createGraph(molecule);
    const cycles = findAllCyclesInGraph(graph);
    removeCyclesInGraph(graph, cycles);
    fixGraph(graph, molecule, output, config);
  }
  return output;
};

function fixGraph(
  graph: Graph,
  molecule: Molecule,
  output: RulesValidationResults[],
  config: BondAngleRuleConfig,
  startAtom?: Atom
): void {
  const longestChain = findLongestChainInGraph(graph, startAtom);
  if (longestChain.length < 3) {
    return;
  }

  const centerAtoms = longestChain.slice(1, -1);

  for (const centralAtom of centerAtoms) {
    const atomBonds = molecule.getAtomBonds(centralAtom).filter(bond => graph.get(bond.from)?.has(bond.to));

    const data: CentralAtomData = {
      centralAtom,
      longestChain,
      molecule,
      output,
      config,
    };

    if (atomBonds.length === 3) {
      fixError(checkAndFixEqualAngles, BOND_ANGLE_THREE_SINGLE_BONDS, data, graph);
      continue;
    }
    if (atomBonds.length > 4) {
      // 5.3.7
      fixError(checkAndFixEqualAngles, BOND_ANGLE_MORE_THAN_FOUR, data, graph);
      continue;
    }
    const atomTripleBonds = atomBonds.filter(bond => bond.bondType === BOND_TYPES.TRIPLE);
    const atomDoubleBonds = atomBonds.filter(bond => bond.bondType === BOND_TYPES.DOUBLE);
    if (atomTripleBonds.length > 0) {
      // 5.3.8
      fixError(checkAndFixEqualAngles, BOND_ANGLE_WITH_TRIPLE_BOND, data, graph);
      continue;
    }
    if (atomDoubleBonds.length >= 2) {
      // 5.3.9
      fixError(checkAndFixEqualAngles, BOND_ANGLE_WITH_MIN_TWO_DOUBLE_BOND, data, graph);
      continue;
    }
    if (atomBonds.length === 4) {
      const connected = molecule.getConnectedAtoms(centralAtom);
      if (connected.every(connectedAtom => molecule.getAtomBonds(connectedAtom).length > 1)) {
        // 5.3.10
        fixError(checkAndFixEqualAngles, BOND_ANGLE_WITH_FOUR_BOND, data, graph);
        continue;
      }
      if (connected.filter(connectedAtom => molecule.getAtomBonds(connectedAtom).length === 1).length === 1) {
        // 5.3.11
        fixError(checkAndFixFourBondsAngles, BOND_ANGLE_WITH_FOUR_BOND_AND_ONE_CONN_ATOM_SINGLE, data, graph);
        continue;
      }
      if (connected.filter(connectedAtom => molecule.getAtomBonds(connectedAtom).length === 1).length === 2) {
        // 5.3.12
        fixError(checkAndFixFourBondsAngles, BOND_ANGLE_WITH_FOUR_BOND_AND_TWO_CONN_ATOM_SINGLE, data, graph);
        continue;
      }
      if (connected.filter(connectedAtom => molecule.getAtomBonds(connectedAtom).length === 1).length === 3) {
        // 5.3.13
        fixError(checkAndFixFourBondsAngles, BOND_ANGLE_WITH_FOUR_BOND_AND_THREE_CONN_ATOM_SINGLE, data, graph);
        continue;
      }
      if (connected.filter(connectedAtom => molecule.getAtomBonds(connectedAtom).length === 1).length === 4) {
        // 5.3.14
        fixError(checkAndFixFourBondsAngles, BOND_ANGLE_WITH_FOUR_BOND_AND_FOUR_CONN_ATOM_SINGLE, data, graph);
        continue;
      }
    }
    fixError(checkAndFixTwoBondsAngles, BOND_ANGLE_CENTRAL_ATOMS, data, graph);
  }
}

function fixError(fixFunction: FixFunc, errorCode: string, data: CentralAtomData, graph: Graph): void {
  const { centralAtom, longestChain, molecule, output, config } = data;
  const errorMessageFunc = ERRORS.get(errorCode);
  if (errorMessageFunc === undefined) {
    throw new Error("error message is not specified for error code");
  }
  fixFunction(data, errorCode, errorMessageFunc(centralAtom.label));
  fixSubChain(graph, centralAtom, longestChain, molecule, output, config);
}

function fixSubChain(
  graph: Graph,
  atom: Atom,
  longestChain: Atom[],
  molecule: Molecule,
  output: RulesValidationResults[],
  config: BondAngleRuleConfig
): void {
  const connectedAtoms = graph.get(atom);
  if (connectedAtoms === undefined) {
    return;
  }
  const connectedAtomsWithoutCentral = [...connectedAtoms].filter(
    connectedAtom => !longestChain.includes(connectedAtom)
  );
  for (const connectedAtom of connectedAtomsWithoutCentral) {
    const subGraph = getSubGraph(graph, connectedAtom, [atom]);
    addEdge(subGraph, atom, connectedAtom);
    fixGraph(subGraph, molecule, output, config, atom);
  }
}

function checkAndFixEqualAngles(data: CentralAtomData, errorCode: string, errorMessage: string): void {
  const { centralAtom, longestChain, molecule, output, config } = data;

  const connectedAtoms = molecule.getConnectedAtoms(centralAtom);
  let referenceAtom = longestChain[longestChain.indexOf(centralAtom) - 1];
  const rightCentralAtom = longestChain[longestChain.indexOf(centralAtom) + 1];

  const angleStep = 360 / connectedAtoms.length;

  const angles = connectedAtoms.map(x => getAngleBetweenAtoms(centralAtom, referenceAtom, x)).sort((a, b) => a - b);
  const correctAngles = Array.from({ length: connectedAtoms.length }, (_, i) => i * angleStep);

  if (compareAngles(angles, correctAngles)) {
    return;
  }

  const path = `${molecule.id}->atom->${molecule.getAtomIndex(centralAtom)}`;

  if (shouldFix(config, errorCode, path)) {
    const atomsWithoutReference = connectedAtoms.filter(atom => atom !== referenceAtom);
    const atomsWithoutReferenceSorted = atomsWithoutReference.sort(
      (a, b) =>
        getAngleBetweenAtoms(centralAtom, referenceAtom, a) - getAngleBetweenAtoms(centralAtom, referenceAtom, b)
    );
    atomsWithoutReferenceSorted.forEach(connectedAtom => {
      changeAngleForConnectedAtom(connectedAtom, centralAtom, referenceAtom, angleStep, rightCentralAtom, molecule);
      referenceAtom = connectedAtom;
    });
  } else {
    output.push({
      isFixable: true,
      errorCode,
      message: errorMessage,
      path,
    });
  }
}

function checkAndFixFourBondsAngles(data: CentralAtomData, errorCode: string, errorMessage: string): void {
  const { centralAtom, longestChain, molecule, output, config } = data;
  const connectedAtoms = molecule.getConnectedAtoms(centralAtom);
  let referenceAtom = longestChain[longestChain.indexOf(centralAtom) - 1];
  const rightCentralAtom = longestChain[longestChain.indexOf(centralAtom) + 1];
  let sortedConnectedAtoms: Atom[] = [];

  const connectedAtomsWithOneBond = connectedAtoms.filter(atom => molecule.getAtomBonds(atom).length === 1);

  const centralAtomsAngle = getAngleBetweenAtoms(centralAtom, referenceAtom, rightCentralAtom);

  const angles = centralAtomsAngle < 180 ? [60, 60, 120, 120] : [120, 120, 60, 60];

  if (connectedAtomsWithOneBond.length === 1) {
    const connectedAtomWithOneBond = connectedAtomsWithOneBond[0];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const connectedAtomWithMultipleBond = connectedAtoms.find(
      connectedAtom =>
        connectedAtom !== referenceAtom &&
        connectedAtom !== connectedAtomWithOneBond &&
        connectedAtom !== rightCentralAtom
    )!;

    sortedConnectedAtoms = [
      referenceAtom,
      centralAtomsAngle < 180 ? connectedAtomWithOneBond : connectedAtomWithMultipleBond,
      rightCentralAtom,
      centralAtomsAngle < 180 ? connectedAtomWithMultipleBond : connectedAtomWithOneBond,
    ];
  } else {
    const connectedAtomsWithoutCentral = connectedAtoms.filter(connectedAtom => connectedAtom !== referenceAtom);
    const connectedAtomsWithoutCentralSorted = connectedAtomsWithoutCentral.sort(
      (a, b) =>
        getAngleBetweenAtoms(centralAtom, referenceAtom, a) - getAngleBetweenAtoms(centralAtom, referenceAtom, b)
    );
    sortedConnectedAtoms = [referenceAtom, ...connectedAtomsWithoutCentralSorted];
  }

  const connectedAtomsAngles = connectedAtoms
    .map(x => getAngleBetweenAtoms(centralAtom, referenceAtom, x))
    .sort((a, b) => a - b);
  const correctAngles: number[] = [];
  for (const angle of angles) {
    correctAngles.push(correctAngles.length > 0 ? correctAngles[correctAngles.length - 1] + angle : angle);
  }
  if (isFourBondsAnglesCorrect(connectedAtomsAngles) || compareAngles(connectedAtomsAngles, correctAngles)) {
    return;
  }

  const path = `${molecule.id}->atom->${molecule.getAtomIndex(centralAtom)}`;

  if (shouldFix(config, errorCode, path)) {
    const sortedConnectedAtomsWithoutReference = sortedConnectedAtoms.filter(atom => atom !== referenceAtom);
    sortedConnectedAtomsWithoutReference.forEach((connectedAtom, index) => {
      changeAngleForConnectedAtom(connectedAtom, centralAtom, referenceAtom, angles[index], rightCentralAtom, molecule);
      referenceAtom = connectedAtom;
    });
  } else {
    output.push({
      isFixable: true,
      errorCode,
      message: errorMessage,
      path,
    });
  }
}

function checkAndFixTwoBondsAngles(data: CentralAtomData, errorCode: string, errorMessage: string): void {
  const { centralAtom, longestChain, molecule, output, config } = data;
  const leftCentralAtom = longestChain[longestChain.indexOf(centralAtom) - 2];
  const referenceAtom = longestChain[longestChain.indexOf(centralAtom) - 1];
  const rightCentralAtom = longestChain[longestChain.indexOf(centralAtom) + 1];
  const centralAtomAngle = getAngleBetweenAtoms(centralAtom, referenceAtom, rightCentralAtom);
  let angle: number;
  let isCorrect: boolean;
  if (leftCentralAtom === undefined) {
    angle = centralAtomAngle < 180 ? 120 : 240;
    isCorrect = isAngleEquals(centralAtomAngle, 120) || isAngleEquals(centralAtomAngle, 240);
  } else {
    const previousCentralAtomAngle = getAngleBetweenAtoms(referenceAtom, leftCentralAtom, centralAtom);
    angle = previousCentralAtomAngle < 180 ? 240 : 120;
    const isPreviousAtomHasThreeBonds = molecule.getAtomBonds(referenceAtom).length === 3;
    const isCentralAngle120or240 = isAngleEquals(centralAtomAngle, 120) || isAngleEquals(centralAtomAngle, 240);
    isCorrect =
      isAngleEquals(centralAtomAngle, angle) ||
      ((isAngleEquals(previousCentralAtomAngle, 90) ||
        isAngleEquals(previousCentralAtomAngle, 180) ||
        isPreviousAtomHasThreeBonds) &&
        isCentralAngle120or240);
  }

  if (isCorrect) {
    return;
  }

  const path = `${molecule.id}->atom->${molecule.getAtomIndex(centralAtom)}`;

  if (shouldFix(config, errorCode, path)) {
    const distance = getDistance(rightCentralAtom, centralAtom);

    const newPosition = findCoordinatesForAngle(referenceAtom, centralAtom, distance, angle);
    rightCentralAtom.changePosition(newPosition.x, newPosition.y);
    const angleDiff = centralAtomAngle - angle;

    const childAtoms = getChildAtoms(rightCentralAtom, molecule, new Set<Atom>([centralAtom]));
    childAtoms.forEach(childAtom => {
      const oldChildAngle = getAngleBetweenAtoms(centralAtom, referenceAtom, childAtom);
      const newChildAngle = oldChildAngle - angleDiff;
      const distance = getDistance(childAtom, centralAtom);
      const childNewPosition = findCoordinatesForAngle(referenceAtom, centralAtom, distance, newChildAngle);
      childAtom.changePosition(childNewPosition.x, childNewPosition.y);
    });
  } else {
    output.push({
      isFixable: true,
      errorCode,
      message: errorMessage,
      path,
    });
  }
}

function changeAngleForConnectedAtom(
  connectedAtom: Atom,
  centralAtom: Atom,
  referenceAtom: Atom,
  angleStep: number,
  rightCentralAtom: Atom,
  molecule: Molecule
): void {
  const distance = getDistance(connectedAtom, centralAtom);
  const oldAngle = getAngleBetweenAtoms(centralAtom, referenceAtom, connectedAtom);
  const angleDiff = oldAngle - angleStep;
  const newPosition = findCoordinatesForAngle(referenceAtom, centralAtom, distance, angleStep);
  connectedAtom.changePosition(newPosition.x, newPosition.y);

  if (connectedAtom !== referenceAtom) {
    const childAtoms = getChildAtoms(connectedAtom, molecule, new Set<Atom>([centralAtom]));
    childAtoms.forEach(childAtom => {
      const oldChildAngle = getAngleBetweenAtoms(centralAtom, referenceAtom, childAtom);
      const newChildAngle = oldChildAngle - angleDiff;
      const distance = getDistance(childAtom, centralAtom);
      const childNewPosition = findCoordinatesForAngle(referenceAtom, centralAtom, distance, newChildAngle);
      childAtom.changePosition(childNewPosition.x, childNewPosition.y);
    });
  }
}

function getDistance(from: Atom, to: Atom): number {
  return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
}

function isFourBondsAnglesCorrect(angles: number[]): boolean {
  const angleSteps = angles.reduce((arr: number[], angle: number) => {
    arr.push(arr.length > 0 ? angle - angles[arr.length - 1] : angle);
    return arr;
  }, []);
  return (
    angleSteps.filter(angle => isAngleEquals(angle, 60)).length === 2 &&
    angleSteps.filter(angle => isAngleEquals(angle, 120)).length === 2
  );
}

function compareAngles(currentAngles: number[], correctAngles: number[]): boolean {
  replaceFullAngleToZeroAngle(currentAngles);
  replaceFullAngleToZeroAngle(correctAngles);

  for (let index = 0; index < currentAngles.length; index++) {
    if (!isAngleEquals(correctAngles[index], currentAngles[index])) {
      return false;
    }
  }
  return true;
}

function replaceFullAngleToZeroAngle(angles: number[]): void {
  if (angles[angles.length - 1] === 360) {
    angles.pop();
    angles.unshift(0);
  }
}
