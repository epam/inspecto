import { type RulesValidationResults } from "@infrastructure";

export function createErrorSpan(validationResult: RulesValidationResults): HTMLSpanElement {
  const span = document.createElement("span");
  span.textContent =
    validationResult.message?.substring(
      0,
      validationResult.message?.length > 100 ? 100 : validationResult.message?.length
    ) ?? "";
  return span;
}
