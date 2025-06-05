import { type FixingScope, type RulesValidationResults } from "@infrastructure";
import type { Atom, Bond, Molecule } from "@models";
import { type RuleAlgorithm } from "@rules/infrastructure";
import {
  createGraph,
  isBondsOverlapping,
  findCoordinatesForAngle,
  type Graph,
  shouldFix,
  findAllCyclesInGraph,
} from "@utils";
import { getDistanceBetweenTwoPoints } from "@utils/getDistanceBetweenTwoPoints";
import type { RuleConfig } from "./base";

interface RotationDirections {
  direction1: number;
  direction2: number;
}
interface Coordinates {
  x: number;
  y: number;
  z: number;
}

export interface OverlappingRuleConfig extends RuleConfig {
  bondLength: number;
  overlappingFactor: number;
  fixingRule?: boolean;
  fixingScope?: FixingScope[];
}

export const OVERLAPPING_CODE = "overlapping:6";
const fixedOverlaps = new Map<string, string>();
let direction = 0;
let allShortestPathsOverlappingAtoms: Atom[][];
export const overlappingAlgorithm: RuleAlgorithm<OverlappingRuleConfig> = (structure, config) => {
  const output: RulesValidationResults[] = [];
  for (const molecule of structure.molecules()) {
    let overlappingAtoms = getOverlappingAtoms(molecule, config);
    const overlappingBonds = getOverlappingBonds(molecule);
    if (isStructureSymmetrical(molecule)) {
      overlappingAtoms = sortOverlapsBySymmetry(molecule, overlappingAtoms);
    }
    allShortestPathsOverlappingAtoms = getAllShortestPaths(molecule, overlappingAtoms);
    const graph = createGraph(molecule);
    const cycles = findAllCyclesInGraph(graph);

    overlappingAtoms.forEach(overlappingPair => {
      const path = `${molecule.id}->atom${molecule.getAtomIndex(overlappingPair[0])}->atom${molecule.getAtomIndex(overlappingPair[1])}`;
      const shortestPath = findOverlapAtomsPath(graph, overlappingPair);
      if (shouldFix(config, OVERLAPPING_CODE, path) && shortestPath.length > 0) {
        if (!fixedOverlaps.has(path)) {
          direction = 1;
          fixOverlapping(molecule, shortestPath, cycles, config, allShortestPathsOverlappingAtoms);
          fixedOverlaps.set(path, "firstFixAttempted");
        } else if (fixedOverlaps.get(path) === "firstFixAttempted") {
          direction = 2;
          fixOverlappingAfterFirstRotation(molecule, shortestPath, cycles, config);
          fixedOverlaps.set(path, "secondFixAttempted");
        }
      } else {
        output.push({
          isFixable: true,
          errorCode: OVERLAPPING_CODE,
          message: `Inspecto has detected overlapping atoms: ${overlappingPair[0].label}-${molecule.getAtomIndex(overlappingPair[0])} / ${overlappingPair[1].label}-${molecule.getAtomIndex(overlappingPair[1])}`,
          path,
        });
      }
    });

    overlappingBonds.forEach(overlappingPairBonds => {
      const path = `${molecule.id}->bond${molecule.getBondIndex(overlappingPairBonds[0])}->bond${molecule.getBondIndex(overlappingPairBonds[1])}`;
      const graph = createGraph(molecule);
      const shortestPath = findShortestPathOverlappingBonds(molecule, graph);
      if (shouldFix(config, OVERLAPPING_CODE, path) && shortestPath.length > 0) {
        if (!fixedOverlaps.has(path)) {
          direction = 1;
          fixOverlapping(molecule, shortestPath, cycles, config, allShortestPathsOverlappingAtoms);
          fixedOverlaps.set(path, "firstFixAttempted");
        } else if (fixedOverlaps.get(path) === "firstFixAttempted") {
          direction = 2;
          fixOverlappingAfterFirstRotation(molecule, shortestPath, cycles, config);
          fixedOverlaps.set(path, "secondFixAttempted");
        }
      } else {
        output.push({
          isFixable: true,
          errorCode: OVERLAPPING_CODE,
          message: `Inspecto has detected overlapping bonds: ${overlappingPairBonds[0].from.label}-${overlappingPairBonds[0].to.label}-${molecule.getBondIndex(overlappingPairBonds[0])} / ${overlappingPairBonds[1].from.label}-${overlappingPairBonds[1].to.label}-${molecule.getBondIndex(overlappingPairBonds[1])}`,
          path,
        });
      }
    });
  }
  try {
    return output;
  } finally {
    fixedOverlaps.clear();
    direction = 0;
    allShortestPathsOverlappingAtoms = [];
  }
};

