import { Inspecto } from "..";
import { RulesManager } from "../rules";
import dat from "dat.gui";
import type { Ketcher } from "ketcher-core";

const ruleNames = RulesManager.getAllRules().map(rule => rule.name);

const configStringsMap = new Map([
  ["fixingRule", "Fix"],
  ["bondLength", "Bond Length"],
  ["differenceError", "Difference Error"],
  ["angleDiffError", "Angle Difference Error"],
]);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rules = ruleNames.map(rule => RulesManager.getRuleByName(rule)!);
const rulesFlags: Record<string, boolean> = {};
rules.forEach(rule => (rulesFlags[rule.name] = false));

const gui = new dat.GUI();
document.getElementById("rulesContainer")?.appendChild(gui.domElement);
for (const rule of rules) {
  const folder = gui.addFolder(rule.name);
  folder.add(rulesFlags, rule.name).name("Enabled");
  // eslint-disable-next-line @typescript-eslint/dot-notation
  for (const property in rule["_config"]) {
    folder
      // eslint-disable-next-line @typescript-eslint/dot-notation
      .add(rule["_config"], property)
      .name(configStringsMap.get(property) ?? property);
  }
}

async function applyConfig(): Promise<void> {
  const ketcherIframe = document.getElementById("ketcher") as HTMLIFrameElement;
  const ketcherContentWindow = ketcherIframe.contentWindow as Window & { ketcher: Ketcher };
  const ketcher = ketcherContentWindow.ketcher;
  const ketFile = await ketcher.getKet();

  const enabledRules = rules.filter(rule => rulesFlags[rule.name]);
  if (enabledRules.length === 0) {
    alert("No rules selected");
    writeOutput("Inspecto results goes here");
    return;
  }
  const result = await Inspecto.applyRulesToStructure(enabledRules, ketFile);

  writeOutput(JSON.stringify(result.validation, undefined, 2));

  if (rules.some(rule => rule.config?.fixingRule)) {
    const molecule = Inspecto.structureToKet(result.structure);
    await ketcher.setMolecule(molecule);
  }
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
document.querySelector(".apply-rules-button")?.addEventListener("click", applyConfig);

function writeOutput(text: string): void {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.querySelector(".output-section")!.textContent = text;
}
