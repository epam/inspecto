import { type InspectoResults } from "@infrastructure";
import { Inspecto, type Structure } from "..";
import { type Rule, RulesManager } from "../rules";
import dat from "dat.gui";
import { writeList } from "./components/list/list";
import { getKetcher } from "./utils/getKetcher";
import { getFixRule } from "./utils/getFixRule";

const rules = RulesManager.getAllRules();

const configStringsMap = new Map([
  ["fixingRule", "Fix"],
  ["bondLength", "Bond Length"],
  ["differenceError", "Difference Error"],
  ["angleDiffError", "Angle Difference Error"],
]);

const rulesFlags: Record<string, boolean> = {};
rules.forEach(rule => (rulesFlags[rule.name] = false));
const gui = new dat.GUI();
document.getElementById("rulesContainer")?.appendChild(gui.domElement);
for (const rule of rules) {
  const folder = gui.addFolder(rule.name);
  folder.add(rulesFlags, rule.name).name("Enabled");
  // eslint-disable-next-line @typescript-eslint/dot-notation
  for (const property in rule.getOriginalConfig()) {
    folder
      // eslint-disable-next-line @typescript-eslint/dot-notation
      .add(rule.getOriginalConfig(), property)
      .name(configStringsMap.get(property) ?? property);
  }
}

async function applyConfig(): Promise<void> {
  const ketcher = getKetcher();
  const ketFile = await ketcher.getKet();

  const enabledRules = rules.filter(rule => rulesFlags[rule.name]);
  if (enabledRules.length === 0) {
    alert("No rules selected");
    writeOutput("Inspecto results goes here");
    return;
  }
  let result = await Inspecto.applyRulesToStructure(enabledRules, ketFile);

  result = await fixErrorsWithRequiredInputs(result);

  writeOutput(JSON.stringify(result.validation, undefined, 2));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  writeList(result);

  if (rules.some(rule => rule.config?.fixingRule)) {
    const molecule = Inspecto.structureToKet(result.structure);
    await ketcher.setMolecule(molecule);
  }
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
document.querySelector(".apply-rules-button")?.addEventListener("click", applyConfig);

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
      const fixRule = getFixRule(ruleName, validationResult, false);
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
  document.querySelector(".output-section")!.textContent = text;
}