function fixOverlapping(
  molecule: Molecule,
  shortestPath: Atom[],
  cycles: Atom[][],
  config: OverlappingRuleConfig,
  allShortestPaths: Atom[][]
): boolean {
  let firstBranchAtoms: Atom[];
  let secondBranchAtoms: Atom[];
  const atomsOccurringMoreThanOnce = findAtomsOccurringMoreThanOnce(allShortestPaths);
  const atomsInFirstPath = checkAtomsInFirstPath(molecule, allShortestPaths, shortestPath);
  const atomsInSecondPath = checkAtomsInSecondPath(molecule, allShortestPaths, shortestPath);

  if (atomsInFirstPath !== undefined && atomsInFirstPath !== null && atomsOccurringMoreThanOnce.length > 2) {
    firstBranchAtoms = atomsInFirstPath;
  } else {
    firstBranchAtoms = firstBranch(shortestPath, molecule);
  }

  if (atomsInSecondPath !== undefined && atomsInFirstPath !== null && atomsOccurringMoreThanOnce.length > 2) {
    secondBranchAtoms = atomsInSecondPath;
  } else {
    secondBranchAtoms = secondBranch(shortestPath, molecule);
  }

  const centralAtomFirstPath = getPivotAtomFirstPath(shortestPath);
  const centralAtomSecondPath = getPivotAtomSecondPath(shortestPath);
  const degrees: number = calculateRotationDegrees(shortestPath);
  let { direction1, direction2 } = determineRotationDirections(
    shortestPath,
    centralAtomFirstPath,
    centralAtomSecondPath
  );
  if (shortestPath.length >= 7 && shortestPath.length <= 9) {
    const firstAtomFirstBranchCycleCheck = isAtomPartOfAnyCycle(shortestPath[1], cycles);
    const secondAtomFirstBranchCycleCheck = isAtomPartOfAnyCycle(shortestPath[2], cycles);
    const firstAtomSecondBranchCycleCheck = isAtomPartOfAnyCycle(shortestPath[shortestPath.length - 2], cycles);
    const secondAtomSecondBranchCycleCheck = isAtomPartOfAnyCycle(shortestPath[shortestPath.length - 3], cycles);
    if (firstAtomFirstBranchCycleCheck && secondAtomFirstBranchCycleCheck) {
      direction1 = 0;
    }
    if (firstAtomSecondBranchCycleCheck && secondAtomSecondBranchCycleCheck) {
      direction2 = 0;
    }
  }
  rotateAtomsAroundCentral(centralAtomFirstPath, firstBranchAtoms, direction1, degrees);
  rotateAtomsAroundCentral(centralAtomSecondPath, secondBranchAtoms, direction2, degrees);
  const stillOverlapping = getOverlappingAtoms(molecule, config).length > 0;
  return !stillOverlapping;
}
function fixOverlappingAfterFirstRotation(
  molecule: Molecule,
  shortestPath: Atom[],
  cycles: Atom[][],
  config: OverlappingRuleConfig
): boolean {
  const centralAtomFirstPath = getPivotAtomFirstPath(shortestPath);
  const centralAtomSecondPath = getPivotAtomSecondPath(shortestPath);
  const degrees: number = calculateRotationDegrees(shortestPath);
  let { direction1, direction2 } = determineRotationDirections(
    shortestPath,
    centralAtomFirstPath,
    centralAtomSecondPath
  );
  if (shortestPath.length >= 7 && shortestPath.length <= 9) {
    const firstAtomFirstBranchCycleCheck = isAtomPartOfAnyCycle(shortestPath[1], cycles);
    const secondAtomFirstBranchCycleCheck = isAtomPartOfAnyCycle(shortestPath[2], cycles);
    const firstAtomSecondBranchCycleCheck = isAtomPartOfAnyCycle(shortestPath[shortestPath.length - 2], cycles);
    const secondAtomSecondBranchCycleCheck = isAtomPartOfAnyCycle(shortestPath[shortestPath.length - 3], cycles);
    if (firstAtomFirstBranchCycleCheck && secondAtomFirstBranchCycleCheck) {
      direction1 = 0;
    }
    if (firstAtomSecondBranchCycleCheck && secondAtomSecondBranchCycleCheck) {
      direction2 = 0;
    }
  }
  const firstBranchAtoms = firstBranchAfterRotation(shortestPath, molecule);
  const secondBranchAtoms = secondBranchAfterRotation(shortestPath, molecule);
  rotateAtomsAroundCentral(centralAtomFirstPath, firstBranchAtoms, direction1, degrees);
  rotateAtomsAroundCentral(centralAtomSecondPath, secondBranchAtoms, direction2, degrees);
  const stillOverlapping = getOverlappingAtoms(molecule, config).length > 0;
  return !stillOverlapping;
}

function rotateAtomsAroundCentral(centralAtom: Atom, branchAtoms: Atom[], direction: number, degrees: number): void {
  branchAtoms.forEach(atom => {
    const distance = getDistanceBetweenTwoPoints(centralAtom, atom);
    const newCoordinates = findCoordinatesForAngle(atom, centralAtom, distance, direction * degrees);
    atom.changePosition(newCoordinates.x, newCoordinates.y, atom.z);
  });
}

function isAtomPartOfAnyCycle(atom: Atom, cycles: Atom[][]): boolean {
  return cycles.some(cycle => cycle.includes(atom));
}

export function getOverlappingAtoms(molecule: Molecule, config: OverlappingRuleConfig): Array<[Atom, Atom]> {
  const overlappingAtoms: Array<[Atom, Atom]> = [];

  const atoms = molecule.atoms;
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const isOverlapping = isAtomsOverlapping(atoms[i], atoms[j], config);
      if (isOverlapping) {
        overlappingAtoms.push([atoms[i], atoms[j]]);
      }
    }
  }
  return overlappingAtoms;
}

