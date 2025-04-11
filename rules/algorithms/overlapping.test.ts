import { describe, it } from "vitest";
import { Bond, Molecule, BOND_TYPES } from "@models";
import {
  isAtomsOverlapping,
  getOverlappingAtoms,
  getOverlappingBonds,
  findShortestPath,
  calculateMidpoint,
  sortOverlapsBySymmetry,
  calculateCenterOfMass,
  isStructureSymmetrical,
  calculateAtomDistancesToCenterOfMass,
  findShortestPathOverlappingBonds,
} from "./overlapping";
import type { SGroup, Atom } from "@models";
import { createAtomWithLocation } from "@utils/createAtomWithLocation";
import { createGraph, getDistanceBetweenTwoPoints } from "@utils";

function createMoleculeWithOverlappingAtoms(): Molecule {
  const atomA = createAtomWithLocation("C", 0, 0, 0);
  const atomB = createAtomWithLocation("C", 0, 0.5, 0);
  const atomC = createAtomWithLocation("C", 5, 0, 0);
  const bondAB = new Bond(BOND_TYPES.SINGLE, [atomA, atomB], [0, 1]);
  const bondBC = new Bond(BOND_TYPES.SINGLE, [atomB, atomC], [1, 2]);
  const sgroups: SGroup[] = [];
  const molecule = new Molecule("MockMolecule", [atomA, atomB, atomC], [bondAB, bondBC], sgroups);

  return molecule;
}

function createMoleculeWithOverlappingBonds(): Molecule {
  const atomA = createAtomWithLocation("C", 0, 0, 0);
  const atomB = createAtomWithLocation("C", 1, 0, 0);
  const atomC = createAtomWithLocation("C", 1, 1, 0);
  const atomD = createAtomWithLocation("C", 2, 0, 0);
  const bondAB = new Bond(BOND_TYPES.SINGLE, [atomA, atomB], [0, 1]);
  const bondBC = new Bond(BOND_TYPES.SINGLE, [atomB, atomC], [1, 2]);
  const bondAD = new Bond(BOND_TYPES.SINGLE, [atomA, atomD], [0, 3]);
  const sgroups: SGroup[] = [];
  const molecule = new Molecule("MockMolecule", [atomA, atomB, atomC, atomD], [bondAB, bondBC, bondAD], sgroups);

  return molecule;
}

