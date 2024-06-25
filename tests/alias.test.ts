import { describe, it } from "vitest";
import { ketToStructure, RuleNames, getRule } from "@testing";

import E1T from "./mocks/alias/E1T.ket?raw";
import E2T from "./mocks/alias/E2T.ket?raw";
import E3T from "./mocks/alias/E3T.ket?raw";
import E4T from "./mocks/alias/E4T.ket?raw";
import E5T from "./mocks/alias/E5T.ket?raw";

import E1F from "./mocks/alias/E1F.ket?raw";
import E2F from "./mocks/alias/E2F.ket?raw";
import E3F from "./mocks/alias/E3F.ket?raw";
import E4F from "./mocks/alias/E4F.ket?raw";
import E5F from "./mocks/alias/E5F.ket?raw";

describe("Alias rule", async () => {
  it("alias:E1T", async ({ expect }) => {
    const structure = ketToStructure(E1T);
    const rule = getRule(RuleNames.Alias);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode === "alias-rule:2.3").length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });

  it("alias:E2T", async ({ expect }) => {
    const structure = ketToStructure(E2T);
    const rule = getRule(RuleNames.Alias);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode === "alias-rule:2.3").length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });

  it("alias:E3T", async ({ expect }) => {
    const structure = ketToStructure(E3T);
    const rule = getRule(RuleNames.Alias);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode === "alias-rule:2.3").length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });

  it("alias:E4T", async ({ expect }) => {
    const structure = ketToStructure(E4T);
    const rule = getRule(RuleNames.Alias);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode === "alias-rule:2.3").length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });

  it("alias:E5T", async ({ expect }) => {
    const structure = ketToStructure(E5T);
    const rule = getRule(RuleNames.Alias);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode === "alias-rule:2.3").length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });

  it("alias:E1F", async ({ expect }) => {
    const structure = ketToStructure(E1F);
    const rule = getRule(RuleNames.Alias);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode === "alias-rule:2.3").length,
      "Inspecto has detected incorrect written symbols [M] in Fluorine|unknown|Oxygen|Carbon, would you like to change it?"
    ).toBe(1);
  });

  it("alias:E2F", async ({ expect }) => {
    const structure = ketToStructure(E2F);
    const rule = getRule(RuleNames.Alias);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode === "alias-rule:2.3").length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(1);
  });

  it("alias:E3F", async ({ expect }) => {
    const structure = ketToStructure(E3F);
    const rule = getRule(RuleNames.Alias);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode === "alias-rule:2.3").length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(1);
  });

  it("alias:E4F", async ({ expect }) => {
    const structure = ketToStructure(E4F);
    const rule = getRule(RuleNames.Alias);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode === "alias-rule:2.3").length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(1);
  });

  it("alias:E5F", async ({ expect }) => {
    const structure = ketToStructure(E5F);
    const rule = getRule(RuleNames.Alias);
    const results = rule.verify(structure);
    expect(
      results.filter(res => res.errorCode === "alias-rule:2.3").length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(2);
  });
});

describe("Fix alias rule", async () => {
  it("alias:E1F", async ({ expect }) => {
    const structure = ketToStructure(E1F);
    const rule = getRule(RuleNames.Alias);
    const scope = [
      {
        path: "mol0->SUP->0",
        errorCode: "alias-rule:2.3",
        data: "N",
      },
    ];
    const results = rule
      .configure({
        fixingScope: [...scope],
      })
      .verify(structure);

    expect(
      results.filter(res => res.errorCode === "alias-rule:2.3").length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });

  it("alias:E2F", async ({ expect }) => {
    const structure = ketToStructure(E2F);
    const rule = getRule(RuleNames.Alias);
    const scope = [
      {
        path: "mol0->ATOM->3",
        errorCode: "alias-rule:2.3",
        data: "CBCF",
      },
    ];
    const results = rule
      .configure({
        fixingScope: [...scope],
      })
      .verify(structure);
    expect(
      results.filter(res => res.errorCode === "alias-rule:2.3").length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });

  it("alias:E3F", async ({ expect }) => {
    const structure = ketToStructure(E3F);
    const rule = getRule(RuleNames.Alias);
    const scope = [
      {
        path: "mol0->ATOM->5",
        errorCode: "alias-rule:2.3",
        data: "NaCO",
      },
    ];
    const results = rule
      .configure({
        fixingScope: [...scope],
      })
      .verify(structure);
    expect(
      results.filter(res => res.errorCode === "alias-rule:2.3").length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });

  it("alias:E4F", async ({ expect }) => {
    const structure = ketToStructure(E4F);
    const rule = getRule(RuleNames.Alias);
    const scope = [
      {
        path: "mol0->SUP->0",
        errorCode: "alias-rule:2.3",
        data: "N",
      },
    ];
    const results = rule
      .configure({
        fixingScope: [...scope],
      })
      .verify(structure);
    expect(
      results.filter(res => res.errorCode === "alias-rule:2.3").length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });

  it("alias:E5F", async ({ expect }) => {
    const structure = ketToStructure(E5F);
    const rule = getRule(RuleNames.Alias);
    const scope = [
      {
        path: "mol0->ATOM->0",
        errorCode: "alias-rule:2.3",
        data: "N",
      },
      {
        path: "mol0->ATOM->5",
        errorCode: "alias-rule:2.3",
        data: "C",
      },
    ];
    const results = rule
      .configure({
        fixingScope: [...scope],
      })
      .verify(structure);
    expect(
      results.filter(res => res.errorCode === "alias-rule:2.3").length,
      "Inspecto has detected incorrect written symbols"
    ).toBe(0);
  });
});