export function getOverlappingBonds(molecule: Molecule): Array<[Bond, Bond]> {
  const overlappingBonds: Array<[Bond, Bond]> = [];
  const bonds = molecule.bonds;
  for (let i = 0; i < bonds.length; i++) {
    for (let j = i + 1; j < bonds.length; j++) {
      const isOverlapping = isBondsOverlapping(bonds[i], bonds[j]);
      if (isOverlapping) {
        overlappingBonds.push([bonds[i], bonds[j]]);
      }
    }
  }
  return overlappingBonds;
}

export function isAtomsOverlapping(atomOne: Atom, atomTwo: Atom, config: OverlappingRuleConfig): boolean {
  return getDistanceBetweenTwoPoints(atomOne, atomTwo) < config.overlappingFactor * config.bondLength;
}

export const findShortestPath = (graph: Graph, start: Atom, end: Atom): Atom[] | null => {
  if (start === end) return [start];

  const visited = new Set<Atom>();
  const queue: Array<{ atom: Atom; path: Atom[] }> = [];
  visited.add(start);
  queue.push({ atom: start, path: [start] });

  while (queue.length > 0) {
    const { atom, path } = queue.shift() as { atom: Atom; path: Atom[]; };
    const neighbors = graph.get(atom) ?? [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        const newPath = path.concat([neighbor]);
        if (neighbor === end) {
          return newPath;
        }
        queue.push({ atom: neighbor, path: newPath });
      }
    }
  }

  return null;
};

function determineRotationDirections(
  shortestPath: Atom[],
  centralAtomFirstPath: Atom,
  centralAtomSecondPath: Atom
): RotationDirections {
  if (shortestPath.length < 3) {
    throw new Error("Not enough atoms");
  }
  let first = shortestPath[1];
  let last = shortestPath[shortestPath.length - 2];

  if (
    direction === 2 ||
    (shortestPath.length < 6 &&
      centralAtomFirstPath === shortestPath[1] &&
      centralAtomSecondPath === shortestPath[shortestPath.length - 2])
  ) {
    first = shortestPath[0];
    last = shortestPath[shortestPath.length - 1];
  }

  let direction1 = 0;
  let direction2 = 0;

  if (last.x === first.x && first.y === last.y) {
    if (centralAtomFirstPath.y < first.y && centralAtomFirstPath.x < first.x) {
      direction1 = -1;
      direction2 = 1;
    } else if (centralAtomFirstPath.y < first.y && centralAtomFirstPath.x > last.x) {
      direction1 = 1;
      direction2 = -1;
    }
  }

  if (centralAtomFirstPath.y < first.y && centralAtomSecondPath.y < last.y) {
    if (first.x < last.x) {
      direction1 = -1;
      direction2 = 1;
    } else if (first.x > last.x) {
      direction1 = 1;
      direction2 = -1;
    }
  } else if (centralAtomFirstPath.y > first.y && centralAtomSecondPath.y > last.y) {
    if (first.x < last.x) {
      direction1 = 1;
      direction2 = -1;
    } else if (first.x > last.x) {
      direction1 = -1;
      direction2 = 1;
    }
  } else if (centralAtomFirstPath.x < first.x && centralAtomSecondPath.x < last.x) {
    if (first.y < last.y) {
      direction1 = -1;
      direction2 = 1;
    } else if (first.y > last.y) {
      direction1 = 1;
      direction2 = -1;
    }
  } else if (centralAtomFirstPath.x > first.x && centralAtomSecondPath.x > last.x) {
    if (first.y < last.y) {
      direction1 = 1;
      direction2 = -1;
    } else if (first.y > last.y) {
      direction1 = -1;
      direction2 = 1;
    }
  } else if (centralAtomFirstPath.x === last.x && centralAtomFirstPath.y === last.y) {
    direction1 = determineSingleDirection(first, centralAtomSecondPath);
    direction2 = -direction1;
  } else if (centralAtomSecondPath.x === first.x && centralAtomSecondPath.y === first.y) {
    direction2 = determineSingleDirection(last, centralAtomFirstPath);
    direction1 = -direction2;
  } else if (centralAtomFirstPath.y < first.y && centralAtomSecondPath.y < last.y) {
    if (first.x < last.x) {
      direction1 = -1;
      direction2 = 1;
    } else if (first.x > last.x) {
      direction1 = 1;
      direction2 = -1;
    }
  } else if (centralAtomFirstPath.y > first.y && centralAtomSecondPath.y > last.y) {
    if (first.x < last.x) {
      direction1 = 1;
      direction2 = -1;
    } else if (first.x > last.x) {
      direction1 = -1;
      direction2 = 1;
    }
  }
  if (last.x === first.x && first.y === last.x) {
    if (centralAtomFirstPath.y < first.y) {
      direction1 = -1;
      direction2 = 1;
    }
  }
  return { direction1, direction2 };
}

function determineSingleDirection(atom1: Atom, atom2: Atom): number {
  const dx = atom1.x - atom2.x;
  const dy = atom1.y - atom2.y;
  return dx > 0 || dy > 0 ? 1 : -1;
}

export function calculateMidpoint(atom1: Atom, atom2: Atom): { x: number; y: number; z: number } {
  return {
    x: (atom1.x + atom2.x) / 2,
    y: (atom1.y + atom2.y) / 2,
    z: (atom1.z + atom2.z) / 2,
  };
}
export function calculateCenterOfMass(atoms: Atom[]): Coordinates {
  let totalX = 0;
  let totalY = 0;
  let totalZ = 0;
  const atomCount = atoms.length;

  atoms.forEach(atom => {
    totalX += atom.x;
    totalY += atom.y;
    totalZ += atom.z;
  });

  return {
    x: totalX / atomCount,
    y: totalY / atomCount,
    z: totalZ / atomCount,
  };
}

