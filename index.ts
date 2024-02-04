import { createContainer } from "./src/container";
import { TOKENS, type IIndigoProcessor } from "@infrastructure";

const container = createContainer();

const Indigo = container.get<IIndigoProcessor>(TOKENS.INDIGO_PROCESSOR);

export default Indigo;
