import { createContainer } from "./src/container";
import { TOKENS, type IInspectoProcessor } from "@infrastructure";

const container = createContainer();

const Inspecto = container.get<IInspectoProcessor>(TOKENS.INSPECTO_PROCESSOR);

export default Inspecto;

export type { IInspectoProcessor };

export { Rule, Structure, BOND_TYPES } from "@models";

export * from "@utils";