export function calculateAtomDistancesToCenterOfMass(
  atoms: Molecule["atoms"],
  centerOfMass: { x: number; y: number; z: number }
): number[] {
  return atoms.map(atom => getDistanceBetweenTwoPoints(atom, centerOfMass));
}

export function isStructureSymmetrical(molecule: Molecule): boolean {
  const centerOfMass = calculateCenterOfMass(molecule.atoms);
  const atomDistances = calculateAtomDistancesToCenterOfMass(molecule.atoms, centerOfMass);
  const distanceCount = new Map<number, number>();
  for (const distance of atomDistances) {
    const roundDistance = Math.round(distance * 100) / 100;
    const count = distanceCount.get(roundDistance) ?? 0;
    distanceCount.set(roundDistance, count + 1);
  }

  return Array.from(distanceCount.values()).every(count => count % 2 === 0);
}

export function sortOverlapsBySymmetry(molecule: Molecule, overlappingAtoms: Array<[Atom, Atom]>): Array<[Atom, Atom]> {
  if (isStructureSymmetrical(molecule)) {
    const centerOfMass = calculateCenterOfMass(molecule.atoms);
    const overlappingMidpoints = overlappingAtoms.map(pair => calculateMidpoint(pair[0], pair[1]));
    const sortedAtomPairs = overlappingAtoms.sort((pairA, pairB) => {
      const distanceA = getDistanceBetweenTwoPoints(
        overlappingMidpoints[overlappingAtoms.indexOf(pairA)],
        centerOfMass
      );
      const distanceB = getDistanceBetweenTwoPoints(
        overlappingMidpoints[overlappingAtoms.indexOf(pairB)],
        centerOfMass
      );

      return distanceA - distanceB;
    });

    return sortedAtomPairs;
  } else {
    return overlappingAtoms;
  }
}

function findOverlapAtomsPath(graph: Graph, overlappingAtoms: [Atom, Atom]): Atom[] {
  const [firstOverlapAtom, secondOverlapAtom] = overlappingAtoms;
  const shortestPath = findShortestPath(graph, firstOverlapAtom, secondOverlapAtom);
  if (shortestPath === null) {
    return [];
  }
  return shortestPath;
}

export const findShortestPathOverlappingBonds = (molecule: Molecule, graph: Graph): Atom[] => {
  const overlappingBonds = getOverlappingBonds(molecule);
  let shortestOverallPath: Atom[] = [];

  overlappingBonds.forEach(([bond1, bond2]) => {
    bond1.atoms.forEach(startAtom => {
      bond2.atoms.forEach(endAtom => {
        const path = findShortestPath(graph, startAtom, endAtom);

        if (path !== null && (shortestOverallPath.length === 0 || path.length < shortestOverallPath.length)) {
          shortestOverallPath = path;
        }
      });
    });
  });

  return shortestOverallPath;
};

function getPivotAtomFirstPath(shortestPath: Atom[]): Atom {
  if (shortestPath.length < 1) {
    throw new Error("Not enough atoms to choose a pivot");
  }
  if (shortestPath.length >= 7) {
    return shortestPath[3];
  } else if (shortestPath.length >= 5) {
    return shortestPath[2];
  } else {
    return shortestPath[1];
  }
}

function getPivotAtomSecondPath(shortestPath: Atom[]): Atom {
  if (shortestPath.length < 1) {
    throw new Error("Not enough atoms to choose a pivot");
  }
  if (shortestPath.length >= 7) {
    return shortestPath[shortestPath.length - 4];
  }
  if (shortestPath.length >= 5) {
    return shortestPath[shortestPath.length - 3];
  } else {
    return shortestPath[shortestPath.length - 2];
  }
}

function getAllConnectedAtoms(atom: Atom, excludedAtoms: Set<Atom>, molecule: Molecule): Atom[] {
  const visited = new Set<Atom>();
  const stack = [atom];

  while (stack.length > 0) {
    const currentAtom = stack.pop();
    if (currentAtom !== undefined && !excludedAtoms.has(currentAtom)) {
      visited.add(currentAtom);
      const bondedAtoms = molecule.getConnectedAtoms(currentAtom);
      for (const bondedAtom of bondedAtoms) {
        if (!visited.has(bondedAtom) && !excludedAtoms.has(bondedAtom)) {
          stack.push(bondedAtom);
        }
      }
    }
  }

  return Array.from(visited);
}

function handlePathWithLengthEightOrMore(shortestPath: Atom[], molecule: Molecule): Atom[] {
  return manageExclusionAndConnectionHandling(shortestPath, molecule, 4, 3, 4);
}

function handlePathWithLengthSeven(shortestPath: Atom[], molecule: Molecule): Atom[] {
  return manageExclusionAndConnectionHandling(shortestPath, molecule, 3, 2, 2);
}

function handlePathWithLengthSix(shortestPath: Atom[], molecule: Molecule): Atom[] {
  return manageExclusionAndConnectionHandling(shortestPath, molecule, 3, 2, 2);
}

function handlePathWithLengthFive(shortestPath: Atom[], molecule: Molecule): Atom[] {
  return manageExclusionAndConnectionHandling(shortestPath, molecule, 2, 2, 1);
}

