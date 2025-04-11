import { it, describe } from "vitest";
import { ketToStructure, getRule } from "@testing";
import { Rules as RuleNames, type RulesValidationResults } from "@infrastructure";

import E1F from "./mocks/stereoLabelDoubleBond/E1F.ket?raw";
import E2F from "./mocks/stereoLabelDoubleBond/E2F.ket?raw";
import E3F from "./mocks/stereoLabelDoubleBond/E3F.ket?raw";
import E4F from "./mocks/stereoLabelDoubleBond/E4F.ket?raw";
import E5F from "./mocks/stereoLabelDoubleBond/E5F.ket?raw";
import E6F from "./mocks/stereoLabelDoubleBond/E6F.ket?raw";
import E7F from "./mocks/stereoLabelDoubleBond/E7F.ket?raw";
import E8F from "./mocks/stereoLabelDoubleBond/E8F.ket?raw";
import E9F from "./mocks/stereoLabelDoubleBond/E9F.ket?raw";
import E10F from "./mocks/stereoLabelDoubleBond/E10F.ket?raw";

import E1T from "./mocks/stereoLabelDoubleBond/E1T.ket?raw";
import E2T from "./mocks/stereoLabelDoubleBond/E2T.ket?raw";
import E3T from "./mocks/stereoLabelDoubleBond/E3T.ket?raw";
import E4T from "./mocks/stereoLabelDoubleBond/E4T.ket?raw";
import E5T from "./mocks/stereoLabelDoubleBond/E5T.ket?raw";
import E6T from "./mocks/stereoLabelDoubleBond/E6T.ket?raw";
import E7T from "./mocks/stereoLabelDoubleBond/E7T.ket?raw";
import E8T from "./mocks/stereoLabelDoubleBond/E8T.ket?raw";
import E9T from "./mocks/stereoLabelDoubleBond/E9T.ket?raw";
import E10T from "./mocks/stereoLabelDoubleBond/E10T.ket?raw";

const verifyKet = (ket: string): RulesValidationResults[] => {
  const structure = ketToStructure(ket);
  const rule = getRule(RuleNames.StereoLabelDoubleBond);
  return rule.verify(structure).filter(res => res.errorCode !== undefined);
};

describe("stereolabeldoublebond rule", async () => {
  it("stereolabeldoublebond atoms:E1F", async ({ expect }) => {
    const results = verifyKet(E1F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });
  it("stereolabeldoublebond atoms:E2F", async ({ expect }) => {
    const results = verifyKet(E2F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });
  it("stereolabeldoublebond atoms:E3F", async ({ expect }) => {
    const results = verifyKet(E3F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });
  it("stereolabeldoublebond atoms:E4F", async ({ expect }) => {
    const results = verifyKet(E4F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });
  it("stereolabeldoublebond atoms:E5F", async ({ expect }) => {
    const results = verifyKet(E5F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });
  it("stereolabeldoublebond atoms:E6F", async ({ expect }) => {
    const results = verifyKet(E6F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });
  it("stereolabeldoublebond atoms:E7F", async ({ expect }) => {
    const results = verifyKet(E7F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });
  it("stereolabeldoublebond atoms:E8F", async ({ expect }) => {
    const results = verifyKet(E8F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });
  it("stereolabeldoublebond atoms:E9F", async ({ expect }) => {
    const results = verifyKet(E9F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });
  it("stereolabeldoublebond atoms:E10F", async ({ expect }) => {
    const results = verifyKet(E10F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });

  it("stereolabeldoublebond atoms:E1T", async ({ expect }) => {
    const results = verifyKet(E1T);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBe(0);
  });
  it("stereolabeldoublebond atoms:E2T", async ({ expect }) => {
    const results = verifyKet(E2T);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBe(0);
  });
  it("stereolabeldoublebond atoms:E3T", async ({ expect }) => {
    const results = verifyKet(E3T);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBe(0);
  });
  it("stereolabeldoublebond atoms:E4T", async ({ expect }) => {
    const results = verifyKet(E4T);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBe(0);
  });
  it("stereolabeldoublebond atoms:E5T", async ({ expect }) => {
    const results = verifyKet(E5T);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBe(0);
  });
  it("stereolabeldoublebond atoms:E6T", async ({ expect }) => {
    const results = verifyKet(E6T);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBe(0);
  });
  it("stereolabeldoublebond atoms:E7T", async ({ expect }) => {
    const results = verifyKet(E7T);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBe(0);
  });
  it("stereolabeldoublebond atoms:E8T", async ({ expect }) => {
    const results = verifyKet(E8T);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBe(0);
  });
  it("stereolabeldoublebond atoms:E9T", async ({ expect }) => {
    const results = verifyKet(E9T);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBe(0);
  });
  it("stereolabeldoublebond atoms:E10T", async ({ expect }) => {
    const results = verifyKet(E10T);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBe(0);
  });
});
