import { type FixingScope, type RulesValidationResults } from "@infrastructure";
import { type Atom, type Bond, type Molecule } from "@models";
import { type RuleAlgorithm } from "@rules/infrastructure";

export interface BondAngleAlgorithmType {
  fixingRule?: boolean;
  fixingScope?: FixingScope[];
}

export const BOND_ANGLE_MORE_THAN_FOUR = "bond-angle:5.3.7";

type Graph = Map<Atom, Atom[]>;

export const bondAngleAlgorithm: RuleAlgorithm<BondAngleAlgorithmType> = (structure, config) => {
  const output: RulesValidationResults[] = [];
  const molecules = structure.molecules();

  for (const molecule of molecules) {
    const bonds = Array.from(molecule.bonds());
    const graph = new Map<Atom, Atom[]>();
    bonds.forEach(bond => {
      addEdge(graph, bond.from, bond.to);
    });
    const cycles = findAllCycles(graph);
    removeCycles(graph, cycles);
    const longestChain = findLongestChain(graph);
    if (longestChain.length < 3) {
      continue;
    }
    const centerAtoms = longestChain.slice(1, -1);

    for (const atom of centerAtoms) {
      const atomBonds = bonds.filter(bond => bond.from === atom || bond.to === atom);

      if (atomBonds.length > 4) {
        // 5.3.7
        checkAndFixMoreThanFourBondsAngles(atomBonds, atom, longestChain, molecule, output, config);
      }
      // TODO other rules
    }
  }
  return output;
};

function checkAndFixMoreThanFourBondsAngles(
  atomBonds: Bond[],
  atom: Atom,
  longestChain: Atom[],
  molecule: Molecule,
  output: RulesValidationResults[],
  config: BondAngleAlgorithmType
): void {
  const connectedAtoms = atomBonds.map(bond => (bond.from === atom ? bond.to : bond.from));

  let referenceAtom = longestChain[longestChain.indexOf(atom) - 1];

  const angleStep = 360 / atomBonds.length;

  const angles = connectedAtoms.map(x => calculateAngleBetweenBonds(atom, referenceAtom, x)).sort((a, b) => b - a);
  const correctAngles = Array.from({ length: atomBonds.length }, (_, i) => 0 + i * angleStep);

  if (compareAngles(angles, correctAngles)) {
    return;
  }

  const path = `${molecule.id}->atom->${molecule.getAtomIndex(atom)}`;
  const fixingScope = config.fixingScope?.find(
    scope => scope.errorCode === BOND_ANGLE_MORE_THAN_FOUR && scope.path === path
  );

  if (config.fixingRule === true || fixingScope !== undefined) {
    const atomsWithoutReference = connectedAtoms.filter(atom => atom !== referenceAtom);
    const atomsWithoutReferenceSorted = atomsWithoutReference.sort(
      (a, b) => calculateAngleBetweenBonds(atom, referenceAtom, a) - calculateAngleBetweenBonds(atom, referenceAtom, b)
    );
    atomsWithoutReferenceSorted.forEach(connectedAtom => {
      // Calculate distance from center atom to connected atom
      const distance = Math.sqrt(
        (connectedAtom.x - atom.x) * (connectedAtom.x - atom.x) +
          (connectedAtom.y - atom.y) * (connectedAtom.y - atom.y)
      );

      const newPosition = findCoordinatesForAngle(referenceAtom, atom, distance, angleStep);
      connectedAtom.changePosition(newPosition.x, newPosition.y);

      referenceAtom = connectedAtom;
    });
  } else {
    output.push({
      isFixable: true,
      errorCode: BOND_ANGLE_MORE_THAN_FOUR,
      message: `Inspecto has detected an atom:${atom.label} in the longest chain with more than 4 bonds with not equal angles`,
      path,
    });
  }
}

function compareAngles(angles1: number[], angles2: number[]): boolean {
  const epsilon = 1;
  for (let index = 0; index < angles1.length; index++) {
    if (Math.abs(angles2[index] - angles1[index]) > epsilon) {
      return false;
    }
  }
  return true;
}

