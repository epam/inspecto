import { Rules as RuleNames, type RulesValidationResults } from "@infrastructure";
import { STRAIGHT_DOUBLE_BOND_CODE } from "../rules/algorithms/straightDoubleBond";
import { getRule, ketToStructure } from "@testing";
import { it, describe } from "vitest";
import E1F from "./mocks/straightDoubleBond/E1F.ket?raw";
import E1T from "./mocks/straightDoubleBond/E1T.ket?raw";
import E2F from "./mocks/straightDoubleBond/E2F.ket?raw";
import E2T from "./mocks/straightDoubleBond/E2T.ket?raw";
import E3F from "./mocks/straightDoubleBond/E3F.ket?raw";
import E3T from "./mocks/straightDoubleBond/E3T.ket?raw";
import E4F from "./mocks/straightDoubleBond/E4F.ket?raw";
import E4T from "./mocks/straightDoubleBond/E4T.ket?raw";
import E5F from "./mocks/straightDoubleBond/E5F.ket?raw";
import E5T from "./mocks/straightDoubleBond/E5T.ket?raw";
import E6F from "./mocks/straightDoubleBond/E6F.ket?raw";
import E6T from "./mocks/straightDoubleBond/E6T.ket?raw";
import E7F from "./mocks/straightDoubleBond/E7F.ket?raw";
import E7T from "./mocks/straightDoubleBond/E7T.ket?raw";
import E8F from "./mocks/straightDoubleBond/E8F.ket?raw";
import E8T from "./mocks/straightDoubleBond/E8T.ket?raw";
import E9F from "./mocks/straightDoubleBond/E9F.ket?raw";
import E9T from "./mocks/straightDoubleBond/E9T.ket?raw";
import E10F from "./mocks/straightDoubleBond/E10F.ket?raw";
import E10T from "./mocks/straightDoubleBond/E10T.ket?raw";
import E11F from "./mocks/straightDoubleBond/E11F.ket?raw";
import E11T from "./mocks/straightDoubleBond/E11T.ket?raw";
import E12F from "./mocks/straightDoubleBond/E12F.ket?raw";
import E12T from "./mocks/straightDoubleBond/E12T.ket?raw";
import E13F from "./mocks/straightDoubleBond/E13F.ket?raw";
import E13T from "./mocks/straightDoubleBond/E13T.ket?raw";

const verifyKet = (ket: string, shouldFix: boolean = false): RulesValidationResults[] => {
  const structure = ketToStructure(ket);
  const rule = getRule(RuleNames.StraightDoubleBond);
  return rule
    .configure({
      fixingRule: shouldFix,
    })
    .verify(structure)
    .filter(res => res.errorCode?.includes(STRAIGHT_DOUBLE_BOND_CODE));
};