function handlePathWithLengthFour(shortestPath: Atom[], molecule: Molecule): Atom[] {
  return manageExclusionAndConnectionHandling(shortestPath, molecule, 2, 1, 2);
}

function handlePathWithLengthTwoOrThree(shortestPath: Atom[], molecule: Molecule): Atom[] {
  return manageExclusionAndConnectionHandling(shortestPath, molecule, 2, 1, 2);
}

function firstBranch(shortestPath: Atom[], molecule: Molecule): Atom[] {
  switch (true) {
    case shortestPath.length >= 8:
      return handlePathWithLengthEightOrMore(shortestPath, molecule);
    case shortestPath.length === 7:
      return handlePathWithLengthSeven(shortestPath, molecule);
    case shortestPath.length === 6:
      return handlePathWithLengthSix(shortestPath, molecule);
    case shortestPath.length === 5:
      return handlePathWithLengthFive(shortestPath, molecule);
    case shortestPath.length === 4:
      return handlePathWithLengthFour(shortestPath, molecule);
    case shortestPath.length >= 2:
      return handlePathWithLengthTwoOrThree(shortestPath, molecule);
    default:
      throw new Error("Unexpected path length.");
  }
}

function manageExclusionAndConnectionHandling(
  shortestPath: Atom[],
  molecule: Molecule,
  excludeIndex: number,
  lastHandledIndex: number,
  specialIndex: number
): Atom[] {
  const excludedAtoms = new Set<Atom>();
  const result: Atom[] = [];

  excludedAtoms.add(shortestPath[excludeIndex]);
  molecule.getConnectedAtoms(shortestPath[excludeIndex]).forEach(atom => excludedAtoms.add(atom));

  for (let i = 0; i <= lastHandledIndex; i++) {
    if (i === specialIndex) {
      const connectedAtoms = molecule.getConnectedAtoms(shortestPath[i]);
      connectedAtoms.forEach(connectedAtom => {
        if (connectedAtom !== shortestPath[excludeIndex] && !excludedAtoms.has(connectedAtom)) {
          result.push(...getAllConnectedAtoms(connectedAtom, excludedAtoms, molecule));
        }
      });
    } else {
      result.push(...getAllConnectedAtoms(shortestPath[i], excludedAtoms, molecule));
    }
  }

  return Array.from(new Set(result));
}

function secondBranch(shortestPath: Atom[], molecule: Molecule): Atom[] {
  if (shortestPath.length < 1) {
    throw new Error("Not enough atoms to choose a pivot");
  }

  switch (true) {
    case shortestPath.length >= 8:
      return handleLongPathBranchEightOrMore(shortestPath, molecule);
    case shortestPath.length === 7:
      return handleLongPathBranchSeven(shortestPath, molecule);
    case shortestPath.length === 6:
      return handleLongPathBranchSix(shortestPath, molecule);
    case shortestPath.length === 5:
      return handleLongPathBranchFive(shortestPath, molecule);
    case shortestPath.length === 4:
      return handleLongPathBranchFour(shortestPath, molecule);
    case shortestPath.length >= 2:
      return handleLongPathBranchTwoOrThree(shortestPath, molecule);
    default:
      throw new Error("Unexpected path length.");
  }
}

function manageBranchExclusion(
  shortestPath: Atom[],
  molecule: Molecule,
  startIndex: number,
  endIndex: number,
  excludeIndex: number,
  specialIndex: number
): Atom[] {
  const excludedAtoms = new Set<Atom>();
  const result: Atom[] = [];

  excludedAtoms.add(shortestPath[excludeIndex]);
  molecule.getConnectedAtoms(shortestPath[excludeIndex]).forEach(atom => excludedAtoms.add(atom));

  for (let i = startIndex; i >= endIndex; i--) {
    if (i === specialIndex) {
      const connectedAtoms = molecule.getConnectedAtoms(shortestPath[i]);
      connectedAtoms.forEach(connectedAtom => {
        if (connectedAtom !== shortestPath[excludeIndex] && !excludedAtoms.has(connectedAtom)) {
          result.push(...getAllConnectedAtoms(connectedAtom, excludedAtoms, molecule));
        }
      });
    } else {
      result.push(...getAllConnectedAtoms(shortestPath[i], excludedAtoms, molecule));
    }
  }

  return Array.from(new Set(result));
}

function handleLongPathBranchEightOrMore(shortestPath: Atom[], molecule: Molecule): Atom[] {
  return manageBranchExclusion(
    shortestPath,
    molecule,
    shortestPath.length - 1,
    shortestPath.length - 4,
    shortestPath.length - 5,
    shortestPath.length - 4
  );
}

function handleLongPathBranchSeven(shortestPath: Atom[], molecule: Molecule): Atom[] {
  return manageBranchExclusion(
    shortestPath,
    molecule,
    shortestPath.length - 1,
    shortestPath.length - 3,
    shortestPath.length - 4,
    shortestPath.length - 3
  );
}

function handleLongPathBranchSix(shortestPath: Atom[], molecule: Molecule): Atom[] {
  return manageBranchExclusion(
    shortestPath,
    molecule,
    shortestPath.length - 1,
    shortestPath.length - 3,
    shortestPath.length - 4,
    shortestPath.length - 3
  );
}

