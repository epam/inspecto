import { it, describe } from "vitest";
import { ketToStructure, getRule } from "@testing";
import { Rules as RuleNames, type RulesValidationResults } from "@infrastructure";

import E1F from "./mocks/overlapping/E1F.ket?raw";
import E2F from "./mocks/overlapping/E2F.ket?raw";
import E3F from "./mocks/overlapping/E3F.ket?raw";
import E4F from "./mocks/overlapping/E4F.ket?raw";
import E5F from "./mocks/overlapping/E5F.ket?raw";
import E6F from "./mocks/overlapping/E6F.ket?raw";
import E7F from "./mocks/overlapping/E7F.ket?raw";
import E8F from "./mocks/overlapping/E8F.ket?raw";
import E9F from "./mocks/overlapping/E9F.ket?raw";
import E10F from "./mocks/overlapping/E10F.ket?raw";

import E1T from "./mocks/overlapping/E1T.ket?raw";
import E2T from "./mocks/overlapping/E2T.ket?raw";
import E3T from "./mocks/overlapping/E3T.ket?raw";
import E4T from "./mocks/overlapping/E4T.ket?raw";
import E5T from "./mocks/overlapping/E5T.ket?raw";
import E6T from "./mocks/overlapping/E6T.ket?raw";
import E7T from "./mocks/overlapping/E7T.ket?raw";
import E8T from "./mocks/overlapping/E8T.ket?raw";
import E9T from "./mocks/overlapping/E9T.ket?raw";
import E10T from "./mocks/overlapping/E10T.ket?raw";
import { OVERLAPPING_CODE } from "@rules/algorithms/overlapping";

const verifyKet = (ket: string, shouldFix: boolean = false): RulesValidationResults[] => {
  const structure = ketToStructure(ket);
  const rule = getRule(RuleNames.Overlapping);
  // return rule.verify(structure).filter(res => res.errorCode === OVERLAPPING_CODE);
  return rule
    .configure({
      fixingRule: shouldFix,
    })
    .verify(structure)
    .filter(res => res.errorCode?.includes(OVERLAPPING_CODE));
};

describe("overlapping rule", async () => {
  it("overlapping atoms:E1F", async ({ expect }) => {
    const results = verifyKet(E1F);
    expect(results.length, "Inspecto has detected overlapping atoms").toBeGreaterThan(0);
  });
  it("overlapping atoms:E2F", async ({ expect }) => {
    const results = verifyKet(E2F);
    expect(results.length, "Inspecto has detected overlapping atoms").toBeGreaterThan(0);
  });
  it("overlapping atoms:E3F", async ({ expect }) => {
    const results = verifyKet(E3F);
    expect(results.length, "Inspecto has detected overlapping atoms").toBeGreaterThan(0);
  });
  it("overlapping atoms:E4F", async ({ expect }) => {
    const results = verifyKet(E4F);
    expect(results.length, "Inspecto has detected overlapping atoms").toBeGreaterThan(0);
  });
  it("overlapping atoms:E5F", async ({ expect }) => {
    const results = verifyKet(E5F);
    expect(results.length, "Inspecto has detected overlapping atoms").toBeGreaterThan(0);
  });
  it("overlapping atoms:E6F", async ({ expect }) => {
    const results = verifyKet(E6F);
    expect(results.length, "Inspecto has detected overlapping atoms").toBeGreaterThan(0);
  });
  it("overlapping atoms:E7F", async ({ expect }) => {
    const results = verifyKet(E7F);
    expect(results.length, "Inspecto has detected overlapping atoms").toBeGreaterThan(0);
  });
  it("overlapping atoms:E8F", async ({ expect }) => {
    const results = verifyKet(E8F);
    expect(results.length, "Inspecto has detected overlapping atoms").toBeGreaterThan(0);
  });
  it("overlapping atoms:E9F", async ({ expect }) => {
    const results = verifyKet(E9F);
    expect(results.length, "Inspecto has detected overlapping atoms").toBeGreaterThan(0);
  });
  it("overlapping atoms:E10F", async ({ expect }) => {
    const results = verifyKet(E10F);
    expect(results.length, "Inspecto has detected overlapping atoms").toBeGreaterThan(0);
  });

  it("overlapping atoms:E1T", async ({ expect }) => {
    const results = verifyKet(E1T);
    expect(results.length, "Inspecto has detected overlapping atoms").toBe(0);
  });
  it("overlapping atoms:E2T", async ({ expect }) => {
    const results = verifyKet(E2T);
    expect(results.length, "Inspecto has detected overlapping atoms").toBe(0);
  });
  it("overlapping atoms:E3T", async ({ expect }) => {
    const results = verifyKet(E3T);
    expect(results.length, "Inspecto has detected overlapping atoms").toBe(0);
  });
  it("overlapping atoms:E4T", async ({ expect }) => {
    const results = verifyKet(E4T);
    expect(results.length, "Inspecto has detected overlapping atoms").toBe(0);
  });
  it("overlapping atoms:E5T", async ({ expect }) => {
    const results = verifyKet(E5T);
    expect(results.length, "Inspecto has detected overlapping atoms").toBe(0);
  });
  it("overlapping atoms:E6T", async ({ expect }) => {
    const results = verifyKet(E6T);
    expect(results.length, "Inspecto has detected overlapping atoms").toBe(0);
  });
  it("overlapping atoms:E7T", async ({ expect }) => {
    const results = verifyKet(E7T);
    expect(results.length, "Inspecto has detected overlapping atoms").toBe(0);
  });
  it("overlapping atoms:E8T", async ({ expect }) => {
    const results = verifyKet(E8T);
    expect(results.length, "Inspecto has detected overlapping atoms").toBe(0);
  });
  it("overlapping atoms:E9T", async ({ expect }) => {
    const results = verifyKet(E9T);
    expect(results.length, "Inspecto has detected overlapping atoms").toBe(0);
  });
  it("overlapping atoms:E10T", async ({ expect }) => {
    const results = verifyKet(E10T);
    expect(results.length, "Inspecto has detected overlapping atoms").toBe(0);
  });
});

