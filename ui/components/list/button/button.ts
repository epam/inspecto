import { type RulesValidationResults } from "@infrastructure";

export function createFixButton(ruleName: string, validationResult: RulesValidationResults): HTMLButtonElement {
  const button = document.createElement("button");
  button.textContent = "fix";
  button.classList.add("btn", "btn-outline-primary", "fix-button");
  button.dataset.ruleName = ruleName;
  return button;
}
