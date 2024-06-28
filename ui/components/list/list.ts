import { type InspectoResults, type RulesValidationResults } from "@infrastructure";
import { type Structure } from "@models";
import { createFixButton } from "./button/button";
import { createErrorSpan } from "./span/span";
import { Inspecto } from "../../..";
import { getKetcher } from "../../utils/getKetcher";
import { getFixRule } from "../../utils/getFixRule";

const buttonsValidationResultsMap = new Map<HTMLButtonElement, RulesValidationResults>();

export async function writeList(result: { validation: InspectoResults; structure: Structure }): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const list = document.querySelector(".list")!;
  list.innerHTML = "";
  buttonsValidationResultsMap.clear();
  const ul = createList(result.validation);
  list.appendChild(ul);
}

function createList(results: InspectoResults): HTMLUListElement {
  const ul = document.createElement("ul");
  ul.classList.add("ul-list");

  for (const ruleName in results) {
    for (const validationResult of results[ruleName].data) {
      const li = createErrorListItem(validationResult, ruleName);
      ul.appendChild(li);
    }
  }
  ul.addEventListener("click", handleFixButtonClick);
  return ul;
}
function createErrorListItem(validationResult: RulesValidationResults, ruleName: string): HTMLLIElement {
  const li = document.createElement("li");

  if (validationResult.isFixable === true) {
    const button = createFixButton(ruleName, validationResult);
    buttonsValidationResultsMap.set(button, validationResult);
    li.appendChild(button);
  }

  const span = createErrorSpan(validationResult);

  li.appendChild(span);
  li.classList.add("li-list");
  return li;
}

function handleFixButtonClick(event: MouseEvent): void {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  async function fixRuleValidationError(): Promise<void> {
    if (event.target instanceof HTMLButtonElement) {
      const clickedButton = event.target;
      const validationResult = buttonsValidationResultsMap.get(event.target);
      if (validationResult === undefined || event.target.dataset.ruleName === undefined) {
        return;
      }
      const enabledRule = getFixRule(event.target.dataset.ruleName, validationResult);
      if (enabledRule === null) {
        return;
      }
      event.target.disabled = true;
      const ketcher = getKetcher();
      const ketFile = await ketcher.getKet();
      const result = await Inspecto.applyRulesToStructure([enabledRule], ketFile);
      const ketMolecule = Inspecto.structureToKet(result.structure);
      await ketcher.setMolecule(ketMolecule);
      clickedButton.closest("li")?.remove();
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  fixRuleValidationError();
}
