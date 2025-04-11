export const TOKENS = {
  // Processors
  INSPECTO_PROCESSOR: Symbol.for("INDIGO_PROCESSOR"),
  RULES_PROCESSOR: Symbol.for("RULES_PROCESSOR"),
  DATA_MODEL_PROCESSOR: Symbol.for("DATA_MODEL_PROCESSOR"),
  // Providers
  CONVERTER_PROVIDER: Symbol.for("CONVERTER_PROVIDER"),
} as const;
