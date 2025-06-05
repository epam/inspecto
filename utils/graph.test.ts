import { describe, it } from "vitest";
import { Molecule } from "../inspecto/models/Molecule";
import { Atom, Bond, BOND_TYPES } from "@models";
import { Location } from "../inspecto/models/Location";
import { type Graph } from "../utils/graph";
import {
  createGraph,
  getSubGraph,
  removeCyclesInGraph,
  findLongestChainInGraph,
  findAllCyclesInGraph,
  addEdge,
  removeEdge,
  mergeGraphs,
} from "@utils";
import { ketToStructure } from "@testing";
import E1F from "../tests/mocks/bondAngle/E1F.ket?raw";
import E1T from "../tests/mocks/bondAngle/E1T.ket?raw";
import E2F from "../tests/mocks/bondAngle/E2F.ket?raw";
import E2T from "../tests/mocks/bondAngle/E2T.ket?raw";
import E9 from "../tests/mocks/bondAngle/E9.ket?raw";
import E10F from "../tests/mocks/bondAngle/E10F.ket?raw";

const createGraphFromKet = (ket: string): Graph => {
  const structure = ketToStructure(ket);
  const molecule = structure.molecules()[0];
  return createGraph(molecule);
};

describe("Find longest chain", async () => {
  it("find_longest_chain_E1F", async ({ expect }) => {
    const graph = createGraphFromKet(E1F);
    const longestChain = findLongestChainInGraph(graph);
    expect(longestChain.length).toBe(13);
  });

  it("find_longest_chain_E1T", async ({ expect }) => {
    const graph = createGraphFromKet(E1T);
    const longestChain = findLongestChainInGraph(graph);
    expect(longestChain.length).toBe(13);
  });

  it("find_longest_chain_E2F", async ({ expect }) => {
    const graph = createGraphFromKet(E2F);
    const longestChain = findLongestChainInGraph(graph);
    expect(longestChain.length).toBe(18);
  });

  it("find_longest_chain_E2T", async ({ expect }) => {
    const graph = createGraphFromKet(E2T);
    const longestChain = findLongestChainInGraph(graph);
    expect(longestChain.length).toBe(18);
  });
});

describe("find all cycles", async () => {
  it("find_cycles_E9", async ({ expect }) => {
    const graph = createGraphFromKet(E9);
    const cycles = findAllCyclesInGraph(graph);
    expect(cycles.length).toBe(1);
  });

  it("find_cycles_E10F", async ({ expect }) => {
    const graph = createGraphFromKet(E10F);
    const cycles = findAllCyclesInGraph(graph);
    expect(cycles.length).toBe(2);
  });
});

describe("remove all cycles", async () => {
  it("remove_cycles_E9", async ({ expect }) => {
    const graph = createGraphFromKet(E9);
    let cycles = findAllCyclesInGraph(graph);

    removeCyclesInGraph(graph, cycles);
    cycles = findAllCyclesInGraph(graph);

    expect(cycles.length).toBe(0);
  });

  it("remove_cycles_E10F", async ({ expect }) => {
    const graph = createGraphFromKet(E10F);
    let cycles = findAllCyclesInGraph(graph);
    removeCyclesInGraph(graph, cycles);
    cycles = findAllCyclesInGraph(graph);

    expect(cycles.length).toBe(0);
  });
});

function createMockAtom(label: string, x: number, y: number, z: number): Atom {
  const location = new Location(x, y, z);
  return new Atom(label, location, undefined, undefined, undefined, undefined);
}

function createMockBond(atom1: Atom, atom2: Atom): Bond {
  return new Bond(BOND_TYPES.SINGLE, [atom1, atom2], [0, 1]);
}

