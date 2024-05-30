import { it, describe } from "vitest";
import { ketToStructure, RuleNames, getRule } from "@testing";

import E1F from "./mocks/valence/E1F.ket?raw";
import E1T from "./mocks/valence/E1T.ket?raw";
import E2F from "./mocks/valence/E2F.ket?raw";
import E2T from "./mocks/valence/E2T.ket?raw";
import E3F from "./mocks/valence/E3F.ket?raw";
import E3T from "./mocks/valence/E3T.ket?raw";
import E4F from "./mocks/valence/E4F.ket?raw";
import E4T from "./mocks/valence/E4T.ket?raw";
import E5F from "./mocks/valence/E5F.ket?raw";
import E5T from "./mocks/valence/E5T.ket?raw";

describe("Valence Rule", async () => {
  it("E1F", async ({ expect }) => {
    const structure = ketToStructure(E1F);
    const rule = getRule(RuleNames.Valence);

    const results = rule.verify(structure);

    expect(results.length, "Valence validation errors should be detected").toBe(
      2,
    );
  });
  it("E2F", async ({ expect }) => {
    const structure = ketToStructure(E2F);
    const rule = getRule(RuleNames.Valence);

    const results = rule.verify(structure);

    expect(results.length, "Valence validation errors should be detected").toBe(
      2,
    );
  });

  it("E3F", async ({ expect }) => {
    const structure = ketToStructure(E3F);
    const rule = getRule(RuleNames.Valence);

    const results = rule.verify(structure);

    expect(results.length, "Valence validation errors should be detected").toBe(
      2,
    );
  });

  it("E4F", async ({ expect }) => {
    const structure = ketToStructure(E4F);
    const rule = getRule(RuleNames.Valence);

    const results = rule.verify(structure);

    expect(results.length, "Valence validation errors should be detected").toBe(
      2,
    );
  });

  it("E5F", async ({ expect }) => {
    const structure = ketToStructure(E5F);
    const rule = getRule(RuleNames.Valence);

    const results = rule.verify(structure);

    expect(results.length, "Valence validation errors should be detected").toBe(
      4,
    );
  });

  it("E1T", async ({ expect }) => {
    const structure = ketToStructure(E1T);
    const rule = getRule(RuleNames.Valence);

    const results = rule.verify(structure);

    expect(
      results.length,
      "No valence validation errors should be detected",
    ).toBe(0);
  });

  it("E2T", async ({ expect }) => {
    const structure = ketToStructure(E2T);
    const rule = getRule(RuleNames.Valence);

    const results = rule.verify(structure);

    expect(
      results.length,
      "No valence validation errors should be detected",
    ).toBe(0);
  });
  it("E3T", async ({ expect }) => {
    const structure = ketToStructure(E3T);
    const rule = getRule(RuleNames.Valence);

    const results = rule.verify(structure);

    expect(
      results.length,
      "No valence validation errors should be detected",
    ).toBe(0);
  });
  it("E4T", async ({ expect }) => {
    const structure = ketToStructure(E4T);
    const rule = getRule(RuleNames.Valence);

    const results = rule.verify(structure);

    expect(
      results.length,
      "No valence validation errors should be detected",
    ).toBe(0);
  });
  it("E5T", async ({ expect }) => {
    const structure = ketToStructure(E5T);
    const rule = getRule(RuleNames.Valence);

    const results = rule.verify(structure);

    expect(
      results.length,
      "No valence validation errors should be detected",
    ).toBe(0);
  });
});
