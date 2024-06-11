import { it, describe } from "vitest";
import { ketToStructure, RuleNames, getRule } from "@testing";

import E1F from "./mocks/alkaliBonds/E1F.ket?raw";
import E2F from "./mocks/alkaliBonds/E2F.ket?raw";
import E3F from "./mocks/alkaliBonds/E3F.ket?raw";
import E4F from "./mocks/alkaliBonds/E4F.ket?raw";
import E5F from "./mocks/alkaliBonds/E5F.ket?raw";
import E6F from "./mocks/alkaliBonds/E6F.ket?raw";
import E1T from "./mocks/alkaliBonds/E1T.ket?raw";
import E2T from "./mocks/alkaliBonds/E2T.ket?raw";
import E3T from "./mocks/alkaliBonds/E3T.ket?raw";
import E4T from "./mocks/alkaliBonds/E4T.ket?raw";
import E5T from "./mocks/alkaliBonds/E5T.ket?raw";

describe("Alkali rule", async () => {
  it("R4E1F", async ({ expect }) => {
    const structure = ketToStructure(E1F);
    const rule = getRule(RuleNames.AlkaliBonds);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected an alkali metal with multiple covalent bonds").toBe(1);
  });

  it("R4E2F", async ({ expect }) => {
    const structure = ketToStructure(E2F);
    const rule = getRule(RuleNames.AlkaliBonds);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected an alkali metal with multiple covalent bonds").toBe(1);
  });

  it("R4E3F", async ({ expect }) => {
    const structure = ketToStructure(E3F);
    const rule = getRule(RuleNames.AlkaliBonds);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected an alkali metal with multiple covalent bonds").toBe(1);
  });

  it("R4E4F", async ({ expect }) => {
    const structure = ketToStructure(E4F);
    const rule = getRule(RuleNames.AlkaliBonds);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected an alkali metal with multiple covalent bonds").toBe(1);
  });

  it("R4E5F", async ({ expect }) => {
    const structure = ketToStructure(E5F);
    const rule = getRule(RuleNames.AlkaliBonds);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected an alkali metal with multiple covalent bonds").toBe(1);
  });

  it("R4E6F", async ({ expect }) => {
    const structure = ketToStructure(E6F);
    const rule = getRule(RuleNames.AlkaliBonds);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected an alkali metal with multiple covalent bonds").toBe(1);
  });

  it("E1T", async ({ expect }) => {
    const structure = ketToStructure(E1T);
    const rule = getRule(RuleNames.AlkaliBonds);

    const results = rule.verify(structure);

    expect(results.length, "No alkali metal validation errors should be detected").toBe(0);
  });

  it("E2T", async ({ expect }) => {
    const structure = ketToStructure(E2T);
    const rule = getRule(RuleNames.AlkaliBonds);

    const results = rule.verify(structure);

    expect(results.length, "No alkali metal validation errors should be detected").toBe(0);
  });
  it("E3T", async ({ expect }) => {
    const structure = ketToStructure(E3T);
    const rule = getRule(RuleNames.AlkaliBonds);

    const results = rule.verify(structure);

    expect(results.length, "No alkali metal validation errors should be detected").toBe(0);
  });
  it("E4T", async ({ expect }) => {
    const structure = ketToStructure(E4T);
    const rule = getRule(RuleNames.AlkaliBonds);

    const results = rule.verify(structure);

    expect(results.length, "No alkali metal validation errors should be detected").toBe(0);
  });
  it("E5T", async ({ expect }) => {
    const structure = ketToStructure(E5T);
    const rule = getRule(RuleNames.AlkaliBonds);

    const results = rule.verify(structure);

    expect(results.length, "No alkali metal validation errors should be detected").toBe(0);
  });
});
