import { it, describe } from "vitest";
import { ketToStructure, RuleNames, getRule } from "@testing";

import R1_3_4_E1F from "./mocks/covalentCounterion/1.3.4/E1F.ket?raw";
import R1_3_4_E2F from "./mocks/covalentCounterion/1.3.4/E2F.ket?raw";
import R1_3_4_E3F from "./mocks/covalentCounterion/1.3.4/E3F.ket?raw";
import R1_3_4_E4F from "./mocks/covalentCounterion/1.3.4/E4F.ket?raw";
import R1_3_4_E5F from "./mocks/covalentCounterion/1.3.4/E5F.ket?raw";
import R1_3_4_E6F from "./mocks/covalentCounterion/1.3.4/E6F.ket?raw";
import R1_3_4_E1T from "./mocks/covalentCounterion/1.3.4/E1T.ket?raw";
import R1_3_4_E2T from "./mocks/covalentCounterion/1.3.4/E2T.ket?raw";
import R1_3_4_E3T from "./mocks/covalentCounterion/1.3.4/E3T.ket?raw";
import R1_3_4_E4T from "./mocks/covalentCounterion/1.3.4/E4T.ket?raw";
import R1_3_4_E5T from "./mocks/covalentCounterion/1.3.4/E5T.ket?raw";

import R1_3_8_E1F from "./mocks/covalentCounterion/1.3.8/E1F.ket?raw";
import R1_3_8_E2F from "./mocks/covalentCounterion/1.3.8/E2F.ket?raw";
import R1_3_8_E3F from "./mocks/covalentCounterion/1.3.8/E3F.ket?raw";
import R1_3_8_E4F from "./mocks/covalentCounterion/1.3.8/E4F.ket?raw";
import R1_3_8_E5F from "./mocks/covalentCounterion/1.3.8/E5F.ket?raw";
import R1_3_8_E6F from "./mocks/covalentCounterion/1.3.8/E6F.ket?raw";
import R1_3_8_E1T from "./mocks/covalentCounterion/1.3.8/E1T.ket?raw";
import R1_3_8_E2T from "./mocks/covalentCounterion/1.3.8/E2T.ket?raw";
import R1_3_8_E3T from "./mocks/covalentCounterion/1.3.8/E3T.ket?raw";
import R1_3_8_E4T from "./mocks/covalentCounterion/1.3.8/E4T.ket?raw";
import R1_3_8_E5T from "./mocks/covalentCounterion/1.3.8/E5T.ket?raw";
import R1_3_8_E6T from "./mocks/covalentCounterion/1.3.8/E6T.ket?raw";

import R1_3_9_E1F from "./mocks/covalentCounterion/1.3.9/E1F.ket?raw";
import R1_3_9_E2F from "./mocks/covalentCounterion/1.3.9/E2F.ket?raw";

describe("Covalent Counterion rule", async () => {
  it("covalent-counterion:1.3.4_E1F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E1F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected an alkali metal with multiple covalent bonds").toBe(1);
  });

  it("covalent-counterion:1.3.4_E2F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E2F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected an alkali metal with multiple covalent bonds").toBe(1);
  });

  it("covalent-counterion:1.3.4_E3F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E3F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected an alkali metal with multiple covalent bonds").toBe(1);
  });

  it("covalent-counterion:1.3.4_E4F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E4F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected an alkali metal with multiple covalent bonds").toBe(1);
  });

  it("covalent-counterion:1.3.4_E5F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E5F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected an alkali metal with multiple covalent bonds").toBe(1);
  });

  it("covalent-counterion:1.3.4_E6F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E6F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected an alkali metal with multiple covalent bonds").toBe(1);
  });

  it("covalent-counterion:1.3.4_E1T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E1T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "No alkali metal validation errors should be detected").toBe(0);
  });

  it("covalent-counterion:1.3.4_E2T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E2T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "No alkali metal validation errors should be detected").toBe(0);
  });
  it("covalent-counterion:1.3.4_E3T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E3T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "No alkali metal validation errors should be detected").toBe(0);
  });
  it("covalent-counterion:1.3.4_E4T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E4T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "No alkali metal validation errors should be detected").toBe(0);
  });
  it("covalent-counterion:1.3.4_E5T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E5T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "No alkali metal validation errors should be detected").toBe(0);
  });

  it("covalent-counterion:1.3.8_E1F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E1F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected an alkali metal with multiple covalent bonds").toBe(1);
  });

  it("covalent-counterion:1.3.8_E2F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E2F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected an alkali metal with multiple covalent bonds").toBe(1);
  });
  it("covalent-counterion:1.3.8_E3F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E3F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected an alkali metal with multiple covalent bonds").toBe(1);
  });
  it("covalent-counterion:1.3.8_E4F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E4F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected an alkali metal with multiple covalent bonds").toBe(1);
  });
  it("covalent-counterion:1.3.8_E5F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E5F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected an alkali metal with multiple covalent bonds").toBe(1);
  });
  it("covalent-counterion:1.3.8_E6F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E6F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected an alkali metal with multiple covalent bonds").toBe(1);
  });

  it("covalent-counterion:1.3.8_E1T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E1T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "No alkali metal validation errors should be detected").toBe(0);
  });

  it("covalent-counterion:1.3.8_E2T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E2T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "No alkali metal validation errors should be detected").toBe(0);
  });
  it("covalent-counterion:1.3.8_E3T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E3T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "No alkali metal validation errors should be detected").toBe(0);
  });
  it("covalent-counterion:1.3.8_E4T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E4T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "No alkali metal validation errors should be detected").toBe(0);
  });
  it("covalent-counterion:1.3.8_E5T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E5T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "No alkali metal validation errors should be detected").toBe(0);
  });
  it("covalent-counterion:1.3.8_E6T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E6T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "No alkali metal validation errors should be detected").toBe(0);
  });

  it("covalent-counterion:1.3.9_E1F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_9_E1F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected a covalently bound beryllium").toBe(1);
  });

  it("covalent-counterion:1.3.9_E2F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_9_E2F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(results.length, "Inspecto has detected a covalently bound beryllium").toBe(2);
  });
});
