import { type Rules, type InspectoResults } from "@infrastructure";
import { Inspecto, type Structure } from "..";
import { type Rule, RulesManager } from "../rules";
import dat from "dat.gui";
import { writeList } from "./components/list/list";
import { getKetcher } from "./utils/getKetcher";
import { getFixRule } from "./utils/getFixRule";
import { getObject, storeObject, storeString, getString } from "./utils/storage";

const rules = RulesManager.getAllRules();

const configStringsMap = new Map([
  ["fixingRule", "Fix"],
  ["bondLength", "Bond Length"],
  ["differenceError", "Difference Error"],
  ["angleDiffError", "Angle Difference Error"],
  ["overlappingFactor", "Overlapping Factor"],
]);

const DOMNodes = {
  rulesSelected: document.getElementById("rules-selected"),
  resultsFound: document.getElementById("results-found"),
  rulesContainer: document.getElementById("rulesContainer"),
  applyRulesButton: document.querySelector(".apply-rules-button"),
  applyRulesButtonSpinner: document.querySelector(".apply-rules-button [role='status']"),
  outputSection: document.querySelector(".output-section"),
  navLinks: document.querySelectorAll(".nav-link"),
  tabPanes: document.querySelectorAll(".tab-pane"),
  copyResultsButton: document.querySelector(".copy-result"),
};

hideSpinner();

function hideSpinner(): void {
  if (DOMNodes.applyRulesButtonSpinner !== null) {
    (DOMNodes.applyRulesButtonSpinner as HTMLSpanElement).style.display = "none";
  }
}
function showSpinner(): void {
  if (DOMNodes.applyRulesButtonSpinner !== null) {
    (DOMNodes.applyRulesButtonSpinner as HTMLSpanElement).style.display = "inline-block";
  }
}

const rulesFlags: Record<string, boolean> = {};
rules.forEach(rule => (rulesFlags[rule.name] = false));

const storedRules = getObject("rules");
for (const rulesFlag in rulesFlags) {
  if (rulesFlag in storedRules) {
    rulesFlags[rulesFlag] = storedRules[rulesFlag];
  }
}

const gui = new dat.GUI();
DOMNodes.rulesContainer?.appendChild(gui.domElement);
DOMNodes.copyResultsButton?.addEventListener("click", () => {
  const output = DOMNodes.outputSection?.textContent;
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  navigator.clipboard.writeText(output ?? "");
});

DOMNodes.navLinks.forEach(link => {
  link.addEventListener("click", () => {
    DOMNodes.navLinks.forEach(link => {
      link.classList.remove("active");
    });
    link.classList.add("active");
    const hrefValue = link.getAttribute("href");
    DOMNodes.tabPanes.forEach(tab => {
      tab.classList.remove("active");
      tab.classList.remove("show");
      tab.classList.remove("fade");
    });
    if (hrefValue !== null) {
      const tabPane = document.querySelector(hrefValue);
      tabPane?.classList.add("active", "show", "fade");
    }
  });
});