function calculateAngleBetweenBonds(centerAtom: Atom, atom1: Atom, atom2: Atom): number {
  // Calculate vector (atom1 -> atom2)
  const vector1 = { x: atom1.x - centerAtom.x, y: atom1.y - centerAtom.y };

  // Calculate vector (atom1 -> atom3)
  const vector2 = { x: atom2.x - centerAtom.x, y: atom2.y - centerAtom.y };

  // Calculate dot product of vector1 and vector2
  const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;

  // Calculate magnitudes of vector1 and vector2
  const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
  const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);

  // Calculate the cosine of the angle
  const cosTheta = dotProduct / (magnitude1 * magnitude2);

  // Ensure the value is within the valid range for arccos
  const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta));

  // Calculate the angle in radians
  const angleInRadians = Math.acos(clampedCosTheta);

  // Convert the angle to degrees
  const angleInDegrees = angleInRadians * (180 / Math.PI);

  // Calculate the cross product to determine the sign of the angle
  const crossProduct = vector1.x * vector2.y - vector1.y * vector2.x;

  // Adjust the angle for clockwise direction
  const angle = crossProduct > 0 ? 360 - angleInDegrees : angleInDegrees;

  return angle;
}

function findCoordinatesForAngle(
  referenceAtom: Atom,
  centerAtom: Atom,
  distance: number,
  angle: number
): { x: number; y: number } {
  const radians = (180 - angle) * (Math.PI / 180);

  const referenceVectorX = centerAtom.x - referenceAtom.x;
  const referenceVectorY = centerAtom.y - referenceAtom.y;

  // Calculate the length of reference vector.
  const referenceVectorLength = Math.sqrt(referenceVectorX * referenceVectorX + referenceVectorY * referenceVectorY);

  // Normalize the reference vector.
  const referenceVectorXNorm = referenceVectorX / referenceVectorLength;
  const referenceVectorYNorm = referenceVectorY / referenceVectorLength;

  // Calculate the components of the rotated vector
  const cosA = Math.cos(radians);
  const sinA = Math.sin(radians);

  const rotatedVectorXNorm = referenceVectorXNorm * cosA - referenceVectorYNorm * sinA;
  const rotatedVectorYNorm = referenceVectorXNorm * sinA + referenceVectorYNorm * cosA;

  // Scale the rotated vector to the length
  const rotatedVectorXScaled = rotatedVectorXNorm * distance;
  const rotatedVectorYScaled = rotatedVectorYNorm * distance;

  // Calculate the new coordinates
  const newX = centerAtom.x + rotatedVectorXScaled;
  const newY = centerAtom.y + rotatedVectorYScaled;

  return { x: newX, y: newY };
}

function removeCycles(graph: Graph, cycles: Atom[][]): void {
  for (const cycle of cycles) {
    for (let i = 0; i < cycle.length - 1; i++) {
      removeEdge(graph, cycle[i], cycle[i + 1]);
    }
    // Remove the edge that closes the cycle
    removeEdge(graph, cycle[cycle.length - 1], cycle[0]);
  }
}

function removeEdge(graph: Graph, node1: Atom, node2: Atom): void {
  graph.set(
    node1,
    (graph.get(node1) ?? []).filter(n => n !== node2)
  );
  graph.set(
    node2,
    (graph.get(node2) ?? []).filter(n => n !== node1)
  );
}

function addEdge(graph: Graph, from: Atom, to: Atom): void {
  if (!graph.has(from)) {
    graph.set(from, []);
  }
  if (!graph.has(to)) {
    graph.set(to, []);
  }
  graph.get(from)?.push(to);
  graph.get(to)?.push(from);
}

function findLongestChain(graph: Graph): Atom[] {
  let longestChain: Atom[] = [];
  const visited = new Set<Atom>();

  function dfs(current: Atom, path: Atom[]): void {
    visited.add(current);
    path.push(current);

    let isEnd = true;
    for (const neighbor of graph.get(current) ?? []) {
      if (!visited.has(neighbor)) {
        isEnd = false;
        dfs(neighbor, path.slice());
      }
    }

    if (isEnd && path.length > longestChain.length) {
      longestChain = path;
    }
  }

  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      dfs(node, []);
    }
  }

  return longestChain;
}

function findAllCycles(graph: Graph): Atom[][] {
  const cycles: Atom[][] = [];
  const visited = new Set<Atom>();
  function dfs(current: Atom, parent: Atom, path: Atom[]): void {
    visited.add(current);
    path.push(current);
    for (const neighbor of graph.get(current) ?? []) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, current, path.slice());
      } else if (neighbor !== parent && path.includes(neighbor)) {
        // Cycle detected
        const cycleStartIndex = path.indexOf(neighbor);
        const cycle = path.slice(cycleStartIndex);
        cycle.push(neighbor); // To make it a complete cycle
        cycles.push(cycle);
      }
    }
  }
  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      dfs(node, null as any, []);
    }
  }
  return cycles;
}