describe("STRAIGHT DOUBLE BOND Detection from KET files", async () => {
  it("straightDoubleBond:E1F", async ({ expect }) => {
    const results = verifyKet(E1F);
    expect(
      results.length,
      "Inspecto has detected a straight double bond must be changed into a crossed double bond"
    ).toBeGreaterThan(0);
  });

  it("straightDoubleBond:E1T", async ({ expect }) => {
    const results = verifyKet(E1T);
    expect(
      results.length,
      "Inspecto has not  detected a straight double bond must be changed into a crossed double bond"
    ).toBe(0);
  });

  it("straightDoubleBond:E2F", async ({ expect }) => {
    const results = verifyKet(E2F);
    expect(
      results.length,
      "Inspecto has  detected a straight double bond must be changed into a crossed double bond"
    ).toBeGreaterThan(0);
  });

  it("straightDoubleBond:E2T", async ({ expect }) => {
    const results = verifyKet(E2T);
    expect(
      results.length,
      "Inspecto has not  detected a straight double bond must be changed into a crossed double bond"
    ).toBe(0);
  });

  it("straightDoubleBond:E3F", async ({ expect }) => {
    const results = verifyKet(E3F);
    expect(
      results.length,
      "Inspecto has  detected a straight double bond must be changed into a crossed double bond"
    ).toBeGreaterThan(0);
  });

  it("straightDoubleBond:E3T", async ({ expect }) => {
    const results = verifyKet(E3T);
    expect(
      results.length,
      "Inspecto has not  detected a straight double bond must be changed into a crossed double bond"
    ).toBe(0);
  });

  it("straightDoubleBond:E4F", async ({ expect }) => {
    const results = verifyKet(E4F);
    expect(
      results.length,
      "Inspecto has  detected a straight double bond must be changed into a crossed double bond"
    ).toBeGreaterThan(0);
  });

  it("straightDoubleBond:E4T", async ({ expect }) => {
    const results = verifyKet(E4T);
    expect(
      results.length,
      "Inspecto has not  detected a straight double bond must be changed into a crossed double bond"
    ).toBe(0);
  });
  it("straightDoubleBond:E5F", async ({ expect }) => {
    const results = verifyKet(E5F);
    expect(
      results.length,
      "Inspecto has  detected a straight double bond must be changed into a crossed double bond"
    ).toBeGreaterThan(0);
  });

  it("straightDoubleBond:E5T", async ({ expect }) => {
    const results = verifyKet(E5T);
    expect(
      results.length,
      "Inspecto has not  detected a straight double bond must be changed into a crossed double bond"
    ).toBe(0);
  });
  it("straightDoubleBond:E6F", async ({ expect }) => {
    const results = verifyKet(E6F);
    expect(
      results.length,
      "Inspecto has  detected a straight double bond must be changed into a crossed double bond"
    ).toBeGreaterThan(0);
  });

  it("straightDoubleBond:E6T", async ({ expect }) => {
    const results = verifyKet(E6T);
    expect(
      results.length,
      "Inspecto has not  detected a straight double bond must be changed into a crossed double bond"
    ).toBe(0);
  });
  it("straightDoubleBond:E7F", async ({ expect }) => {
    const results = verifyKet(E7F);
    expect(
      results.length,
      "Inspecto has  detected a straight double bond must be changed into a crossed double bond"
    ).toBeGreaterThan(0);
  });

  it("straightDoubleBond:E7T", async ({ expect }) => {
    const results = verifyKet(E7T);
    expect(
      results.length,
      "Inspecto has not  detected a straight double bond must be changed into a crossed double bond"
    ).toBe(0);
  });
  it("straightDoubleBond:E8F", async ({ expect }) => {
    const results = verifyKet(E8F);
    expect(
      results.length,
      "Inspecto has  detected a straight double bond must be changed into a crossed double bond"
    ).toBeGreaterThan(0);
  });

  it("straightDoubleBond:E8T", async ({ expect }) => {
    const results = verifyKet(E8T);
    expect(
      results.length,
      "Inspecto has not  detected a straight double bond must be changed into a crossed double bond"
    ).toBe(0);
  });
  it("straightDoubleBond:E9F", async ({ expect }) => {
    const results = verifyKet(E9F);
    expect(
      results.length,
      "Inspecto has  detected a straight double bond must be changed into a crossed double bond"
    ).toBeGreaterThan(0);
  });

  it("straightDoubleBond:E9T", async ({ expect }) => {
    const results = verifyKet(E9T);
    expect(
      results.length,
      "Inspecto has not  detected a straight double bond must be changed into a crossed double bond"
    ).toBe(0);
  });
  it("straightDoubleBond:E10F", async ({ expect }) => {
    const results = verifyKet(E10F);
    expect(
      results.length,
      "Inspecto has  detected a straight double bond must be changed into a crossed double bond"
    ).toBeGreaterThan(0);
  });

  it("straightDoubleBond:E10T", async ({ expect }) => {
    const results = verifyKet(E10T);
    expect(
      results.length,
      "Inspecto has not  detected a straight double bond must be changed into a crossed double bond"
    ).toBe(0);
  });
  it("straightDoubleBond:E11F", async ({ expect }) => {
    const results = verifyKet(E11F);
    expect(
      results.length,
      "Inspecto has  detected a straight double bond must be changed into a crossed double bond"
    ).toBeGreaterThan(0);
  });

  it("straightDoubleBond:E11T", async ({ expect }) => {
    const results = verifyKet(E11T);
    expect(
      results.length,
      "Inspecto has not  detected a straight double bond must be changed into a crossed double bond"
    ).toBe(0);
  });
  it("straightDoubleBond:E12F", async ({ expect }) => {
    const results = verifyKet(E12F);
    expect(
      results.length,
      "Inspecto has  detected a straight double bond must be changed into a crossed double bond"
    ).toBeGreaterThan(0);
  });

  it("straightDoubleBond:E12T", async ({ expect }) => {
    const results = verifyKet(E12T);
    expect(
      results.length,
      "Inspecto has not  detected a straight double bond must be changed into a crossed double bond"
    ).toBe(0);
  });
  it("straightDoubleBond:E13F", async ({ expect }) => {
    const results = verifyKet(E13F);
    expect(
      results.length,
      "Inspecto has  detected a straight double bond must be changed into a crossed double bond"
    ).toBeGreaterThan(0);
  });

  it("straightDoubleBond:E13T", async ({ expect }) => {
    const results = verifyKet(E13T);
    expect(
      results.length,
      "Inspecto has not  detected a straight double bond must be changed into a crossed double bond"
    ).toBe(0);
  });
});