function handleLongPathBranchFive(shortestPath: Atom[], molecule: Molecule): Atom[] {
  return manageBranchExclusion(
    shortestPath,
    molecule,
    shortestPath.length - 1,
    shortestPath.length - 3,
    shortestPath.length - 3,
    shortestPath.length - 2
  );
}

function handleLongPathBranchFour(shortestPath: Atom[], molecule: Molecule): Atom[] {
  return manageBranchExclusion(
    shortestPath,
    molecule,
    shortestPath.length - 1,
    shortestPath.length - 2,
    shortestPath.length - 3,
    shortestPath.length - 3
  );
}

function handleLongPathBranchTwoOrThree(shortestPath: Atom[], molecule: Molecule): Atom[] {
  return manageBranchExclusion(
    shortestPath,
    molecule,
    shortestPath.length - 1,
    shortestPath.length - 2,
    shortestPath.length - 3,
    shortestPath.length - 3
  );
}

export function calculateRotationDegrees(shortestPath: Atom[]): number {
  if (shortestPath.length >= 7) {
    return 10;
  } else if (shortestPath.length >= 5) {
    return 7.5;
  } else {
    return 15;
  }
}

function firstBranchAfterRotation(shortestPath: Atom[], molecule: Molecule): Atom[] {
  if (shortestPath.length < 1) {
    throw new Error("Not enough atoms to choose a pivot");
  }

  const excludedAtoms = new Set<Atom>();
  const result: Atom[] = [];

  if (shortestPath.length >= 8) {
    const excludeIndex = 3;
    excludedAtoms.add(shortestPath[excludeIndex]);
    molecule.getConnectedAtoms(shortestPath[excludeIndex]).forEach(atom => excludedAtoms.add(atom));

    for (let i = 0; i <= 2; i++) {
      if (i === 2) {
        const connectedAtoms = molecule.getConnectedAtoms(shortestPath[i]);
        connectedAtoms.forEach(connectedAtom => {
          if (connectedAtom !== shortestPath[3] && !excludedAtoms.has(connectedAtom)) {
            result.push(...getAllConnectedAtoms(connectedAtom, excludedAtoms, molecule));
          }
        });
      } else {
        result.push(...getAllConnectedAtoms(shortestPath[i], excludedAtoms, molecule));
      }
    }
  } else if (shortestPath.length === 6) {
    const excludeIndex = 2;
    excludedAtoms.add(shortestPath[excludeIndex]);
    molecule.getConnectedAtoms(shortestPath[excludeIndex]).forEach(atom => excludedAtoms.add(atom));

    for (let i = 0; i <= 2; i++) {
      if (i === 2) {
        const connectedAtoms = molecule.getConnectedAtoms(shortestPath[i]);
        connectedAtoms.forEach(connectedAtom => {
          if (connectedAtom !== shortestPath[2] && !excludedAtoms.has(connectedAtom)) {
            result.push(...getAllConnectedAtoms(connectedAtom, excludedAtoms, molecule));
          }
        });
      } else {
        result.push(...getAllConnectedAtoms(shortestPath[i], excludedAtoms, molecule));
      }
    }
  } else if (shortestPath.length === 7) {
    const excludeIndex = 3;
    excludedAtoms.add(shortestPath[excludeIndex]);
    molecule.getConnectedAtoms(shortestPath[excludeIndex]).forEach(atom => excludedAtoms.add(atom));

    for (let i = 0; i <= 2; i++) {
      if (i === 2) {
        const connectedAtoms = molecule.getConnectedAtoms(shortestPath[i]);
        connectedAtoms.forEach(connectedAtom => {
          if (connectedAtom !== shortestPath[3] && !excludedAtoms.has(connectedAtom)) {
            result.push(...getAllConnectedAtoms(connectedAtom, excludedAtoms, molecule));
          }
        });
      } else {
        result.push(...getAllConnectedAtoms(shortestPath[i], excludedAtoms, molecule));
      }
    }
  } else if (shortestPath.length === 5) {
    const excludeIndex = 2;
    excludedAtoms.add(shortestPath[excludeIndex]);
    molecule.getConnectedAtoms(shortestPath[excludeIndex]).forEach(atom => excludedAtoms.add(atom));

    for (let i = 0; i <= 1; i++) {
      if (i === 1) {
        const connectedAtoms = molecule.getConnectedAtoms(shortestPath[i]);
        connectedAtoms.forEach(connectedAtom => {
          if (connectedAtom !== shortestPath[2] && !excludedAtoms.has(connectedAtom)) {
            result.push(...getAllConnectedAtoms(connectedAtom, excludedAtoms, molecule));
          }
        });
      } else {
        result.push(...getAllConnectedAtoms(shortestPath[i], excludedAtoms, molecule));
      }
    }
  } else if (shortestPath.length === 4) {
    const excludeIndex = 1;
    excludedAtoms.add(shortestPath[excludeIndex]);
    molecule.getConnectedAtoms(shortestPath[excludeIndex]).forEach(atom => excludedAtoms.add(atom));

    for (let i = 0; i <= 1; i++) {
      if (i === 1) {
        const connectedAtoms = molecule.getConnectedAtoms(shortestPath[i]);
        connectedAtoms.forEach(connectedAtom => {
          if (connectedAtom !== shortestPath[1] && !excludedAtoms.has(connectedAtom)) {
            result.push(...getAllConnectedAtoms(connectedAtom, excludedAtoms, molecule));
          }
        });
      } else {
        result.push(...getAllConnectedAtoms(shortestPath[i], excludedAtoms, molecule));
      }
    }
  } else if (shortestPath.length >= 2) {
    const excludeIndex = 1;
    excludedAtoms.add(shortestPath[excludeIndex]);
    molecule.getConnectedAtoms(shortestPath[excludeIndex]).forEach(atom => excludedAtoms.add(atom));

    result.push(...getAllConnectedAtoms(shortestPath[0], excludedAtoms, molecule));
  }

  return Array.from(new Set(result));
}

