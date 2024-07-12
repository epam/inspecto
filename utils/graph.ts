import { type Atom, type Molecule } from "@models";

export type Graph = Map<Atom, Atom[]>;

export const createGraph = (molecule: Molecule): Map<Atom, Atom[]> => {
  const graph = new Map<Atom, Atom[]>();
  const bonds = Array.from(molecule.bonds());
  bonds.forEach(bond => {
    addEdge(graph, bond.from, bond.to);
  });
  return graph;
};

export function getSubGraph(graph: Graph, startAtom: Atom, excludeAtoms: Atom[]): Graph {
  const subGraph = new Map<Atom, Atom[]>();
  const visitedItems = new Set<Atom>([...excludeAtoms]);
  const connectedAtoms = graph.get(startAtom);
  const notVisitedConnectedAtoms = connectedAtoms?.filter(connectedAtom => !visitedItems.has(connectedAtom));
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
    graph.set(from, []);
  }
  if (!graph.has(to)) {
    graph.set(to, []);
  }
  graph.get(from)?.push(to);
  graph.get(to)?.push(from);
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

function mergeGraphs(mainGraph: Graph, graphToAdd: Graph): void {
  graphToAdd.forEach((value, key) => {
    if (mainGraph.has(key)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      mainGraph.set(key, mainGraph.get(key)!.concat(value));
    } else {
      mainGraph.set(key, value);
    }
  });
}
