import { it, describe } from "vitest";
import { Rules as RuleNames, type RulesValidationResults } from "@infrastructure";
import { getRule, ketToStructure } from "@testing";

import E1F from "./mocks/incorrectCovalentBonds/E1F.ket?raw";
import E2F from "./mocks/incorrectCovalentBonds/E2F.ket?raw";
import E3F from "./mocks/incorrectCovalentBonds/E3F.ket?raw";
import E4F from "./mocks/incorrectCovalentBonds/E4F.ket?raw";

import E1T from "./mocks/incorrectCovalentBonds/E1T.ket?raw";
import E2T from "./mocks/incorrectCovalentBonds/E2T.ket?raw";
import E3T from "./mocks/incorrectCovalentBonds/E3T.ket?raw";
import E4T from "./mocks/incorrectCovalentBonds/E4T.ket?raw";

const verifyKet = (ket: string, shouldFix: boolean = false): RulesValidationResults[] => {
  const structure = ketToStructure(ket);
  try {
    const rule = getRule(RuleNames.IncorrectCovalentBonds);
    const results = rule
      .configure({
        fixingRule: shouldFix,
      })
      .verify(structure);

    console.log(`Found ${results.length} rule violations in KET.`);
    return results;
  } catch (error) {
    console.error(`Error when trying to verify KET structure: ${String(error)}`);
    return [];
  }
};

describe("Incorrect covalent bonds rule", async () => {
  it("should detect incorrect covalent bonds in E1F", async ({ expect }) => {
    const results = verifyKet(E1F);
    expect(results.length, "Inspecto has detected incorrect covalent bonds").toBeGreaterThan(0);
  });

  it("should detect incorrect covalent bonds in E2F", async ({ expect }) => {
    const results = verifyKet(E2F);
    expect(results.length, "Inspecto has detected incorrect covalent bonds").toBeGreaterThan(0);
  });

  it("should detect incorrect covalent bonds in E3F", async ({ expect }) => {
    const results = verifyKet(E3F);
    expect(results.length, "Inspecto has detected incorrect covalent bonds").toBeGreaterThan(0);
  });

  it("should detect incorrect covalent bonds in E4F", async ({ expect }) => {
    const results = verifyKet(E4F);
    expect(results.length, "Inspecto has detected incorrect covalent bonds").toBeGreaterThan(0);
  });
  it("should not detect incorrect covalent bonds in E1T", async ({ expect }) => {
    const results = verifyKet(E1T);
    expect(results.length).toBe(0);
  });

  it("should not detect incorrect covalent bonds in E2T", async ({ expect }) => {
    const results = verifyKet(E2T);
    expect(results.length).toBe(0);
  });

  it("should not detect incorrect covalent bonds in E3T", async ({ expect }) => {
    const results = verifyKet(E3T);
    expect(results.length).toBe(0);
  });

  it("should not detect incorrect covalent bonds in E4T", async ({ expect }) => {
    const results = verifyKet(E4T);
    expect(results.length).toBe(0);
  });
});

describe("fix incorrect covalent bonds rule", async () => {
  it("should fix incorrect covalent bonds in E1F", async ({ expect }) => {
    const results = verifyKet(E1F, true);
    expect(results.length).toBe(0);
  });

  it("should fix incorrect covalent bonds in E2F", async ({ expect }) => {
    const results = verifyKet(E2F, true);
    expect(results.length).toBe(0);
  });

  it("should fix incorrect covalent bonds in E3F", async ({ expect }) => {
    const results = verifyKet(E3F, true);
    expect(results.length).toBe(0);
  });

  it("should fix incorrect covalent bonds in E4F", async ({ expect }) => {
    const results = verifyKet(E4F, true);
    expect(results.length).toBe(0);
  });
});
