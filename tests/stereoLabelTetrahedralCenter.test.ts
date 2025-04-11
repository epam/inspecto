import { Rules as RuleNames, type RulesValidationResults } from "@infrastructure";
import { getRule, ketToStructure } from "@testing";
import { it, describe } from "vitest";
import { STEREO_LABEL_TETRAHEDRAL_CENTER_CODE } from "../rules/algorithms/stereoLabelTetrahedralCenter";

import E1F from "./mocks/stereoLabelTetrahedralCenter/E1F.ket?raw";
import E2F from "./mocks/stereoLabelTetrahedralCenter/E2F.ket?raw";
import E3F from "./mocks/stereoLabelTetrahedralCenter/E3F.ket?raw";
import E4F from "./mocks/stereoLabelTetrahedralCenter/E4F.ket?raw";
import E5F from "./mocks/stereoLabelTetrahedralCenter/E5F.ket?raw";
import E6F from "./mocks/stereoLabelTetrahedralCenter/E6F.ket?raw";
import E7F from "./mocks/stereoLabelTetrahedralCenter/E7F.ket?raw";
import E8F from "./mocks/stereoLabelTetrahedralCenter/E8F.ket?raw";
import E9F from "./mocks/stereoLabelTetrahedralCenter/E9F.ket?raw";
import E10F from "./mocks/stereoLabelTetrahedralCenter/E10F.ket?raw";

import E1T from "./mocks/stereoLabelTetrahedralCenter/E1T.ket?raw";
import E2T from "./mocks/stereoLabelTetrahedralCenter/E2T.ket?raw";
import E3T from "./mocks/stereoLabelTetrahedralCenter/E3T.ket?raw";
import E4T from "./mocks/stereoLabelTetrahedralCenter/E4T.ket?raw";
import E5T from "./mocks/stereoLabelTetrahedralCenter/E5T.ket?raw";
import E6T from "./mocks/stereoLabelTetrahedralCenter/E6T.ket?raw";
import E7T from "./mocks/stereoLabelTetrahedralCenter/E7T.ket?raw";
import E8T from "./mocks/stereoLabelTetrahedralCenter/E8T.ket?raw";
import E9T from "./mocks/stereoLabelTetrahedralCenter/E9T.ket?raw";
import E10T from "./mocks/stereoLabelTetrahedralCenter/E10T.ket?raw";

const verifyKet = (ket: string, shouldFix: boolean = false): RulesValidationResults[] => {
  const structure = ketToStructure(ket);
  const rule = getRule(RuleNames.StereoLabelTetrahedralCenter);
  return rule
    .configure({
      fixingRule: shouldFix,
    })
    .verify(structure)
    .filter(res => res.errorCode?.includes(STEREO_LABEL_TETRAHEDRAL_CENTER_CODE));
};

