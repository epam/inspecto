import { type RulesValidationResults } from "@infrastructure";
import { it, describe } from "vitest";
import { undefinedChiralCentersAlgorithm } from "../rules/algorithms/undefinedChiralCenters";
import { ketToStructure } from "@testing";
import E1F from "./mocks/undefinedChiralCenter/E1F.ket?raw";
import E2F from "./mocks/undefinedChiralCenter/E2F.ket?raw";
import E3F from "./mocks/undefinedChiralCenter/E3F.ket?raw";
import E4F from "./mocks/undefinedChiralCenter/E4F.ket?raw";
import E5F from "./mocks/undefinedChiralCenter/E5F.ket?raw";
import E6F from "./mocks/undefinedChiralCenter/E6F.ket?raw";
import E7F from "./mocks/undefinedChiralCenter/E7F.ket?raw";
import E8F from "./mocks/undefinedChiralCenter/E8F.ket?raw";
import E9F from "./mocks/undefinedChiralCenter/E9F.ket?raw";
import E10F from "./mocks/undefinedChiralCenter/E10F.ket?raw";

const verifyKetForUndefinetChiralCenters = (ket: string): RulesValidationResults[] => {
  const structure = ketToStructure(ket);
  return undefinedChiralCentersAlgorithm(structure, {});
};

describe("Undefined Chiral Center", async () => {
  it("should detect Undefined Chiral Center in E1F", async ({ expect }) => {
    const results = verifyKetForUndefinetChiralCenters(E1F);
    expect(results.length, "Inspecto has detected Undefined Chiral Center in E1F").toBeGreaterThan(0);
  });

  it("should detect Undefined Chiral Center in E2F", async ({ expect }) => {
    const results = verifyKetForUndefinetChiralCenters(E2F);
    expect(results.length, "Inspecto has detected Undefined Chiral Center in E2F").toBeGreaterThan(0);
  });

  it("should detect Undefined Chiral Center in E3F", async ({ expect }) => {
    const results = verifyKetForUndefinetChiralCenters(E3F);
    expect(results.length, "Inspecto has detected Undefined Chiral Center in E3F").toBeGreaterThan(0);
  });

  it("should detect Undefined Chiral Center in E4F", async ({ expect }) => {
    const results = verifyKetForUndefinetChiralCenters(E4F);
    expect(results.length, "Inspecto has detected Undefined Chiral Center in E4F").toBeGreaterThan(0);
  });

  it("should detect Undefined Chiral Center in E5F", async ({ expect }) => {
    const results = verifyKetForUndefinetChiralCenters(E5F);
    expect(results.length, "Inspecto has detected Undefined Chiral Center in E5F").toBeGreaterThan(0);
  });

  it("should detect Undefined Chiral Center in E6F", async ({ expect }) => {
    const results = verifyKetForUndefinetChiralCenters(E6F);
    expect(results.length, "Inspecto has not detected Undefined Chiral Center in E6F").toBeGreaterThan(0);
  });

  it("should detect Undefined Chiral Center in E7F", async ({ expect }) => {
    const results = verifyKetForUndefinetChiralCenters(E7F);
    expect(results.length, "Inspecto has not detected Undefined Chiral Center in E7F").toBeGreaterThan(0);
  });

  it("should detect Undefined Chiral Center in E8F", async ({ expect }) => {
    const results = verifyKetForUndefinetChiralCenters(E8F);
    expect(results.length, "Inspecto has not detected Undefined Chiral Center in E8F").toBeGreaterThan(0);
  });

  it("should detect Undefined Chiral Center in E9F", async ({ expect }) => {
    const results = verifyKetForUndefinetChiralCenters(E9F);
    expect(results.length, "Inspecto has not detected Undefined Chiral Center in E9F").toBeGreaterThan(0);
  });

  it("should detect Undefined Chiral Center in E10F", async ({ expect }) => {
    const results = verifyKetForUndefinetChiralCenters(E10F);
    expect(results.length, "Inspecto has not detected Undefined Chiral Center in E10F").toBeGreaterThan(0);
  });
});