describe("Fix Straight Double Bond Rule", async () => {
  it("straightDoubleBond:E1F", async ({ expect }) => {
    const results = verifyKet(E1F, true);
    expect(results.length, "Inspecto has fixed the straightDoubleBond issue").toBe(0);
  });
  it("straightDoubleBond:E2F", async ({ expect }) => {
    const results = verifyKet(E2F, true);
    expect(results.length, "Inspecto has fixed the straightDoubleBond issue").toBe(0);
  });

  it("straightDoubleBond:E3F", async ({ expect }) => {
    const results = verifyKet(E3F, true);
    expect(results.length, "Inspecto has fixed the straightDoubleBond issue").toBe(0);
  });

  it("straightDoubleBond:E4F", async ({ expect }) => {
    const results = verifyKet(E4F, true);
    expect(results.length, "Inspecto has fixed the straightDoubleBond issue").toBe(0);
  });

  it("straightDoubleBond:E5F", async ({ expect }) => {
    const results = verifyKet(E5F, true);
    expect(results.length, "Inspecto has fixed the straightDoubleBond issue").toBe(0);
  });

  it("straightDoubleBond:E6F", async ({ expect }) => {
    const results = verifyKet(E6F, true);
    expect(results.length, "Inspecto has fixed the straightDoubleBond issue").toBe(0);
  });

  it("straightDoubleBond:E7F", async ({ expect }) => {
    const results = verifyKet(E7F, true);
    expect(results.length, "Inspecto has fixed the straightDoubleBond issue").toBe(0);
  });

  it("straightDoubleBond:E8F", async ({ expect }) => {
    const results = verifyKet(E8F, true);
    expect(results.length, "Inspecto has fixed the straightDoubleBond issue").toBe(0);
  });

  it("straightDoubleBond:E9F", async ({ expect }) => {
    const results = verifyKet(E9F, true);
    expect(results.length, "Inspecto has fixed the straightDoubleBond issue").toBe(0);
  });

  it("straightDoubleBond:E10F", async ({ expect }) => {
    const results = verifyKet(E10F, true);
    expect(results.length, "Inspecto has fixed the straightDoubleBond issue").toBe(0);
  });

  it("straightDoubleBond:E11F", async ({ expect }) => {
    const results = verifyKet(E11F, true);
    expect(results.length, "Inspecto has fixed the straightDoubleBond issue").toBe(0);
  });

  it("straightDoubleBond:E12F", async ({ expect }) => {
    const results = verifyKet(E12F, true);
    expect(results.length, "Inspecto has fixed the straightDoubleBond issue").toBe(0);
  });

  it("straightDoubleBond:E13F", async ({ expect }) => {
    const results = verifyKet(E13F, true);
    expect(results.length, "Inspecto has fixed the straightDoubleBond issue").toBe(0);
  });
});
