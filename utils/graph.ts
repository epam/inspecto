import { type Atom, type Molecule } from "@models";

export type Graph = Map<Atom, Set<Atom>>;

export const createGraph = (molecule: Molecule): Graph => {
  const graph = new Map<Atom, Set<Atom>>();
  const bonds = Array.from(molecule.bonds());
  bonds.forEach(bond => {
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
  const visited = new Set<Atom>();
  function dfs(current: Atom, parent: Atom, path: Atom[]): void {
    visited.add(current);
    path.push(current);
    for (const neighbor of graph.get(current) ?? []) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, current, path.slice());
      } else if (neighbor !== parent && path.includes(neighbor)) {
        const cycleStartIndex = path.indexOf(neighbor);
        const cycle = path.slice(cycleStartIndex);
        cycle.push(neighbor);
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

function removeEdge(graph: Graph, node1: Atom, node2: Atom): void {
  if (graph.has(node1)) {
    graph.get(node1)?.delete(node2);
  }
  if (graph.has(node2)) {
    graph.get(node2)?.delete(node1);
  }
}

function mergeGraphs(mainGraph: Graph, graphToAdd: Graph): void {
  graphToAdd.forEach((value, key) => {
    if (mainGraph.has(key)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const item of value) {
        mainGraph.get(key)?.add(item);
      }
    } else {
      mainGraph.set(key, value);
    }
  });
}
