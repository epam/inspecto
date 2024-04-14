import { createContainer } from "./inspecto/container";
import { TOKENS, type IInspectoProcessor } from "@infrastructure";

const container = createContainer();

const Inspecto = container.get<IInspectoProcessor>(TOKENS.INSPECTO_PROCESSOR);

export { Inspecto };

export type { IInspectoProcessor };

export { Structure, BOND_TYPES } from "@models";
