import { type InspectoResults } from "@infrastructure";
import { Inspecto, type Structure } from "..";
import { RulesManager } from "../rules";
import dat from "dat.gui";
import type { Ketcher } from "ketcher-core";

const ruleNames = RulesManager.getAllRules().map(rule => rule.name);

const ALIAS_RULE_NAME = "Alias";
const ALIAS_RULE_CODE = `alias-rule:2.3`;

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
  for (const property in rule.getOriginalConfig()) {
    folder
      // eslint-disable-next-line @typescript-eslint/dot-notation
      .add(rule.getOriginalConfig(), property)
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
  let result = await Inspecto.applyRulesToStructure(enabledRules, ketFile);

  result = await fixAliases(result);

  writeOutput(JSON.stringify(result.validation, undefined, 2));

  if (rules.some(rule => rule.config?.fixingRule)) {
    const molecule = Inspecto.structureToKet(result.structure);
    await ketcher.setMolecule(molecule);
  }
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
document.querySelector(".apply-rules-button")?.addEventListener("click", applyConfig);

async function fixAliases(result: {
  validation: InspectoResults;
  structure: Structure;
}): Promise<{ validation: InspectoResults; structure: Structure }> {
  const aliasRule = rules.find(rule => rule.name === ALIAS_RULE_NAME);
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!aliasRule) {
    throw new Error("alias rule is not found");
  }
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (rulesFlags[aliasRule.name] && aliasRule?.config.fixingRule) {
    const resultValidationForAlias = result.validation[ALIAS_RULE_NAME].data.filter(
      err => err.errorCode === ALIAS_RULE_CODE
    );
    aliasRule.getOriginalConfig().fixingScope = aliasRule.getOriginalConfig().fixingScope ?? [];
    for (const result of resultValidationForAlias) {
      const answer = prompt(result.message);
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (answer) {
        aliasRule.getOriginalConfig().fixingScope.push({
          path: result.path,
          errorCode: result.errorCode,
          data: answer,
        });
      }
    }
    const ketMolecule = Inspecto.structureToKet(result.structure);
    return await Inspecto.applyRulesToStructure([aliasRule], ketMolecule);
  }
  return result;
}

function writeOutput(text: string): void {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.querySelector(".output-section")!.textContent = text;
}