describe("Graph related functions", () => {
  it("creates a graph from a molecule", ({ expect }) => {
    const atomA = createMockAtom("A", 0, 0, 0);
    const atomB = createMockAtom("B", 1, 0, 0);
    const atomC = createMockAtom("C", 2, 0, 0);
    const bondAB = createMockBond(atomA, atomB);
    const bondBC = createMockBond(atomB, atomC);
    const molecule = new Molecule("molecule-id", [atomA, atomB, atomC], [bondAB, bondBC], []);
    const graph = createGraph(molecule);

    expect(graph.size).toBe(3);
    expect(graph.get(atomA)?.has(atomB)).toBe(true);
    expect(graph.get(atomB)?.has(atomA)).toBe(true);
    expect(graph.get(atomB)?.has(atomC)).toBe(true);
    expect(graph.get(atomC)?.has(atomB)).toBe(true);
  });

  it("extracts a connected subgraph from a graph", ({ expect }) => {
    const atomA = createMockAtom("A", 0, 0, 0);
    const atomB = createMockAtom("B", 1, 0, 0);
    const atomC = createMockAtom("C", 2, 0, 0);
    const atomD = createMockAtom("D", 3, 0, 0);
    const mainGraph = new Map<Atom, Set<Atom>>();
    mainGraph.set(atomA, new Set([atomB]));
    mainGraph.set(atomB, new Set([atomC]));
    mainGraph.set(atomC, new Set([atomB]));
    const excludeAtoms = [atomA, atomD];
    const subGraph = getSubGraph(mainGraph, atomB, excludeAtoms);

    expect(subGraph.size).toBe(2);
    expect(subGraph.has(atomA)).toBe(false);
    expect(subGraph.get(atomB)?.has(atomC)).toBe(true);
    expect(subGraph.get(atomB)?.has(atomD)).toBe(false);
  });

  it("removes cycles detected in the graph", ({ expect }) => {
    const atomA = createMockAtom("A", 0, 0, 0);
    const atomB = createMockAtom("B", 1, 0, 0);
    const atomC = createMockAtom("C", 2, 0, 0);
    const graph: Graph = new Map();
    graph.set(atomA, new Set([atomB]));
    graph.set(atomB, new Set([atomC]));
    graph.set(atomC, new Set([atomA]));
    graph.get(atomA)?.add(atomC);
    graph.get(atomB)?.add(atomA);
    graph.get(atomC)?.add(atomB);
    const cycles: Atom[][] = [[atomA, atomB, atomC]];
    removeCyclesInGraph(graph, cycles);

    expect(graph.get(atomA)?.has(atomB)).toBe(false);
    expect(graph.get(atomB)?.has(atomC)).toBe(false);
    expect(graph.get(atomC)?.has(atomA)).toBe(false);
    expect(graph.get(atomA)?.size).toBe(0);
    expect(graph.get(atomB)?.size).toBe(0);
    expect(graph.get(atomC)?.size).toBe(0);
  });

  it("finds the longest chain in the graph starting from a given atom", ({ expect }) => {
    const atomA = createMockAtom("A", 0, 0, 0);
    const atomB = createMockAtom("B", 1, 0, 0);
    const atomC = createMockAtom("C", 2, 0, 0);
    const atomD = createMockAtom("D", 3, 0, 0);
    const graph = new Map([
      [atomA, new Set([atomB])],
      [atomB, new Set([atomA, atomC])],
      [atomC, new Set([atomB, atomD])],
      [atomD, new Set([atomC])],
    ]);
    const chain = findLongestChainInGraph(graph, atomA);

    expect(chain).toEqual([atomA, atomB, atomC, atomD]);
  });

  it("adds an edge to the graph", ({ expect }) => {
    const atomA = createMockAtom("A", 0, 0, 0);
    const atomB = createMockAtom("B", 1, 0, 0);
    const graph: Graph = new Map();
    addEdge(graph, atomA, atomB);

    expect(graph.get(atomA)).toContain(atomB);
    expect(graph.get(atomB)).toContain(atomA);
  });

  it("removes an edge from the graph", ({ expect }) => {
    const atomA = createMockAtom("A", 0, 0, 0);
    const atomB = createMockAtom("B", 1, 0, 0);
    const graph: Graph = new Map([
      [atomA, new Set([atomB])],
      [atomB, new Set([atomA])],
    ]);
    removeEdge(graph, atomA, atomB);

    expect(graph.get(atomA)?.has(atomB)).toBe(false);
    expect(graph.get(atomB)?.has(atomA)).toBe(false);
  });

  it("merges two graphs together", ({ expect }) => {
    const atomA = createMockAtom("A", 0, 0, 0);
    const atomB = createMockAtom("B", 1, 0, 0);
    const atomC = createMockAtom("C", 2, 0, 0);
    const mainGraph: Graph = new Map([[atomA, new Set([atomB])]]);
    const graphToAdd: Graph = new Map([[atomB, new Set([atomC])]]);
    mergeGraphs(mainGraph, graphToAdd);

    expect(mainGraph.get(atomB)?.has(atomC)).toBe(true);
  });
});