function secondBranchAfterRotation(shortestPath: Atom[], molecule: Molecule): Atom[] {
  if (shortestPath.length < 1) {
    throw new Error("Not enough atoms to choose a pivot");
  }

  const excludedAtoms = new Set<Atom>();
  const result: Atom[] = [];

  if (shortestPath.length >= 8) {
    const excludeIndex = shortestPath.length - 4;
    excludedAtoms.add(shortestPath[excludeIndex]);
    molecule.getConnectedAtoms(shortestPath[excludeIndex]).forEach(atom => excludedAtoms.add(atom));

    for (let i = shortestPath.length - 1; i >= shortestPath.length - 3; i--) {
      if (i === shortestPath.length - 3) {
        const connectedAtoms = molecule.getConnectedAtoms(shortestPath[i]);
        connectedAtoms.forEach(connectedAtom => {
          if (connectedAtom !== shortestPath[excludeIndex] && !excludedAtoms.has(connectedAtom)) {
            result.push(...getAllConnectedAtoms(connectedAtom, excludedAtoms, molecule));
          }
        });
      } else {
        result.push(...getAllConnectedAtoms(shortestPath[i], excludedAtoms, molecule));
      }
    }
  } else if (shortestPath.length === 6) {
    const excludeIndex = shortestPath.length - 3;
    excludedAtoms.add(shortestPath[excludeIndex]);
    molecule.getConnectedAtoms(shortestPath[excludeIndex]).forEach(atom => excludedAtoms.add(atom));

    for (let i = shortestPath.length - 1; i >= shortestPath.length - 3; i--) {
      if (i === shortestPath.length - 3) {
        const connectedAtoms = molecule.getConnectedAtoms(shortestPath[i]);
        connectedAtoms.forEach(connectedAtom => {
          if (connectedAtom !== shortestPath[excludeIndex] && !excludedAtoms.has(connectedAtom)) {
            result.push(...getAllConnectedAtoms(connectedAtom, excludedAtoms, molecule));
          }
        });
      } else {
        result.push(...getAllConnectedAtoms(shortestPath[i], excludedAtoms, molecule));
      }
    }
  } else if (shortestPath.length === 7) {
    const excludeIndex = shortestPath.length - 3;
    excludedAtoms.add(shortestPath[excludeIndex]);
    molecule.getConnectedAtoms(shortestPath[excludeIndex]).forEach(atom => excludedAtoms.add(atom));

    for (let i = shortestPath.length - 1; i >= shortestPath.length - 3; i--) {
      if (i === shortestPath.length - 2) {
        const connectedAtoms = molecule.getConnectedAtoms(shortestPath[i]);
        connectedAtoms.forEach(connectedAtom => {
          if (connectedAtom !== shortestPath[excludeIndex] && !excludedAtoms.has(connectedAtom)) {
            result.push(...getAllConnectedAtoms(connectedAtom, excludedAtoms, molecule));
          }
        });
      } else {
        result.push(...getAllConnectedAtoms(shortestPath[i], excludedAtoms, molecule));
      }
    }
  } else if (shortestPath.length === 5) {
    const excludeIndex = shortestPath.length - 3;
    excludedAtoms.add(shortestPath[excludeIndex]);
    molecule.getConnectedAtoms(shortestPath[excludeIndex]).forEach(atom => excludedAtoms.add(atom));

    for (let i = shortestPath.length - 1; i >= shortestPath.length - 2; i--) {
      if (i === shortestPath.length - 2) {
        const connectedAtoms = molecule.getConnectedAtoms(shortestPath[i]);
        connectedAtoms.forEach(connectedAtom => {
          if (connectedAtom !== shortestPath[excludeIndex] && !excludedAtoms.has(connectedAtom)) {
            result.push(...getAllConnectedAtoms(connectedAtom, excludedAtoms, molecule));
          }
        });
      } else {
        result.push(...getAllConnectedAtoms(shortestPath[i], excludedAtoms, molecule));
      }
    }
  } else if (shortestPath.length === 4) {
    const excludeIndex = shortestPath.length - 1;
    excludedAtoms.add(shortestPath[excludeIndex]);
    molecule.getConnectedAtoms(shortestPath[excludeIndex]).forEach(atom => excludedAtoms.add(atom));

    for (let i = shortestPath.length - 1; i >= shortestPath.length - 1; i--) {
      if (i === shortestPath.length - 1) {
        const connectedAtoms = molecule.getConnectedAtoms(shortestPath[i]);
        connectedAtoms.forEach(connectedAtom => {
          if (connectedAtom !== shortestPath[shortestPath.length - 1] && !excludedAtoms.has(connectedAtom)) {
            result.push(...getAllConnectedAtoms(connectedAtom, excludedAtoms, molecule));
          }
        });
      } else {
        result.push(...getAllConnectedAtoms(shortestPath[i], excludedAtoms, molecule));
      }
    }
  } else if (shortestPath.length >= 2) {
    const excludeIndex = shortestPath.length - 1;
    excludedAtoms.add(shortestPath[excludeIndex]);
    molecule.getConnectedAtoms(shortestPath[excludeIndex]).forEach(atom => excludedAtoms.add(atom));

    for (let i = shortestPath.length - 1; i >= shortestPath.length - 1; i--) {
      result.push(...getAllConnectedAtoms(shortestPath[i], excludedAtoms, molecule));
    }
  }

  return Array.from(new Set(result));
}

