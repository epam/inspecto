import { it, describe } from "vitest";
import { ketToStructure, getRule } from "@testing";
import { Rules as RuleNames, type RulesValidationResults } from "@infrastructure";

import E1F from "./mocks/bondAngle/E1F.ket?raw";
import E2F from "./mocks/bondAngle/E2F.ket?raw";
import E3F from "./mocks/bondAngle/E3F.ket?raw";
import E4F from "./mocks/bondAngle/E4F.ket?raw";
import E5F from "./mocks/bondAngle/E5F.ket?raw";
import E6F from "./mocks/bondAngle/E6F.ket?raw";
import E7F from "./mocks/bondAngle/E7F.ket?raw";
import E8F from "./mocks/bondAngle/E8F.ket?raw";
import E9 from "./mocks/bondAngle/E9.ket?raw";
import E10F from "./mocks/bondAngle/E10F.ket?raw";

import E1T from "./mocks/bondAngle/E1T.ket?raw";
import E2T from "./mocks/bondAngle/E2T.ket?raw";
import E3T from "./mocks/bondAngle/E3T.ket?raw";
import E4T from "./mocks/bondAngle/E4T.ket?raw";
import E5T from "./mocks/bondAngle/E5T.ket?raw";
import E6T from "./mocks/bondAngle/E6T.ket?raw";
import E7T from "./mocks/bondAngle/E7T.ket?raw";
import E8T from "./mocks/bondAngle/E8T.ket?raw";
import E10T from "./mocks/bondAngle/E10T.ket?raw";

const BOND_ANGLE_ERROR = "bond-angle";

const verifyKet = (ket: string): RulesValidationResults[] => {
  const structure = ketToStructure(ket);
  const rule = getRule(RuleNames.BondAngle);
  return rule.verify(structure).filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR));
};

describe("Bond angle rule", async () => {
  it("bond_angle:E1F", async ({ expect }) => {
    const results = verifyKet(E1F);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBeGreaterThan(0);
  });

  it("bond_angle:E2F", async ({ expect }) => {
    const results = verifyKet(E2F);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBeGreaterThan(0);
  });

  it("bond_angle:E3F", async ({ expect }) => {
    const results = verifyKet(E3F);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBeGreaterThan(0);
  });

  it("bond_angle:E4F", async ({ expect }) => {
    const results = verifyKet(E4F);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBeGreaterThan(0);
  });

  it("bond_angle:E5F", async ({ expect }) => {
    const results = verifyKet(E5F);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBeGreaterThan(0);
  });

  it("bond_angle:E6F", async ({ expect }) => {
    const results = verifyKet(E6F);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBeGreaterThan(0);
  });

  it("bond_angle:E7F", async ({ expect }) => {
    const results = verifyKet(E7F);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBeGreaterThan(0);
  });

  it("bond_angle:E8F", async ({ expect }) => {
    const results = verifyKet(E8F);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBeGreaterThan(0);
  });

  it("bond_angle:E10F", async ({ expect }) => {
    const results = verifyKet(E10F);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBeGreaterThan(0);
  });

  it("bond_angle:E1T", async ({ expect }) => {
    const results = verifyKet(E1T);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBe(0);
  });

  it("bond_angle:E2T", async ({ expect }) => {
    const results = verifyKet(E2T);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBe(0);
  });

  it("bond_angle:E3T", async ({ expect }) => {
    const results = verifyKet(E3T);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBe(0);
  });

  it("bond_angle:E4T", async ({ expect }) => {
    const results = verifyKet(E4T);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBe(0);
  });

  it("bond_angle:E5T", async ({ expect }) => {
    const results = verifyKet(E5T);
    console.log(results);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBe(0);
  });

  it("bond_angle:E6T", async ({ expect }) => {
    const results = verifyKet(E6T);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBe(0);
  });

  it("bond_angle:E7T", async ({ expect }) => {
    const results = verifyKet(E7T);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBe(0);
  });

  it("bond_ange:E8T", async ({ expect }) => {
    const results = verifyKet(E8T);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBe(0);
  });

  it("bond_angle:E9", async ({ expect }) => {
    const results = verifyKet(E9);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBe(0);
  });

  it("bond_angle:E10T", async ({ expect }) => {
    const results = verifyKet(E10T);
    expect(results.length, "Inspecto has detected incorrect written symbols").toBe(0);
  });
});