function createSampleGraph(): Map<Atom, Set<Atom>> {
  const atomA = createAtomWithLocation("C", 0, 0, 0);
  const atomB = createAtomWithLocation("C", 1, 0, 0);
  const atomC = createAtomWithLocation("C", 2, 0, 0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const bondAB = new Bond(BOND_TYPES.SINGLE, [atomA, atomB], [0, 1]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const bondBC = new Bond(BOND_TYPES.SINGLE, [atomB, atomC], [1, 2]);
  const graph = new Map<Atom, Set<Atom>>();
  graph.set(atomA, new Set([atomB]));
  graph.set(atomB, new Set([atomA, atomC]));
  graph.set(atomC, new Set([atomB]));

  return graph;
}

function createTestMolecule(): Molecule {
  const atomA = createAtomWithLocation("C", 0, 0, 0);
  const atomB = createAtomWithLocation("C", 1, 0, 0);
  const atomC = createAtomWithLocation("C", 2, 0, 0);
  const atomD = createAtomWithLocation("C", 3, 0, 0);
  const bondAB = new Bond(BOND_TYPES.SINGLE, [atomA, atomB], [0, 1]);
  const bondBC = new Bond(BOND_TYPES.SINGLE, [atomB, atomC], [1, 2]);
  const bondCD = new Bond(BOND_TYPES.SINGLE, [atomC, atomD], [2, 3]);
  const sgroups: SGroup[] = [];
  const molecule = new Molecule("MockMolecule", [atomA, atomB, atomC, atomD], [bondAB, bondBC, bondCD], sgroups);

  return molecule;
}

function createSymmetricalMolecule(): Molecule {
  const atomA = createAtomWithLocation("C", -2, 0, 0);
  const atomB = createAtomWithLocation("C", -1, 0, 0);
  const atomC = createAtomWithLocation("C", 1, 0, 0);
  const atomD = createAtomWithLocation("C", 2, 0, 0);
  const bondAB = new Bond(BOND_TYPES.SINGLE, [atomA, atomB], [0, 1]);
  const bondBC = new Bond(BOND_TYPES.SINGLE, [atomB, atomC], [1, 2]);
  const bondCD = new Bond(BOND_TYPES.SINGLE, [atomC, atomD], [2, 3]);
  const sgroups: SGroup[] = [];
  const molecule = new Molecule("SymmetricalMolecule", [atomA, atomB, atomC, atomD], [bondAB, bondBC, bondCD], sgroups);

  return molecule;
}

function createAsymmetricalMolecule(): Molecule {
  const atomA = createAtomWithLocation("C", 0, 0, 0);
  const atomB = createAtomWithLocation("C", -2, 0, 0);
  const atomC = createAtomWithLocation("C", 2, 0, 0);
  const atomD = createAtomWithLocation("C", 4, 0, 0);
  const bondAB = new Bond(BOND_TYPES.SINGLE, [atomA, atomB], [0, 1]);
  const bondBC = new Bond(BOND_TYPES.SINGLE, [atomB, atomC], [1, 2]);
  const bondCD = new Bond(BOND_TYPES.SINGLE, [atomC, atomD], [2, 3]);
  const sgroups: SGroup[] = [];
  const molecule = new Molecule("SymmetricalMolecule", [atomA, atomB, atomC, atomD], [bondAB, bondBC, bondCD], sgroups);

  return molecule;
}

describe("getOverlappingAtoms", () => {
  it("should return a list of overlapping atom pairs", ({ expect }) => {
    const molecule = createMoleculeWithOverlappingAtoms();
    const config = { bondLength: 1, overlappingFactor: 1 };
    const overlappingAtoms = getOverlappingAtoms(molecule, config);
    const atomCoordinates = overlappingAtoms.map(([a, b]) => [a.x, a.y, a.z, b.x, b.y, b.z]);

    expect(atomCoordinates).toEqual([[0, 0, 0, 0, 0.5, 0]]);
  });
});

describe("isAtomsOverlapping", () => {
  it("should return true if atoms are overlapping", ({ expect }) => {
    const atom1 = createAtomWithLocation("C", 0, 0, 0);
    const atom2 = createAtomWithLocation("C", 0.2, 0.2, 0.2);
    const config = { bondLength: 1.5, overlappingFactor: 0.3 };
    const isOverlapping = isAtomsOverlapping(atom1, atom2, config);
    expect(isOverlapping).toBe(true);
  });

  it("should return false if atoms are not overlapping", ({ expect }) => {
    const atom1 = createAtomWithLocation("C", 0, 0, 0);
    const atom2 = createAtomWithLocation("C", 2, 2, 2);
    const config = { bondLength: 1.5, overlappingFactor: 0.9 };
    const isOverlapping = isAtomsOverlapping(atom1, atom2, config);
    expect(isOverlapping).toBe(false);
  });
});

describe("getOverlappingBonds", () => {
  it("should return a list of overlapping bond pairs", ({ expect }) => {
    const molecule = createMoleculeWithOverlappingBonds();
    const overlappingBonds = getOverlappingBonds(molecule);

    expect(overlappingBonds.map(([b1, b2]) => [b1.bondType, b2.bondType])).toEqual([
      [BOND_TYPES.SINGLE, BOND_TYPES.SINGLE],
    ]);
  });
});

describe("findShortestPath", () => {
  it("should return the shortest path between two atoms in a graph", ({ expect }) => {
    const graph = createSampleGraph();
    const atomA = Array.from(graph.keys())[0];
    const atomC = Array.from(graph.keys())[2];
    const shortestPath = findShortestPath(graph, atomA, atomC);

    expect(shortestPath?.map(atom => atom.label)).toEqual(["C", "C", "C"]);
  });
});

describe("calculateMidpoint", () => {
  it("should return the midpoint between two atoms", ({ expect }) => {
    const atomA = createAtomWithLocation("C", 2, 4, 6);
    const atomB = createAtomWithLocation("C", 8, 10, 12);
    const midpoint = calculateMidpoint(atomA, atomB);
    expect(midpoint).toEqual({ x: 5, y: 7, z: 9 });
  });
});

describe("sortOverlapsBySymmetry", () => {
  it("should sort pairs of overlapping atoms in a symmetrical molecule based on their distance from the center of mass", ({
    expect,
  }) => {
    const molecule = createSymmetricalMolecule();
    const overlappingAtoms: Array<[Atom, Atom]> = [
      [molecule.atoms[0], molecule.atoms[1]],
      [molecule.atoms[2], molecule.atoms[3]],
    ];

    const sortedAtoms = sortOverlapsBySymmetry(molecule, overlappingAtoms);

    expect(sortedAtoms).toEqual([
      [molecule.atoms[0], molecule.atoms[1]],
      [molecule.atoms[2], molecule.atoms[3]],
    ]);
  });

  it("should not alter the order of atom pairs for an asymmetrical molecule", ({ expect }) => {
    const molecule = createAsymmetricalMolecule();
    const overlappingAtoms: Array<[Atom, Atom]> = [
      [molecule.atoms[2], molecule.atoms[3]],
      [molecule.atoms[0], molecule.atoms[1]],
    ];

    const sortedAtoms = sortOverlapsBySymmetry(molecule, overlappingAtoms);

    expect(sortedAtoms).toEqual(overlappingAtoms);
  });
});

describe("calculateCenterOfMass", () => {
  it("should calculate the correct center of mass for a molecule", ({ expect }) => {
    const atom1 = createAtomWithLocation("H", 1, 2, 3);
    const atom2 = createAtomWithLocation("O", 4, 5, 6);
    const atom3 = createAtomWithLocation("N", 7, 8, 9);

    const molecule = new Molecule("someID", [atom1, atom2, atom3], [], []);

    const centerOfMass = calculateCenterOfMass(molecule.atoms);

    expect(centerOfMass.x).toBeCloseTo(4, 1);
    expect(centerOfMass.y).toBeCloseTo(5, 1);
    expect(centerOfMass.z).toBeCloseTo(6, 1);
  });
});

describe("isStructureSymmetrical", () => {
  it("returns false for a non-symmetric molecule", ({ expect }) => {
    const nonSymmetricMolecule = createTestMolecule();
    nonSymmetricMolecule.atoms[3].changePosition(5, 0, 0);
    const result = isStructureSymmetrical(nonSymmetricMolecule);
    expect(result).toBe(false);
  });

  it("returns true for a symmetric molecule", ({ expect }) => {
    const symmetricMolecule = createTestMolecule();
    const result = isStructureSymmetrical(symmetricMolecule);
    expect(result).toBe(true);
  });
});

describe("calculateAtomDistancesToCenterOfMass", () => {
  it("calculates distances from each atom to the center of mass correctly", ({ expect }) => {
    const atomA = createAtomWithLocation("A", 0, 0, 0);
    const atomB = createAtomWithLocation("B", 1, 0, 0);
    const atomC = createAtomWithLocation("C", 1, 1, 0);
    const atomD = createAtomWithLocation("D", 2, 0, 0);
    const bondAB = new Bond(BOND_TYPES.SINGLE, [atomA, atomB], [0, 1]);
    const bondBC = new Bond(BOND_TYPES.SINGLE, [atomB, atomC], [1, 2]);
    const bondCD = new Bond(BOND_TYPES.SINGLE, [atomC, atomD], [2, 3]);
    const sgroups: SGroup[] = [];
    const molecule = new Molecule(
      "SymmetricalMolecule",
      [atomA, atomB, atomC, atomD],
      [bondAB, bondBC, bondCD],
      sgroups
    );
    const centerOfMass = { x: 1, y: 0.25, z: 0 };
    const distances = calculateAtomDistancesToCenterOfMass(molecule.atoms, centerOfMass);

    expect(distances[0]).toBeCloseTo(getDistanceBetweenTwoPoints(atomA, centerOfMass));
    expect(distances[1]).toBeCloseTo(getDistanceBetweenTwoPoints(atomB, centerOfMass));
    expect(distances[2]).toBeCloseTo(getDistanceBetweenTwoPoints(atomC, centerOfMass));
    expect(distances[3]).toBeCloseTo(getDistanceBetweenTwoPoints(atomD, centerOfMass));
  });
});

//  Тестування

describe("findShortestPathOverlappingBonds", () => {
  it("should find the shortest path between overlapping bonds", ({ expect }) => {
    const atomA = createAtomWithLocation("A", 0, 0, 0);
    const atomB = createAtomWithLocation("B", 0, 2, 0);
    const atomC = createAtomWithLocation("C", 2, 2, 0);
    const atomD = createAtomWithLocation("D", 1, 1, 0);
    const atomE = createAtomWithLocation("E", -1, -1, 0);

    const bondAB = new Bond(BOND_TYPES.SINGLE, [atomA, atomB], [0, 1]);
    const bondCD = new Bond(BOND_TYPES.SINGLE, [atomC, atomD], [2, 3]);
    const bondBC = new Bond(BOND_TYPES.SINGLE, [atomB, atomC], [1, 2]);
    const bondDE = new Bond(BOND_TYPES.SINGLE, [atomD, atomE], [3, 4]);

    const molecule = new Molecule(
      "TestMolecule",
      [atomA, atomB, atomC, atomD, atomE],
      [bondAB, bondBC, bondCD, bondDE],
      []
    );
    const graph = createGraph(molecule);

    const shortestPath = findShortestPathOverlappingBonds(molecule, graph);

    expect(shortestPath).toEqual([atomB, atomC, atomD]);
  });
});
