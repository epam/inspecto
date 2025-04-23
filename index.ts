import { createDependencies } from "./inspecto/container";
import { TOKENS, type IInspectoProcessor } from "@infrastructure";

const container = createDependencies();

const Inspecto = container[TOKENS.INSPECTO_PROCESSOR] as IInspectoProcessor;

export { Inspecto };

export type { IInspectoProcessor };
