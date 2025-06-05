import { type Atom, type Molecule } from "@models";

export type Graph = Map<Atom, Set<Atom>>;

export const createGraph = (molecule: Molecule): Graph => {
  const graph = new Map<Atom, Set<Atom>>();
  molecule.bonds.forEach(bond => {
    addEdge(graph, bond.from, bond.to);
  });
  return graph;
};

export function getSubGraph(graph: Graph, startAtom: Atom, excludeAtoms: Atom[]): Graph {
  const subGraph = new Map<Atom, Set<Atom>>();
  const visitedItems = new Set<Atom>([...excludeAtoms]);
  const connectedAtoms = graph.get(startAtom);

  const notVisitedConnectedAtoms = Array.from(connectedAtoms ?? []).filter(atom => !visitedItems.has(atom));

  visitedItems.add(startAtom);
  if (notVisitedConnectedAtoms === undefined) {
    return subGraph;
  }
  for (const notVisitedConnectedAtom of notVisitedConnectedAtoms) {
    addEdge(subGraph, startAtom, notVisitedConnectedAtom);
    visitedItems.add(notVisitedConnectedAtom);
    const connectedAtomSubGraph = getSubGraph(graph, notVisitedConnectedAtom, [...visitedItems]);
    mergeGraphs(subGraph, connectedAtomSubGraph);
  }
  return subGraph;
}

export function removeCyclesInGraph(graph: Graph, cycles: Atom[][]): void {
  for (const cycle of cycles) {
    for (let i = 0; i < cycle.length - 1; i++) {
      removeEdge(graph, cycle[i], cycle[i + 1]);
    }
    removeEdge(graph, cycle[cycle.length - 1], cycle[0]);
  }
}

export function findLongestChainInGraph(graph: Graph, startAtom?: Atom): Atom[] {
  let longestChain: Atom[] = [];

  function dfs(current: Atom, path: Atom[], visited: Set<Atom>): void {
    visited.add(current);
    path.push(current);

    let isEnd = true;
    for (const neighbor of graph.get(current) ?? []) {
      if (!visited.has(neighbor)) {
        isEnd = false;
        dfs(neighbor, path.slice(), visited);
      }
    }

    if (isEnd && path.length > longestChain.length) {
      longestChain = path;
    }
  }

  if (startAtom !== undefined) {
    const visited = new Set<Atom>();
    dfs(startAtom, [], visited);
  } else {
    for (const node of graph.keys()) {
      const visited = new Set<Atom>();
      dfs(node, [], visited);
    }
  }
  return longestChain;
}

export function findAllCyclesInGraph(graph: Graph): Atom[][] {
  const cycles: Atom[][] = [];
  const uniqueCycles = new Set<string>();

  function dfs(current: Atom, parent: Atom | null, path: Atom[]): void {
    const pathIndex = path.indexOf(current);
    if (pathIndex !== -1) {
      const cycle = path.slice(pathIndex);
      const cycleNormalized = normalizeCycle(cycle);
      if (!uniqueCycles.has(cycleNormalized)) {
        cycles.push(cycle);
        uniqueCycles.add(cycleNormalized);
      }
      return;
    }

    path.push(current);
    const neighbors = graph.get(current) ?? [];

    for (const neighbor of neighbors) {
      if (neighbor !== parent) {
        dfs(neighbor, current, [...path]);
      }
    }
  }

  const allNodes = Array.from(graph.keys());
  for (const node of allNodes) {
    if (!uniqueCycles.has(node.toString())) {
      dfs(node, null, []);
    }
  }

  return cycles;
}

function normalizeCycle(cycle: Atom[]): string {
  const cycleRepresentation = cycle.map(atom => atom.toString()).sort();
  return cycleRepresentation.join("-");
}

export function addEdge(graph: Graph, from: Atom, to: Atom): void {
  if (!graph.has(from)) {
    graph.set(from, new Set());
  }
  if (!graph.has(to)) {
    graph.set(to, new Set());
  }
  graph.get(from)?.add(to);
  graph.get(to)?.add(from);
}

export function removeEdge(graph: Graph, node1: Atom, node2: Atom): void {
  if (graph.has(node1)) {
    graph.get(node1)?.delete(node2);
  }
  if (graph.has(node2)) {
    graph.get(node2)?.delete(node1);
  }
}

export function mergeGraphs(mainGraph: Graph, graphToAdd: Graph): void {
  graphToAdd.forEach((value, key) => {
    if (mainGraph.has(key)) {
      for (const item of value) {
        mainGraph.get(key)?.add(item);
      }
    } else {
      mainGraph.set(key, value);
    }
  });
}
