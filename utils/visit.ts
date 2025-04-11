import type { Types } from "@inspecto/models/types";
import type { Atom, Bond, Molecule, Monomer, MonomerTemplate, SGroup, Structure } from "@models";
// @ts-expect-error traverse types
import { Traverse, type TraverseContext } from "neotraverse/modern";

type VisitorFunction<Model> = (model: Model, ctx: TraverseContext) => void;

export interface VisitorObject<Model> {
  before?: VisitorFunction<Model>;
  after?: VisitorFunction<Model>;
}

interface TypeToModelMap {
  [Types.MOLECULE]: Molecule;
  [Types.MONOMER]: Monomer;
  [Types.STRUCTURE]: Structure;
  [Types.ATOM]: Atom;
  [Types.BOND]: Bond;
  [Types.SGROUP]: SGroup;
  [Types.MONOMER_TEMPLATE]: MonomerTemplate;
}

type AnyModel = Atom | Bond | MonomerTemplate | SGroup | Structure;

type GenericVisitor = Partial<{
  [K in keyof TypeToModelMap]: VisitorFunction<TypeToModelMap[K]> | VisitorObject<TypeToModelMap[K]>;
}>;

export function visit(obj: object, visitor: GenericVisitor): void {
  const traversed = new Traverse(obj);
  traversed.forEach((ctx: TraverseContext, node: AnyModel) => {
    if (Array.isArray(node)) {
      return;
    }
    const type = node?.type as Types | undefined;

    if (typeof type !== "string") return;
    if (!(type in visitor)) return;

    type K = typeof type;
    const visitorEntry = visitor[type] as VisitorFunction<TypeToModelMap[K]> | VisitorObject<TypeToModelMap[K]>;

    const callVisitor = (visitorFn?: VisitorFunction<TypeToModelMap[typeof type]>): void => {
      visitorFn?.(node, ctx);
    };

    if (typeof visitorEntry === "function") {
      callVisitor(visitorEntry);
    } else {
      if ("before" in visitorEntry) {
        ctx.before(() => {
          callVisitor(visitorEntry.before);
        });
      }
      if ("after" in visitorEntry) {
        ctx.after(() => {
          callVisitor(visitorEntry.after);
        });
      }
    }
  });
}