describe("fixed overlapping rule ", async () => {
  it("not overlapping atoms:E1F", async ({ expect }) => {
    const results = verifyKet(E1F, true);
    expect(results.length, "Inspecto has  fixed overlapping atoms").toBe(0);
  });
  it("not overlapping atoms:E2F", async ({ expect }) => {
    const results = verifyKet(E2F, true);
    expect(results.length, "Inspecto has fixed overlapping atoms").toBe(0);
  });
  it("not overlapping atoms:E3F", async ({ expect }) => {
    const results = verifyKet(E3F, true);
    expect(results.length, "Inspecto has fixed overlapping atoms").toBe(0);
  });
  it("not overlapping atoms:E4F", async ({ expect }) => {
    const results = verifyKet(E4F, true);
    expect(results.length, "Inspecto has fixed overlapping atoms").toBe(0);
  });
  it("not overlapping atoms:E5F", async ({ expect }) => {
    const results = verifyKet(E5F, true);
    expect(results.length, "Inspecto has fixed overlapping atoms").toBeGreaterThan(0);
  });
  it("not overlapping atoms:E6F", async ({ expect }) => {
    const results = verifyKet(E6F, true);
    expect(results.length, "Inspecto has fixed overlapping atoms").toBe(0);
  });
  it("not overlapping atoms:E7F", async ({ expect }) => {
    const results = verifyKet(E7F, true);
    expect(results.length, "Inspecto has fixed overlapping atoms").toBeGreaterThan(0);
  });
  it("not overlapping atoms:E8F", async ({ expect }) => {
    const results = verifyKet(E8F, true);
    expect(results.length, "Inspecto has fixed overlapping atoms").toBe(0);
  });
  it("not overlapping atoms:E9F", async ({ expect }) => {
    const results = verifyKet(E9F, true);
    expect(results.length, "Inspecto has fixed overlapping atoms").toBe(0);
  });
  it("not overlapping atoms:E10F", async ({ expect }) => {
    const results = verifyKet(E10F, true);
    expect(results.length, "Inspecto has detected fixed overlapping atoms").toBeGreaterThan(0);
  });
});
