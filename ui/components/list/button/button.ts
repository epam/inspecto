import { type RulesValidationResults } from "@infrastructure";

export function createFixButton(ruleName: string, validationResult: RulesValidationResults): HTMLButtonElement {
  const button = document.createElement("button");
  button.textContent = "Fix";
  button.classList.add("btn", "btn-info");
  button.dataset.ruleName = ruleName;
  return button;
}
