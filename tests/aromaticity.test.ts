import { type RulesValidationResults } from "@infrastructure";
import { it, describe } from "vitest";
import { ketToStructure } from "@testing";
import { AromaticityRule } from "../rules/algorithms/aromaticity";
import E1T from "./mocks/aromaticity/E1T.ket?raw";
import E2T from "./mocks/aromaticity/E2T.ket?raw";
import E3T from "./mocks/aromaticity/E3T.ket?raw";
import E4T from "./mocks/aromaticity/E4T.ket?raw";
import E5T from "./mocks/aromaticity/E5T.ket?raw";
import E6T from "./mocks/aromaticity/E6T.ket?raw";
import E6F from "./mocks/aromaticity/E6F.ket?raw";
import E7F from "./mocks/aromaticity/E7F.ket?raw";
import E8F from "./mocks/aromaticity/E8F.ket?raw";
import E9F from "./mocks/aromaticity/E9F.ket?raw";
import E10F from "./mocks/aromaticity/E10F.ket?raw";
import E11F from "./mocks/aromaticity/E11F.ket?raw";
import E12F from "./mocks/aromaticity/E12F.ket?raw";

// Additional mock KET files imports...

const verifyKetForAromaticity = (ket: string): RulesValidationResults[] => {
  const structure = ketToStructure(ket);
  const rule = new AromaticityRule({});
  return rule.verify(structure);
};

describe("Aromaticity Detection from KET files", () => {
  it("should detect valid aromatic cycles in E1T", async ({ expect }) => {
    const results = verifyKetForAromaticity(E1T);
    expect(results.length, "Detected issues in E1T when shouldn't have").toEqual(0);
  });

  it("should detect valid aromatic cycles in E2T", async ({ expect }) => {
    const results = verifyKetForAromaticity(E2T);
    expect(results.length, "Detected issues in E2T when shouldn't have").toEqual(0);
  });

  it("should detect valid aromatic cycles in E3T", async ({ expect }) => {
    const results = verifyKetForAromaticity(E3T);
    expect(results.length, "Detected issues in E3T when shouldn't have").toEqual(0);
  });

  it("should detect valid aromatic cycles in E4T", async ({ expect }) => {
    const results = verifyKetForAromaticity(E4T);
    expect(results.length, "Detected issues in E4T when shouldn't have").toEqual(0);
  });

  it("should detect valid aromatic cycles in E5T", async ({ expect }) => {
    const results = verifyKetForAromaticity(E5T);
    expect(results.length, "Detected issues in E5T when shouldn't have").toEqual(0);
  });

  it("should detect valid aromatic cycles in E6T", async ({ expect }) => {
    const results = verifyKetForAromaticity(E6T);
    expect(results.length, "Detected issues in E6T when shouldn't have").toEqual(0);
  });

  it("should detect issues with non-aromatic cycles in E6F", async ({ expect }) => {
    const results = verifyKetForAromaticity(E6F);
    expect(results.length, "No issues detected in E6F when there should be").toBeGreaterThan(0);
  });

  it("should detect issues with non-aromatic cycles in E7F", async ({ expect }) => {
    const results = verifyKetForAromaticity(E7F);
    expect(results.length, "No issues detected in E7F when there should be").toBeGreaterThan(0);
  });

  it("should detect issues with non-aromatic cycles in E8F", async ({ expect }) => {
    const results = verifyKetForAromaticity(E8F);
    expect(results.length, "No issues detected in E8F when there should be").toBeGreaterThan(0);
  });

  it("should detect issues with non-aromatic cycles in E9F", async ({ expect }) => {
    const results = verifyKetForAromaticity(E9F);
    expect(results.length, "No issues detected in E9F when there should be").toBeGreaterThan(0);
  });

  it("should detect issues with non-aromatic cycles in E10F", async ({ expect }) => {
    const results = verifyKetForAromaticity(E10F);
    expect(results.length, "No issues detected in E10F when there should be").toBeGreaterThan(0);
  });

  it("should detect issues with non-aromatic cycles in E11F", async ({ expect }) => {
    const results = verifyKetForAromaticity(E11F);
    expect(results.length, "No issues detected in E11F when there should be").toBeGreaterThan(0);
  });

  it("should detect issues with non-aromatic cycles in E12F", async ({ expect }) => {
    const results = verifyKetForAromaticity(E12F);
    expect(results.length, "No issues detected in E12F when there should be").toBeGreaterThan(0);
  });
});
