import { describe, it, expect, vi } from "vitest";
import { visit, type VisitorObject } from "./visit"; // Adjust the import path as needed
import type { TraverseContext } from "neotraverse";
import { Atom, Location, Molecule, Structure } from "@models";
import { Types } from "@inspecto/models/types";

describe("visit function", () => {
  it("should call Atom visitor for Atom nodes", () => {
    const obj = new Atom("A", new Location(0, 0, 0));
    const AtomVisitor: VisitorObject<Atom> = {
      before: vi.fn(),
      after: vi.fn(),
    };

    visit(obj, {
      [Types.ATOM]: AtomVisitor,
    });

    expect(AtomVisitor.before).toHaveBeenCalledWith(obj, expect.any(Object));
    expect(AtomVisitor.after).toHaveBeenCalledWith(obj, expect.any(Object));
  });

  it("should call Molecula visitor for Molecula nodes", () => {
    const obj = new Molecule("Molecule", [], [], []);
    const MoleculeVisitor: VisitorObject<Molecule> = {
      before: vi.fn(),
      after: vi.fn(),
    };

    visit(obj, {
      [Types.MOLECULE]: MoleculeVisitor,
    });

    expect(MoleculeVisitor.before).toHaveBeenCalledWith(obj, expect.any(Object));
    expect(MoleculeVisitor.after).toHaveBeenCalledWith(obj, expect.any(Object));
  });

  it("should handle nested structures", () => {
    const AtomA = new Atom("A", new Location(0, 0, 0));
    const AtomB = new Atom("B", new Location(0, 0, 0));
    const MoleculeA = new Molecule("MoleculeA", [AtomA, AtomB], [], []);
    const obj = new Structure([MoleculeA]);

    const AtomVisitor: VisitorObject<Atom> = {
      before: vi.fn(),
      after: vi.fn(),
    };

    const MoleculaVisitor: VisitorObject<Molecule> = {
      before: vi.fn(),
      after: vi.fn(),
    };

    visit(obj, { [Types.ATOM]: AtomVisitor, [Types.MOLECULE]: MoleculaVisitor });

    expect(MoleculaVisitor.before).toHaveBeenCalledWith(MoleculeA, expect.any(Object));
    expect(AtomVisitor.before).toHaveBeenCalledWith(AtomA, expect.any(Object));
    expect(AtomVisitor.before).toHaveBeenCalledWith(AtomB, expect.any(Object));
  });

  it("should modify the node during traversal using ctx.update", () => {
    const obj = {
      type: "molecule",
      children: [
        { type: "ATOM", value: "A" },
        { type: "molecule", children: [{ type: "ATOM", value: "B" }] },
      ],
    };

    const AtomVisitor: VisitorObject<Atom> = {
      before: (node: any, ctx: TraverseContext) => {
        if (node.value === "A") {
          ctx.update({ ...node, value: "Modified A" });
        }
      },
      after: vi.fn(),
    };

    const MoleculaVisitor: VisitorObject<Molecule> = {
      before: vi.fn(),
      after: vi.fn(),
    };

    visit(obj, { [Types.ATOM]: AtomVisitor, [Types.MOLECULE]: MoleculaVisitor });

    expect(obj.children[0].value).toBe("Modified A");
  });

  it("should modify the node during traversal using ctx.update in before hook and verify in after hook", () => {
    const obj = {
      type: "molecule",
      children: [
        { type: "ATOM", value: "A" },
        { type: "molecule", children: [{ type: "ATOM", value: "B" }] },
      ],
    };

    const AtomVisitor = {
      before: (node: any, ctx: TraverseContext) => {
        if (node.value === "A") {
          ctx.update({ ...node, value: "Modified A" });
        }
      },
      after: (node: any, ctx: TraverseContext) => {
        if (ctx.isLeaf && node.value === "Modified A") {
          expect(node.value).toBe("Modified A");
        }
      },
    };

    const MoleculaVisitor = {
      before: (node: any, ctx: TraverseContext) => {
        if ("children" in node) {
          node.children.push({ type: "ATOM", value: "New Child" });
        }
      },
      after: (node: any, ctx: TraverseContext) => {
        if ("children" in node) {
          const newChild = node.children.find((child: any) => child.value === "New Child");
          expect(newChild).toBeDefined();
          expect(newChild.value).toBe("New Child");
        }
      },
    };

    visit(obj, { [Types.ATOM]: AtomVisitor, [Types.MOLECULE]: MoleculaVisitor });

    expect(obj.children[0].value).toBe("Modified A");
    expect(obj.children?.[1].children?.[1].value).toBe("New Child");
  });

  it("should check the path values during traversal", () => {
    const obj = {
      type: "molecule",
      children: [
        { type: "ATOM", value: "A" },
        { type: "molecule", children: [{ type: "ATOM", value: "B" }] },
      ],
    };

    const paths: Array<Array<string | number | symbol>> = [];

    const AtomVisitor = {
      before: (node: any, ctx: TraverseContext) => {
        paths.push([...ctx.path]);
      },
      after: (node: any, ctx: TraverseContext) => {
        paths.push([...ctx.path]);
      },
    };

    const MoleculaVisitor = {
      before: (node: any, ctx: TraverseContext) => {
        paths.push([...ctx.path]);
      },
      after: (node: any, ctx: TraverseContext) => {
        paths.push([...ctx.path]);
      },
    };

    visit(obj, { [Types.ATOM]: AtomVisitor, [Types.MOLECULE]: MoleculaVisitor });

    expect(JSON.stringify(paths)).toEqual(
      JSON.stringify([
        [],
        ["children", "0"],
        ["children", "0"],
        ["children", "1"],
        ["children", "1", "children", "0"],
        ["children", "1", "children", "0"],
        ["children", "1"],
        [],
      ])
    );
  });
});
