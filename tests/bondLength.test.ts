import { it, describe } from "vitest";
import { ketToStructure, getRule } from "@testing";
import { Rules as RuleNames, type RulesValidationResults } from "@infrastructure";
import { BOND_LENGTH } from "@rules/algorithms";

import E1F from "./mocks/bondLength/E1F.ket?raw";
import E2F from "./mocks/bondLength/E2F.ket?raw";
import E3F from "./mocks/bondLength/E3F.ket?raw";
import E4F from "./mocks/bondLength/E4F.ket?raw";
import E5F from "./mocks/bondLength/E5F.ket?raw";

import E1T from "./mocks/bondLength/E1T.ket?raw";
import E2T from "./mocks/bondLength/E2T.ket?raw";
import E3T from "./mocks/bondLength/E3T.ket?raw";
import E4T from "./mocks/bondLength/E4T.ket?raw";
import E5T from "./mocks/bondLength/E5T.ket?raw";

const verifyKet = (ket: string, shouldFix: boolean = false): RulesValidationResults[] => {
  const structure = ketToStructure(ket);
  const rule = getRule(RuleNames.BondLength);
  return rule
    .configure({
      bondLength: 1,
      differenceError: 0.01,
      fixingRule: shouldFix,
    })
    .verify(structure)
    .filter(res => res.errorCode?.startsWith(BOND_LENGTH));
};

describe("Bond length rule", async () => {
  it("bond_length:E1F", async ({ expect }) => {
    const results = verifyKet(E1F);
    expect(results.length, "Inspecto has detected incorrect bond length").toBeGreaterThan(0);
  });
  it("bond_length:E2F", async ({ expect }) => {
    const results = verifyKet(E2F);
    expect(results.length, "Inspecto has detected incorrect bond length").toBeGreaterThan(0);
  });

  it("bond_length:E3F", async ({ expect }) => {
    const results = verifyKet(E3F);
    expect(results.length, "Inspecto has detected incorrect bond length").toBeGreaterThan(0);
  });

  it("bond_length:E4F", async ({ expect }) => {
    const results = verifyKet(E4F);
    expect(results.length, "Inspecto has detected incorrect bond length").toBeGreaterThan(0);
  });

  it("bond_length:E5F", async ({ expect }) => {
    const results = verifyKet(E5F);
    expect(results.length, "Inspecto has detected incorrect bond length").toBeGreaterThan(0);
  });

  it("bond_length:E1T", async ({ expect }) => {
    const results = verifyKet(E1T);
    expect(results.length, "Inspecto has detected incorrect bond length").toBe(0);
  });

  it("bond_length:E2T", async ({ expect }) => {
    const results = verifyKet(E2T);
    expect(results.length, "Inspecto has detected incorrect bond length").toBe(0);
  });

  it("bond_length:E3T", async ({ expect }) => {
    const results = verifyKet(E3T);
    expect(results.length, "Inspecto has detected incorrect bond length").toBe(0);
  });

  it("bond_length:E4T", async ({ expect }) => {
    const results = verifyKet(E4T);
    expect(results.length, "Inspecto has detected incorrect bond length").toBe(0);
  });

  it("bond_length:E5T", async ({ expect }) => {
    const results = verifyKet(E5T);
    console.log(results);
    expect(results.length, "Inspecto has detected incorrect bond length").toBe(0);
  });
});

describe("Fix bond length rule", async () => {
  it("bond_length:E1F", async ({ expect }) => {
    const results = verifyKet(E1F, true);
    expect(results.length, "Inspecto has detected incorrect bond length").toBe(0);
  });

  it("bond_length:E2F", async ({ expect }) => {
    const results = verifyKet(E2F, true);
    expect(results.length, "Inspecto has detected incorrect bond length").toBe(0);
  });

  it("bond_length:E3F", async ({ expect }) => {
    const results = verifyKet(E3F, true);
    expect(results.length, "Inspecto has detected incorrect bond length").toBe(0);
  });

  it("bond_length:E4F", async ({ expect }) => {
    const results = verifyKet(E4F, true);
    expect(results.length, "Inspecto has detected incorrect bond length").toBe(0);
  });

  it("bond_length:E5F", async ({ expect }) => {
    const results = verifyKet(E5F, true);
    expect(results.length, "Inspecto has detected incorrect bond length").toBe(0);
  });
});