function onRulesChange(): void {
  const selectedRulesCount = Object.values(rulesFlags).filter(Boolean).length;

  if (selectedRulesCount === 0) {
    DOMNodes.applyRulesButton?.classList.add("disabled");
  } else {
    DOMNodes.applyRulesButton?.classList.remove("disabled");
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  DOMNodes.rulesSelected!.textContent = String(selectedRulesCount);
}

for (const rule of rules) {
  const folder = gui.addFolder(rule.name);

  // Add a checkbox on the same level as the folder
  const folderElement = folder.domElement.parentElement; // Get the folder's parent container
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `folderCheckbox-${rule.name}`;
  checkbox.checked = rulesFlags[rule.name];

  if (folderElement !== null) {
    const div = document.createElement("div");
    div.classList.add("group-checkbox");
    div.appendChild(checkbox);
    folderElement.querySelector(".dg .title")?.prepend(div); // Prepend the checkbox to the folder's container
    // Style the folder and checkbox (optional)
    // folderElement.style.display = 'flex';
    // folderElement.style.alignItems = 'center';
    // folderElement.style.gap = '10px';
  }

  // Add an event listener for the checkbox
  checkbox.addEventListener("click", event => {
    event.stopPropagation(); // Prevent the folder from opening/closing
  });
  checkbox.addEventListener("change", event => {
    // console.log('Checkbox state:', event.target.checked);
    // config.myCheckbox = event.target.checked; // Update the configuration object
    rulesFlags[rule.name] = (event as Event & { target: HTMLInputElement }).target.checked;
    storeObject(rulesFlags, "rules");
    onRulesChange();
  });

  // folder.add(rulesFlags, rule.name).name("Enabled");
  // eslint-disable-next-line @typescript-eslint/dot-notation
  for (const property in rule.getOriginalConfig()) {
    folder
      // eslint-disable-next-line @typescript-eslint/dot-notation
      .add(rule.getOriginalConfig(), property)
      .name(configStringsMap.get(property) ?? property);
  }
}

async function applyConfig(): Promise<void> {
  showSpinner();
  const ketcher = getKetcher();
  const ketFile = await ketcher.getKet();

  const enabledRules = rules.filter(rule => rulesFlags[rule.name]);
  if (enabledRules.length === 0) {
    alert("No rules selected");
    writeOutput("Inspecto results goes here");
    hideSpinner();
    return;
  }
  storeString(ketFile, "ket-file");
  const ketStructure = JSON.parse(ketFile);
  if (ketStructure.root.nodes.length === 0) {
    alert("No molecule to inspect");
    writeOutput("Inspecto results goes here");
    hideSpinner();
    return;
  }
  let result = await Inspecto.applyRulesToStructure(enabledRules, ketFile);

  result = await fixErrorsWithRequiredInputs(result);

  writeOutput(JSON.stringify(result.validation, undefined, 2));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  writeList(result);

  const totalResults = document.querySelectorAll(".list-group li").length;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  DOMNodes.resultsFound!.textContent = String(totalResults);

  if (rules.some(rule => rule.config?.fixingRule)) {
    const molecule = Inspecto.structureToKet(result.structure);
    await ketcher.setMolecule(molecule);
  }

  if (totalResults > 0) {
    (Array.from(DOMNodes.navLinks) as HTMLAnchorElement[]).find(link => link.id === "issues-tab")?.click();
  }

  hideSpinner();
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
DOMNodes.applyRulesButton?.addEventListener("click", applyConfig);

async function fixErrorsWithRequiredInputs(result: {
  validation: InspectoResults;
  structure: Structure;
}): Promise<{ validation: InspectoResults; structure: Structure }> {
  const fixRules: Array<Rule<any>> = [];
  rules.forEach(rule => (rule.config.fixingScope = []));
  for (const ruleName in result.validation) {
    if (rules.find(rule => rule.name === ruleName)?.config?.fixingRule !== true) {
      continue;
    }
    const validationErrorsWithRequiredInput = result.validation[ruleName].data.filter(
      validationResult => validationResult.fixMeta?.requireUserInput === true
    );
    for (const validationResult of validationErrorsWithRequiredInput) {
      const fixRule = getFixRule(ruleName as Rules, validationResult, false);
      if (fixRule !== null) {
        if (!fixRules.some(fr => fr.name === fixRule.name)) {
          fixRules.push(fixRule);
        }
      }
    }
  }
  if (fixRules.length === 0) {
    return result;
  }
  const ketMolecule = Inspecto.structureToKet(result.structure);
  return await Inspecto.applyRulesToStructure(fixRules, ketMolecule);
}

function writeOutput(text: string): void {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  DOMNodes.outputSection!.textContent = text;
}

async function loadLastStructure(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 3000));
  const ketFile = getString("ket-file");
  if (ketFile.length === 0) {
    return;
  }
  const ketcher = getKetcher();
  await ketcher.setMolecule(ketFile);
  // await applyConfig();
}

onRulesChange();
// eslint-disable-next-line @typescript-eslint/no-floating-promises
loadLastStructure();
