import { it, describe } from "vitest";
import { ketToStructure, getRule } from "@testing";
import { Rules as RuleNames } from "@infrastructure";

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

describe("Bond angle rule", async () => {
  it("bond_angle:E1F", async ({ expect }) => {
    const structure = ketToStructure(E1F);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBeGreaterThan(0);
  });

  it("bond_angle:E2F", async ({ expect }) => {
    const structure = ketToStructure(E2F);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBeGreaterThan(0);
  });

  it("bond_angle:E3F", async ({ expect }) => {
    const structure = ketToStructure(E3F);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBeGreaterThan(0);
  });

  it("bond_angle:E4F", async ({ expect }) => {
    const structure = ketToStructure(E4F);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBeGreaterThan(0);
  });

  it("bond_angle:E5F", async ({ expect }) => {
    const structure = ketToStructure(E5F);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBeGreaterThan(0);
  });

  it("bond_angle:E6F", async ({ expect }) => {
    const structure = ketToStructure(E6F);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBeGreaterThan(0);
  });

  it("bond_angle:E7F", async ({ expect }) => {
    const structure = ketToStructure(E7F);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBeGreaterThan(0);
  });
  it("bond_angle:E8F", async ({ expect }) => {
    const structure = ketToStructure(E8F);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBeGreaterThan(0);
  });

  it("bond_angle:E10F", async ({ expect }) => {
    const structure = ketToStructure(E10F);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBeGreaterThan(0);
  });

  it("bond_angle:E1T", async ({ expect }) => {
    const structure = ketToStructure(E1T);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });

  it("bond_angle:E2T", async ({ expect }) => {
    const structure = ketToStructure(E2T);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });

  it("bond_angle:E3T", async ({ expect }) => {
    const structure = ketToStructure(E3T);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });

  it("bond_angle:E4T", async ({ expect }) => {
    const structure = ketToStructure(E4T);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });

  it("bond_angle:E5T", async ({ expect }) => {
    const structure = ketToStructure(E5T);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });

  it("bond_angle:E6T", async ({ expect }) => {
    const structure = ketToStructure(E6T);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });

  it("bond_angle:E7T", async ({ expect }) => {
    const structure = ketToStructure(E7T);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });

  it("bond_ange:E8T", async ({ expect }) => {
    const structure = ketToStructure(E8T);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });

  it("bond_angle:E9", async ({ expect }) => {
    const structure = ketToStructure(E9);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });

  it("bond_angle:E10T", async ({ expect }) => {
    const structure = ketToStructure(E10T);
    const rule = getRule(RuleNames.BondAngle);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode?.startsWith(BOND_ANGLE_ERROR)).length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });
});
