import "reflect-metadata";
import { Container } from "inversify";

import { type IRulesManager, RULES_TOKENS } from "@rules/infrastructure";
import { RulesManagerProcessor } from "@rules/processors";

/**
 * This is a container for Rules Manager and Rules
 */
const container = new Container({ defaultScope: "Singleton" });

container
  .bind<IRulesManager>(RULES_TOKENS.RULES_MANAGER)
  .to(RulesManagerProcessor);

export { container };
