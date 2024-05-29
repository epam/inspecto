import { expect, test } from "vitest";
import { toStructure, RuleNames, getRule } from "@testing";

test("Bond Length Rule", async () => {
  const structure = await toStructure("C=C");
  const rule = getRule(RuleNames.BondLength);

  let results = rule.verify(structure);

  expect(
    results.length > 0,
    "Bond length validation errors should be detected for C=C",
  ).toBe(true);

  results = rule
    .configure({
      bondLength: 1,
      differenceError: 0.1,
    })
    .verify(structure);

  expect(
    results.length,
    "No Bond length issue with bond length = 1 for  C=C",
  ).toBe(0);
});