function getAllShortestPaths(molecule: Molecule, overlappingAtoms: Array<[Atom, Atom]>): Atom[][] {
  const graph = createGraph(molecule);
  const allShortestPaths: Atom[][] = [];
  overlappingAtoms.forEach(overlappingPair => {
    const shortestPath = findOverlapAtomsPath(graph, overlappingPair);
    allShortestPaths.push(shortestPath);
  });
  return allShortestPaths;
}

function isAtomRecurring(allShortestPaths: Atom[][], atom: Atom): boolean {
  let seenCount = 0;
  for (const path of allShortestPaths) {
    if (path.some(a => a === atom)) {
      seenCount++;
      if (seenCount > 1) {
        return true;
      }
    }
  }

  return false;
}
function checkAtomsInFirstPath(
  molecule: Molecule,
  allShortestPaths: Atom[][],
  shortestPath: Atom[]
): Atom[] | undefined {
  if (shortestPath.length >= 7) {
    const isAtomFirstRecurring = isAtomRecurring(allShortestPaths, shortestPath[1]);
    const isAtomSecondRecurring = isAtomRecurring(allShortestPaths, shortestPath[2]);
    const isAtomThirdRecurring = isAtomRecurring(allShortestPaths, shortestPath[3]);
    if (isAtomFirstRecurring && isAtomSecondRecurring && isAtomThirdRecurring) {
      const first = handlePathWithLengthTwoOrThree(shortestPath, molecule);
      return first;
    } else if (isAtomSecondRecurring && isAtomThirdRecurring) {
      const second = handlePathWithLengthFour(shortestPath, molecule);
      return second;
    } else if (isAtomThirdRecurring) {
      const third = handlePathWithLengthSeven(shortestPath, molecule);
      return third;
    } else {
      return undefined;
    }
  }
  if (shortestPath.length >= 5) {
    const isAtomFirstRecurring = isAtomRecurring(allShortestPaths, shortestPath[1]);
    const isAtomSecondRecurring = isAtomRecurring(allShortestPaths, shortestPath[2]);
    if (isAtomFirstRecurring && isAtomSecondRecurring) {
      const first = handlePathWithLengthTwoOrThree(shortestPath, molecule);
      return first;
    } else if (isAtomSecondRecurring) {
      const second = handlePathWithLengthTwoOrThree(shortestPath, molecule);
      return second;
    } else {
      return undefined;
    }
  }
  return undefined;
}

export function checkAtomsInSecondPath(
  molecule: Molecule,
  allShortestPaths: Atom[][],
  shortestPath: Atom[]
): Atom[] | undefined {
  if (shortestPath.length >= 7) {
    const isAtomFirstRecurring = isAtomRecurring(allShortestPaths, shortestPath[shortestPath.length - 2]);
    const isAtomSecondRecurring = isAtomRecurring(allShortestPaths, shortestPath[shortestPath.length - 3]);
    const isAtomThirdRecurring = isAtomRecurring(allShortestPaths, shortestPath[shortestPath.length - 4]);
    if (isAtomFirstRecurring && isAtomSecondRecurring && isAtomThirdRecurring) {
      const first = handleLongPathBranchTwoOrThree(shortestPath, molecule);
      return first;
    } else if (isAtomSecondRecurring && isAtomThirdRecurring) {
      const second = handleLongPathBranchFour(shortestPath, molecule);
      return second;
    } else if (isAtomThirdRecurring) {
      const third = handleLongPathBranchSeven(shortestPath, molecule);
      return third;
    } else {
      return undefined;
    }
  }
  if (shortestPath.length >= 5) {
    const isAtomFirstRecurring = isAtomRecurring(allShortestPaths, shortestPath[shortestPath.length - 2]);
    const isAtomSecondRecurring = isAtomRecurring(allShortestPaths, shortestPath[shortestPath.length - 3]);
    if (isAtomFirstRecurring && isAtomSecondRecurring) {
      const first = handleLongPathBranchTwoOrThree(shortestPath, molecule);
      return first;
    } else if (isAtomSecondRecurring) {
      const second = handleLongPathBranchTwoOrThree(shortestPath, molecule);
      return second;
    } else {
      return undefined;
    }
  }
  return undefined;
}

function findAtomsOccurringMoreThanOnce(allShortestPaths: Atom[][]): Atom[] {
  const atomCount: Map<Atom, number> = new Map<Atom, number>();
  const duplicateAtoms: Set<Atom> = new Set<Atom>();
  allShortestPaths.forEach(path => {
    path.forEach(atom => {
      const count = atomCount.get(atom) ?? 0;
      atomCount.set(atom, count + 1);
      if (count === 1) {
        duplicateAtoms.add(atom);
      }
    });
  });

  return Array.from(duplicateAtoms);
}
