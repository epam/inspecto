import { describe, it } from "vitest";
import { ketToStructure } from "@testing";

import E1F from "./mocks/bondAngle/E1F.ket?raw";
import E1T from "./mocks/bondAngle/E1T.ket?raw";
import E2F from "./mocks/bondAngle/E2F.ket?raw";
import E2T from "./mocks/bondAngle/E2T.ket?raw";
import E9 from "./mocks/bondAngle/E9.ket?raw";
import E10F from "./mocks/bondAngle/E10F.ket?raw";
import { createGraph, findAllCyclesInGraph, findLongestChainInGraph, type Graph, removeCyclesInGraph } from "@utils";

const createGraphFromKet = (ket: string): Graph => {
  const structure = ketToStructure(ket);
  const molecule = Array.from(structure.molecules())[0];
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