function setupGraph(): Map<Atom, Set<Atom>> {
  const atoms = [
    createMockAtom("C", 12.593, -7.025, 0),
    createMockAtom("C", 11.727, -7.525, 0),
    createMockAtom("C", 11.727, -8.525, 0),
    createMockAtom("C", 12.593, -9.025, 0),
    createMockAtom("C", 13.459, -8.525, 0),
    createMockAtom("Cl", 13.459, -7.525, 0),
    createMockAtom("C", 14.325, -7.025, 0),
    createMockAtom("C", 14.325, -9.025, 0),
    createMockAtom("C", 15.191, -8.525, 0),
    createMockAtom("C", 15.191, -7.525, 0),
    createMockAtom("C", 16.057, -7.025, 0),
    createMockAtom("C", 16.057, -9.025, 0),
    createMockAtom("C", 16.923, -8.525, 0),
    createMockAtom("C", 16.923, -7.525, 0),
    createMockAtom("C", 13.116, -6.153, 0),
    createMockAtom("C", 13.97, -6.647, 0),
  ];

  const graph = new Map();
  atoms.forEach(atom => graph.set(atom, new Set()));
  const bonds = [
    [0, 1],
    [0, 5],
    [0, 14],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [4, 7],
    [5, 6],
    [5, 15],
    [6, 9],
    [7, 8],
    [8, 9],
    [8, 11],
    [9, 10],
    [10, 13],
    [11, 12],
    [12, 13],
    [14, 15],
  ];

  bonds.forEach(([idx1, idx2]) => {
    graph.get(atoms[idx1]).add(atoms[idx2]);
    graph.get(atoms[idx2]).add(atoms[idx1]);
  });

  return graph;
}

describe("Molecule cycles detection", () => {
  it("detects all cycles in the molecule graph", ({ expect }) => {
    const graph = setupGraph();
    const cycles = findAllCyclesInGraph(graph);

    expect(cycles).toBeInstanceOf(Array);
    expect(cycles.length).toBeGreaterThan(0);

    const hasSpecificCycle = cycles.some(cycle => cycle.length === 4);
    expect(hasSpecificCycle).toBe(true);
  });

  it("detects all cycles in the graph", ({ expect }) => {
    const atomA = createMockAtom("A", 0, 0, 0);
    const atomB = createMockAtom("B", 1, 0, 0);
    const atomC = createMockAtom("C", 2, 0, 0);
    const graph = new Map([
      [atomA, new Set([atomB, atomC])],
      [atomB, new Set([atomA, atomC])],
      [atomC, new Set([atomA, atomB])],
    ]);
    const cycles = findAllCyclesInGraph(graph);

    expect(cycles.length).toBe(1);
    expect(cycles[0].length).toBe(3);
    expect(cycles[0][0]).toBe(atomA);
    expect(cycles[0][2]).toBe(atomC);
    expect(cycles[0][1]).toBe(atomB);
  });
});
