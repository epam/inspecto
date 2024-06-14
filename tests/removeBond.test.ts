import { describe, it } from "vitest";
import { RuleNames, getRule, ketToStructure } from "@testing";
import R1_3_6_E1F from "./mocks/covalentCounterion/1.3.6/E1F.ket?raw";

describe("Remove bond", async () => {
  it("remove bond", async ({ expect }) => {
    const structure = ketToStructure(R1_3_6_E1F);
    const bondsBefore = Array.from(Array.from(structure.molecules())[0].bonds()).length;
    const rule = getRule(RuleNames.CovalentCounterion);

    rule
      .configure({
        fixingRule: true,
      })
      .verify(structure);
    const bondsAfter = Array.from(Array.from(structure.molecules())[0].bonds()).length;

    expect(bondsAfter).toBe(bondsBefore - 1);
  });
});
