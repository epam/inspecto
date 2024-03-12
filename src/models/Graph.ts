export enum GRAPH_ERRORS {
  VERTIX_DOES_NOT_EXIST = "There is no such vertex in graph",
}

export class Graph<TVertex extends object, TEdge extends object> {
  private readonly _vertices: Map<string, Array<{ to: TVertex; edge: TEdge }>>;

  private readonly _getKey: (vertex: TVertex) => string;

  constructor(getKey: (vertex: TVertex) => string) {
    this._vertices = new Map();

    this._getKey = getKey;
  }

  public addVertex(vertex: TVertex): void {
    const key = this._getKey(vertex);
    if (!this._vertices.has(key)) {
      this._vertices.set(key, []);
    }
  }

  public addEdge(fromVertex: TVertex, toVertex: TVertex, edge: TEdge): void {
    const fromKey = this._getKey(fromVertex);
    const toKey = this._getKey(toVertex);

    if (!this._vertices.has(fromKey)) {
      this.addVertex(fromVertex);
    }
    if (!this._vertices.has(toKey)) {
      this.addVertex(toVertex);
    }

    this._vertices.get(fromKey)?.push({ to: toVertex, edge });
    this._vertices.get(toKey)?.push({ to: fromVertex, edge });
  }

  public getAdjacentVertices(
    vertex: TVertex,
  ): Array<{ to: TVertex; edge: TEdge }> {
    const key = this._getKey(vertex);
    const vertexIsFound = this._vertices.has(key);
    const output = this._vertices.get(key);

    if (vertexIsFound && output != null) {
      return output;
    }

    throw new Error(GRAPH_ERRORS.VERTIX_DOES_NOT_EXIST);
  }
}
