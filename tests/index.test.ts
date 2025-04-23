import { expect, test } from "vitest";
import { Inspecto } from "..";
import { RulesManager } from "@rules"; // Import RulesManager
import { Rules } from "@infrastructure"; // Import Rules enum

test("Inspecto main export", () => {
  expect(Inspecto).toBeDefined();
  expect(Inspecto.convertFileContentToStructure).toBeInstanceOf(Function);
  expect(Inspecto.applyRulesToStructure).toBeInstanceOf(Function);
  expect(Inspecto.structureToKet).toBeInstanceOf(Function);
});

test("Check registered rules", () => {
  const registeredRules = RulesManager.getAllRules();
  const registeredRuleNames = registeredRules.map(rule => rule.name);
  const expectedRuleNames = Object.values(Rules);

  // Check if all expected rules are registered
  expectedRuleNames.forEach(expectedRuleName => {
    expect(registeredRuleNames).toContain(expectedRuleName);
  });

  // Optional: Check if the number of registered rules matches the expected number
  expect(registeredRules.length).toBe(expectedRuleNames.length);
  expect(registeredRules.length).toBeGreaterThan(0);
});