describe("stereoLabelTetrahedralCenter rule", async () => {
  it("stereoLabelTetrahedralCenter:E1F", async ({ expect }) => {
    const results = verifyKet(E1F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });

  it("stereoLabelTetrahedralCenter:E2F", async ({ expect }) => {
    const results = verifyKet(E2F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });

  it("stereoLabelTetrahedralCenter:E3F", async ({ expect }) => {
    const results = verifyKet(E3F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });

  it("stereoLabelTetrahedralCenter:E4F", async ({ expect }) => {
    const results = verifyKet(E4F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });

  it("stereoLabelTetrahedralCenter:E5F", async ({ expect }) => {
    const results = verifyKet(E5F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });

  it("stereoLabelTetrahedralCenter:E6F", async ({ expect }) => {
    const results = verifyKet(E6F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });

  it("stereoLabelTetrahedralCenter:E7F", async ({ expect }) => {
    const results = verifyKet(E7F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });

  it("stereoLabelTetrahedralCenter:E8F", async ({ expect }) => {
    const results = verifyKet(E8F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });

  it("stereoLabelTetrahedralCenter:E9F", async ({ expect }) => {
    const results = verifyKet(E9F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });

  it("stereoLabelTetrahedralCenter:E10F", async ({ expect }) => {
    const results = verifyKet(E10F);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBeGreaterThan(0);
  });

  it("stereoLabelTetrahedralCenter:E1T", async ({ expect }) => {
    const results = verifyKet(E1T);
    expect(results.length, "Inspecto has not detected stereo-configuration in CIP").toBe(0);
  });

  it("stereoLabelTetrahedralCenter:E2T", async ({ expect }) => {
    const results = verifyKet(E2T);
    expect(results.length, "Inspecto has not detected stereo-configuration in CIP").toBe(0);
  });

  it("stereoLabelTetrahedralCenter:E3T", async ({ expect }) => {
    const results = verifyKet(E3T);
    expect(results.length, "Inspecto has not detected stereo-configuration in CIP").toBe(0);
  });

  it("stereoLabelTetrahedralCenter:E4T", async ({ expect }) => {
    const results = verifyKet(E4T);
    expect(results.length, "Inspecto has not detected stereo-configuration in CIP").toBe(0);
  });

  it("stereoLabelTetrahedralCenter:E5T", async ({ expect }) => {
    const results = verifyKet(E5T);
    expect(results.length, "Inspecto has not detected stereo-configuration in CIP").toBe(0);
  });

  it("stereoLabelTetrahedralCenter:E6T", async ({ expect }) => {
    const results = verifyKet(E6T);
    expect(results.length, "Inspecto has not detected stereo-configuration in CIP").toBe(0);
  });

  it("stereoLabelTetrahedralCenter:E7T", async ({ expect }) => {
    const results = verifyKet(E7T);
    expect(results.length, "Inspecto has not detected stereo-configuration in CIP").toBe(0);
  });

  it("stereoLabelTetrahedralCenter:E8T", async ({ expect }) => {
    const results = verifyKet(E8T);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBe(0);
  });

  it("stereoLabelTetrahedralCenter:E9T", async ({ expect }) => {
    const results = verifyKet(E9T);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBe(0);
  });

  it("stereoLabelTetrahedralCenter:E10T", async ({ expect }) => {
    const results = verifyKet(E10T);
    expect(results.length, "Inspecto has detected stereo-configuration in CIP").toBe(0);
  });
});

describe("Fix stereoLabelTetrahedralCenter rule ", async () => {
  it("stereoLabelTetrahedralCenter:E1F", async ({ expect }) => {
    const results = verifyKet(E1F, true);
    expect(results.length, "Inspecto has fixed stereo-configuration in CIP").toBe(0);
  });

  it("stereoLabelTetrahedralCenter:E2F", async ({ expect }) => {
    const results = verifyKet(E2F, true);
    expect(results.length, "Inspecto has fixed stereo-configuration in CIP").toBe(0);
  });

  it("stereoLabelTetrahedralCenter:E3F", async ({ expect }) => {
    const results = verifyKet(E3F, true);
    expect(results.length, "Inspecto has fixed stereo-configuration in CIP").toBe(0);
  });

  it("stereoLabelTetrahedralCenter:E4F", async ({ expect }) => {
    const results = verifyKet(E4F, true);
    expect(results.length, "Inspecto has fixed stereo-configuration in CIP").toBe(0);
  });

  it("stereoLabelTetrahedralCenter:E5F", async ({ expect }) => {
    const results = verifyKet(E5F, true);
    expect(results.length, "Inspecto has fixed stereo-configuration in CIP").toBe(0);
  });

  it("stereoLabelTetrahedralCenter:E6F", async ({ expect }) => {
    const results = verifyKet(E6F, true);
    expect(results.length, "Inspecto has fixed stereo-configuration in CIP").toBe(0);
  });

  it("stereoLabelTetrahedralCenter:E7F", async ({ expect }) => {
    const results = verifyKet(E7F, true);
    expect(results.length, "Inspecto has fixed stereo-configuration in CIP").toBe(0);
  });

  it("stereoLabelTetrahedralCenter:E8F", async ({ expect }) => {
    const results = verifyKet(E8F, true);
    expect(results.length, "Inspecto has fixed stereo-configuration in CIP").toBe(0);
  });

  it("stereoLabelTetrahedralCenter:E9F", async ({ expect }) => {
    const results = verifyKet(E9F, true);
    expect(results.length, "Inspecto has fixed stereo-configuration in CIP").toBe(0);
  });

  it("stereoLabelTetrahedralCenter:E10F", async ({ expect }) => {
    const results = verifyKet(E10F, true);
    expect(results.length, "Inspecto has fixed stereo-configuration in CIP").toBe(0);
  });
});
