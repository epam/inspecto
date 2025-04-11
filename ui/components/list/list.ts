import { type Rules, type InspectoResults, type RulesValidationResults } from "@infrastructure";
import { type Structure } from "@models";
import { createFixButton } from "./button/button";
import { createErrorSpan } from "./span/span";
import { Inspecto } from "../../..";
import { getKetcher } from "@ui/utils/getKetcher";
import { getFixRule } from "@ui/utils/getFixRule";

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
  ul.classList.add("list-group");

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
  const liContainer = document.createElement("div");
  const liRow = document.createElement("div");
  liContainer.classList.add("container");
  liRow.classList.add("row");
  liContainer.appendChild(liRow);
  li.appendChild(liContainer);
  const col1 = document.createElement("div");
  col1.classList.add("col-sm-2");
  const b = document.createElement("b");
  b.classList.add("error-rule-name");
  if (validationResult.url !== undefined) {
    const a = document.createElement("a");
    a.target = "_blank";
    a.href = validationResult.url;
    a.textContent = (validationResult.errorCode ?? "").replace(":", " ");
    b.appendChild(a);
  } else {
    b.textContent = (validationResult.errorCode ?? "").replace(":", " ");
  }
  col1.appendChild(b);
  liRow.appendChild(col1);
  const col2 = document.createElement("div");
  col2.classList.add("col-sm-8");
  liRow.appendChild(col2);
  const col3 = document.createElement("div");
  col3.classList.add("col-sm-2");
  liRow.appendChild(col3);

  // <div class="container">
  //   <div class="row">
  //     <div class="col-sm">
  //       One of three columns
  //     </div>
  //     <div class="col-sm">
  //       One of three columns
  //     </div>
  //     <div class="col-sm">
  //       One of three columns
  //     </div>
  //   </div>
  // </div>

  if (validationResult.isFixable === true) {
    const button = createFixButton(ruleName, validationResult);
    buttonsValidationResultsMap.set(button, validationResult);
    col3.appendChild(button);
  }

  const span = createErrorSpan(validationResult);

  col2.appendChild(span);
  li.classList.add("list-group-item", "pl-1", "pr-0");
  return li;
}

function handleFixButtonClick(event: MouseEvent): void {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  async function fixRuleValidationError(): Promise<void> {
    if (event.target instanceof HTMLButtonElement) {
      const clickedButton = event.target;
      const validationResult = buttonsValidationResultsMap.get(clickedButton);
      if (validationResult === undefined || clickedButton.dataset.ruleName === undefined) {
        return;
      }
      const enabledRule = getFixRule(clickedButton.dataset.ruleName as Rules, validationResult);
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      document.getElementById("results-found")!.textContent = String(
        document.querySelectorAll(".list-group li").length
      );
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  fixRuleValidationError();
}
