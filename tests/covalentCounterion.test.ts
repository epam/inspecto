import { it, describe } from "vitest";
import { ketToStructure, getRule } from "@testing";
import { Rules as RuleNames } from "@infrastructure";

import { COVALENT_ALKALI_BONDS_EXIST, COVALENT_ALKALI_EARTH_BONDS_EXIST } from "@rules/algorithms/alkaliBonds";
import { COVALENT_SINGLE_ALC_BONDS } from "@rules/algorithms/singleCovalentBonds";
import { COVALENT_BERILLIUM_BONDS } from "@rules/algorithms/berilliumBonds";
import {
  COVALENT_DOUBLE_ALC_EARTH_BONDS,
  COVALENT_SINGLE_ALC_EARTH_BONDS,
  COVALENT_TWO_SINGLE_ALC_EARTH_BONDS,
} from "@rules/algorithms/doubleCovalentBonds";

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

import R8E1F from "./mocks/covalentCounterion/1.3.8/R8E1F.ket?raw";
import R8E2F from "./mocks/covalentCounterion/1.3.8/R8E2F.ket?raw";
import R8E3F from "./mocks/covalentCounterion/1.3.8/R8E3F.ket?raw";
import R8E4F from "./mocks/covalentCounterion/1.3.8/R8E4F.ket?raw";
import R8E5F from "./mocks/covalentCounterion/1.3.8/R8E5F.ket?raw";
import R8E6F from "./mocks/covalentCounterion/1.3.8/R8E6F.ket?raw";

import R1_3_9_E1F from "./mocks/covalentCounterion/1.3.9/E1F.ket?raw";
import R1_3_9_E2T from "./mocks/covalentCounterion/1.3.9/E2T.ket?raw";

import R3E1F from "./mocks/covalentCounterion/1.3.3/R3E1F.ket?raw";
import R3E2F from "./mocks/covalentCounterion/1.3.3/R3E2F.ket?raw";
import R3E3F from "./mocks/covalentCounterion/1.3.3/R3E3F.ket?raw";
import R3E4F from "./mocks/covalentCounterion/1.3.3/R3E4F.ket?raw";
import R3E5F from "./mocks/covalentCounterion/1.3.3/R3E5F.ket?raw";
import R3E6F from "./mocks/covalentCounterion/1.3.3/R3E6F.ket?raw";

import R3E1T from "./mocks/covalentCounterion/1.3.3/R3E1T.ket?raw";
import R3E2T from "./mocks/covalentCounterion/1.3.3/R3E2T.ket?raw";
import R3E3T from "./mocks/covalentCounterion/1.3.3/R3E3T.ket?raw";
import R3E4T from "./mocks/covalentCounterion/1.3.3/R3E4T.ket?raw";
import R3E5T from "./mocks/covalentCounterion/1.3.3/R3E5T.ket?raw";
import R3E6T from "./mocks/covalentCounterion/1.3.3/R3E6T.ket?raw";

import R5E1T from "./mocks/covalentCounterion/1.3.5/R5E1T.ket?raw";
import R5E2T from "./mocks/covalentCounterion/1.3.5/R5E2T.ket?raw";
import R5E3T from "./mocks/covalentCounterion/1.3.5/R5E3T.ket?raw";
import R5E4T from "./mocks/covalentCounterion/1.3.5/R5E4T.ket?raw";
import R5E5T from "./mocks/covalentCounterion/1.3.5/R5E5T.ket?raw";
import R5E6T from "./mocks/covalentCounterion/1.3.5/R5E6T.ket?raw";

import R5E1F from "./mocks/covalentCounterion/1.3.5/R5E1F.ket?raw";
import R5E2F from "./mocks/covalentCounterion/1.3.5/R5E2F.ket?raw";
import R5E3F from "./mocks/covalentCounterion/1.3.5/R5E3F.ket?raw";
import R5E4F from "./mocks/covalentCounterion/1.3.5/R5E4F.ket?raw";
import R5E5F from "./mocks/covalentCounterion/1.3.5/R5E5F.ket?raw";
import R5E6F from "./mocks/covalentCounterion/1.3.5/R5E6F.ket?raw";

import R6E1T from "./mocks/covalentCounterion/1.3.6/R6E1T.ket?raw";
import R6E2T from "./mocks/covalentCounterion/1.3.6/R6E2T.ket?raw";
import R6E3T from "./mocks/covalentCounterion/1.3.6/R6E3T.ket?raw";
import R6E4T from "./mocks/covalentCounterion/1.3.6/R6E4T.ket?raw";
import R6E5T from "./mocks/covalentCounterion/1.3.6/R6E5T.ket?raw";
import R6E6T from "./mocks/covalentCounterion/1.3.6/R6E6T.ket?raw";

import R6E1F from "./mocks/covalentCounterion/1.3.6/R6E1F.ket?raw";
import R6E2F from "./mocks/covalentCounterion/1.3.6/R6E2F.ket?raw";
import R6E3F from "./mocks/covalentCounterion/1.3.6/R6E3F.ket?raw";
import R6E4F from "./mocks/covalentCounterion/1.3.6/R6E4F.ket?raw";
import R6E5F from "./mocks/covalentCounterion/1.3.6/R6E5F.ket?raw";
import R6E6F from "./mocks/covalentCounterion/1.3.6/R6E6F.ket?raw";

import R7E1T from "./mocks/covalentCounterion/1.3.7/R7E1T.ket?raw";
import R7E2T from "./mocks/covalentCounterion/1.3.7/R7E2T.ket?raw";
import R7E3T from "./mocks/covalentCounterion/1.3.7/R7E3T.ket?raw";
import R7E4T from "./mocks/covalentCounterion/1.3.7/R7E4T.ket?raw";
import R7E5T from "./mocks/covalentCounterion/1.3.7/R7E5T.ket?raw";
import R7E6T from "./mocks/covalentCounterion/1.3.7/R7E6T.ket?raw";

import R7E1F from "./mocks/covalentCounterion/1.3.7/R7E1F.ket?raw";
import R7E2F from "./mocks/covalentCounterion/1.3.7/R7E2F.ket?raw";
import R7E3F from "./mocks/covalentCounterion/1.3.7/R7E3F.ket?raw";
import R7E4F from "./mocks/covalentCounterion/1.3.7/R7E4F.ket?raw";
import R7E5F from "./mocks/covalentCounterion/1.3.7/R7E5F.ket?raw";
import R7E6F from "./mocks/covalentCounterion/1.3.7/R7E6F.ket?raw";

import R9E1F from "./mocks/covalentCounterion/1.3.9/R9E1F.ket?raw";
import R9E2F from "./mocks/covalentCounterion/1.3.9/R9E2F.ket?raw";
import R9E3F from "./mocks/covalentCounterion/1.3.9/R9E3F.ket?raw";
import R9E4F from "./mocks/covalentCounterion/1.3.9/R9E4F.ket?raw";
import R9E5F from "./mocks/covalentCounterion/1.3.9/R9E5F.ket?raw";
import R9E6F from "./mocks/covalentCounterion/1.3.9/R9E6F.ket?raw";

describe("Covalent Counterion rule", async () => {
  it("covalent-counterion:1.3.3_E1F", async ({ expect }) => {
    const structure = ketToStructure(R3E1F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_BONDS).length,
      "Inspecto has detected an alkali with single covalent bonds with electronegative atom"
    ).toBe(1);
  });
  it("covalent-counterion:1.3.3_E2F", async ({ expect }) => {
    const structure = ketToStructure(R3E2F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_BONDS).length,
      "Inspecto has detected an alkali with single covalent bonds with electronegative atom"
    ).toBe(1);
  });
  it("covalent-counterion:1.3.3_E3F", async ({ expect }) => {
    const structure = ketToStructure(R3E3F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_BONDS).length,
      "Inspecto has detected an alkali with single covalent bonds with electronegative atom"
    ).toBe(1);
  });
  it("covalent-counterion:1.3.3_E4F", async ({ expect }) => {
    const structure = ketToStructure(R3E4F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_BONDS).length,
      "Inspecto has detected an alkali with single covalent bonds with electronegative atom"
    ).toBe(1);
  });
  it("covalent-counterion:1.3.3_E5F", async ({ expect }) => {
    const structure = ketToStructure(R3E5F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_BONDS).length,
      "Inspecto has detected an alkali with single covalent bonds with electronegative atom"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.3_E6F", async ({ expect }) => {
    const structure = ketToStructure(R3E6F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_BONDS).length,
      "Inspecto has detected an alkali with single covalent bonds with electronegative atom"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.3_E1T", async ({ expect }) => {
    const structure = ketToStructure(R3E1T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_BONDS).length,
      "Inspecto has detected an alkali with single covalent bonds with electronegative atom"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.3_E2T", async ({ expect }) => {
    const structure = ketToStructure(R3E2T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_BONDS).length,
      "Inspecto has detected an alkali with single covalent bonds with electronegative atom"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.3_E3T", async ({ expect }) => {
    const structure = ketToStructure(R3E3T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_BONDS).length,
      "Inspecto has detected an alkali with single covalent bonds with electronegative atom"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.3_E4T", async ({ expect }) => {
    const structure = ketToStructure(R3E4T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_BONDS).length,
      "Inspecto has detected an alkali with single covalent bonds with electronegative atom"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.3_E5T", async ({ expect }) => {
    const structure = ketToStructure(R3E5T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_BONDS).length,
      "Inspecto has detected an alkali with single covalent bonds with electronegative atom"
    ).toBe(0);
  });

  it("covalent-counterion:1.3.3_E6T", async ({ expect }) => {
    const structure = ketToStructure(R3E6T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_BONDS).length,
      "Inspecto has detected an alkali with single covalent bonds with electronegative atom"
    ).toBe(0);
  });

  it("covalent-counterion:1.3.4_E1F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E1F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_BONDS_EXIST).length,
      "Inspecto has detected an alkali metal with multiple covalent bonds"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.4_E2F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E2F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_BONDS_EXIST).length,
      "Inspecto has detected an alkali metal with multiple covalent bonds"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.4_E3F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E3F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_BONDS_EXIST).length,
      "Inspecto has detected an alkali metal with multiple covalent bonds"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.4_E4F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E4F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_BONDS_EXIST).length,
      "Inspecto has detected an alkali metal with multiple covalent bonds"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.4_E5F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E5F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_BONDS_EXIST).length,
      "Inspecto has detected an alkali metal with multiple covalent bonds"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.4_E6F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E6F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_BONDS_EXIST).length,
      "Inspecto has detected an alkali metal with multiple covalent bonds"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.4_E1T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E1T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_BONDS_EXIST).length,
      "No alkali metal validation errors should be detected"
    ).toBe(0);
  });

  it("covalent-counterion:1.3.4_E2T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E2T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_BONDS_EXIST).length,
      "No alkali metal validation errors should be detected"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.4_E3T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E3T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_BONDS_EXIST).length,
      "No alkali metal validation errors should be detected"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.4_E4T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E4T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_BONDS_EXIST).length,
      "No alkali metal validation errors should be detected"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.4_E5T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_4_E5T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_BONDS_EXIST).length,
      "No alkali metal validation errors should be detected"
    ).toBe(0);
  });

  it("covalent-counterion:1.3.8_E1F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E1F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_EARTH_BONDS_EXIST).length,
      "Inspecto has detected an alkali metal with multiple covalent bonds"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.8_E2F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E2F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_EARTH_BONDS_EXIST).length,
      "Inspecto has detected an alkali metal with multiple covalent bonds"
    ).toBe(1);
  });
  it("covalent-counterion:1.3.8_E3F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E3F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_EARTH_BONDS_EXIST).length,
      "Inspecto has detected an alkali metal with multiple covalent bonds"
    ).toBe(1);
  });
  it("covalent-counterion:1.3.8_E4F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E4F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_EARTH_BONDS_EXIST).length,
      "Inspecto has detected an alkali metal with multiple covalent bonds"
    ).toBe(1);
  });
  it("covalent-counterion:1.3.8_E5F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E5F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_EARTH_BONDS_EXIST).length,
      "Inspecto has detected an alkali metal with multiple covalent bonds"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.8_E6F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E6F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_EARTH_BONDS_EXIST).length,
      "Inspecto has detected an alkali metal with multiple covalent bonds"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.8_R8E1F", async ({ expect }) => {
    const structure = ketToStructure(R8E1F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_EARTH_BONDS_EXIST).length,
      "Inspecto has detected an alkali metal with multiple covalent bonds"
    ).toBe(1);
  });
  it("covalent-counterion:1.3.8_R8E2F", async ({ expect }) => {
    const structure = ketToStructure(R8E2F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_EARTH_BONDS_EXIST).length,
      "Inspecto has detected an alkali metal with multiple covalent bonds"
    ).toBe(1);
  });
  it("covalent-counterion:1.3.8_R8E3F", async ({ expect }) => {
    const structure = ketToStructure(R8E3F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_EARTH_BONDS_EXIST).length,
      "Inspecto has detected an alkali metal with multiple covalent bonds"
    ).toBe(1);
  });
  it("covalent-counterion:1.3.8_R8E4F", async ({ expect }) => {
    const structure = ketToStructure(R8E4F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_EARTH_BONDS_EXIST).length,
      "Inspecto has detected an alkali metal with multiple covalent bonds"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.8_R8E5F", async ({ expect }) => {
    const structure = ketToStructure(R8E5F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_EARTH_BONDS_EXIST).length,
      "Inspecto has detected an alkali metal with multiple covalent bonds"
    ).toBe(2);
  });

  it("covalent-counterion:1.3.8_R8E6F", async ({ expect }) => {
    const structure = ketToStructure(R8E6F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_EARTH_BONDS_EXIST).length,
      "Inspecto has detected an alkali metal with multiple covalent bonds"
    ).toBe(3);
  });

  it("covalent-counterion:1.3.8_E1T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E1T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_EARTH_BONDS_EXIST).length,
      "No alkali metal validation errors should be detected"
    ).toBe(0);
  });

  it("covalent-counterion:1.3.8_E2T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E2T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_EARTH_BONDS_EXIST).length,
      "No alkali metal validation errors should be detected"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.8_E3T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E3T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_EARTH_BONDS_EXIST).length,
      "No alkali metal validation errors should be detected"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.8_E4T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E4T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_EARTH_BONDS_EXIST).length,
      "No alkali metal validation errors should be detected"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.8_E5T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E5T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_EARTH_BONDS_EXIST).length,
      "No alkali metal validation errors should be detected"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.8_E6T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_8_E6T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_ALKALI_EARTH_BONDS_EXIST).length,
      "No alkali metal validation errors should be detected"
    ).toBe(0);
  });

  it("covalent-counterion:1.3.9_E1F", async ({ expect }) => {
    const structure = ketToStructure(R1_3_9_E1F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_BERILLIUM_BONDS).length,
      "Inspecto has detected a covalently bound beryllium"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.9_R9E1F", async ({ expect }) => {
    const structure = ketToStructure(R9E1F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_BERILLIUM_BONDS).length,
      "Inspecto has detected a covalently bound beryllium"
    ).toBe(2);
  });

  it("covalent-counterion:1.3.9_R9E2F", async ({ expect }) => {
    const structure = ketToStructure(R9E2F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_BERILLIUM_BONDS).length,
      "Inspecto has detected a covalently bound beryllium"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.9_R9E3F", async ({ expect }) => {
    const structure = ketToStructure(R9E3F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_BERILLIUM_BONDS).length,
      "Inspecto has detected a covalently bound beryllium"
    ).toBe(3);
  });

  it("covalent-counterion:1.3.9_R9E4F", async ({ expect }) => {
    const structure = ketToStructure(R9E4F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_BERILLIUM_BONDS).length,
      "Inspecto has detected a covalently bound beryllium"
    ).toBe(9);
  });

  it("covalent-counterion:1.3.9_R9E5F", async ({ expect }) => {
    const structure = ketToStructure(R9E5F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_BERILLIUM_BONDS).length,
      "Inspecto has detected a covalently bound beryllium"
    ).toBe(2);
  });

  it("covalent-counterion:1.3.9_R9E6F", async ({ expect }) => {
    const structure = ketToStructure(R9E6F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_BERILLIUM_BONDS).length,
      "Inspecto has detected a covalently bound beryllium"
    ).toBe(4);
  });

  it("covalent-counterion:1.3.9_E2T", async ({ expect }) => {
    const structure = ketToStructure(R1_3_9_E2T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_BERILLIUM_BONDS).length,
      "Inspecto has detected a covalently bound beryllium"
    ).toBe(0);
  });

  it("covalent-counterion:1.3.6_R6E1T", async ({ expect }) => {
    const structure = ketToStructure(R6E1T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with single covalent bonds with electronegative atom"
    ).toBe(0);
  });

  it("covalent-counterion:1.3.6_R6E2T", async ({ expect }) => {
    const structure = ketToStructure(R6E2T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with single covalent bonds with electronegative atom"
    ).toBe(0);
  });

  it("covalent-counterion:1.3.6_R6E3T", async ({ expect }) => {
    const structure = ketToStructure(R6E3T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with single covalent bonds with electronegative atom"
    ).toBe(0);
  });

  it("covalent-counterion:1.3.6_R6E4T", async ({ expect }) => {
    const structure = ketToStructure(R6E4T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with single covalent bonds with electronegative atom"
    ).toBe(0);
  });

  it("covalent-counterion:1.3.6_R6E5T", async ({ expect }) => {
    const structure = ketToStructure(R6E5T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with single covalent bonds with electronegative atom"
    ).toBe(0);
  });

  it("covalent-counterion:1.3.6_R6E6T", async ({ expect }) => {
    const structure = ketToStructure(R6E6T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with single covalent bonds with electronegative atom"
    );
  });

  it("covalent-counterion:1.3.6_R6E1F", async ({ expect }) => {
    const structure = ketToStructure(R6E1F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with single covalent bonds with electronegative atom"
    );
  });

  it("covalent-counterion:1.3.6_R6E2F", async ({ expect }) => {
    const structure = ketToStructure(R6E2F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with single covalent bonds with electronegative atom"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.6_R6E3F", async ({ expect }) => {
    const structure = ketToStructure(R6E3F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with single covalent bonds with electronegative atom"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.6_R6E4F", async ({ expect }) => {
    const structure = ketToStructure(R6E4F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with single covalent bonds with electronegative atom"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.6_R6E5F", async ({ expect }) => {
    const structure = ketToStructure(R6E5F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with single covalent bonds with electronegative atom"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.6_R6E6F", async ({ expect }) => {
    const structure = ketToStructure(R6E6F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with single covalent bonds with electronegative atom"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.7_R7E1T", async ({ expect }) => {
    const structure = ketToStructure(R7E1T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_TWO_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth metal to two single drawn bonds"
    ).toBe(0);
  });

  it("covalent-counterion:1.3.7_R7E2T", async ({ expect }) => {
    const structure = ketToStructure(R7E2T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_TWO_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth metal to two single drawn bonds"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.7_R7E3T", async ({ expect }) => {
    const structure = ketToStructure(R7E3T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_TWO_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth metal to two single drawn bonds"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.7_R7E4T", async ({ expect }) => {
    const structure = ketToStructure(R7E4T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_TWO_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth metal to two single drawn bonds"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.7_R7E5T", async ({ expect }) => {
    const structure = ketToStructure(R7E5T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_TWO_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth metal to two single drawn bonds"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.7_R7E6T", async ({ expect }) => {
    const structure = ketToStructure(R7E6T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_TWO_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth metal to two single drawn bonds"
    ).toBe(0);
  });

  it("covalent-counterion:1.3.7_E1F", async ({ expect }) => {
    const structure = ketToStructure(R7E1F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_TWO_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with two single covalent bonds with electronegative atom"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.7_E2F", async ({ expect }) => {
    const structure = ketToStructure(R7E2F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_TWO_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with two single covalent bonds with electronegative atom"
    ).toBe(1);
  });
  it("covalent-counterion:1.3.7_E3F", async ({ expect }) => {
    const structure = ketToStructure(R7E3F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_TWO_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with two single covalent bonds with electronegative atom"
    ).toBe(1);
  });
  it("covalent-counterion:1.3.7_E4F", async ({ expect }) => {
    const structure = ketToStructure(R7E4F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_TWO_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with two single covalent bonds with electronegative atom"
    ).toBe(1);
  });
  it("covalent-counterion:1.3.7_E5F", async ({ expect }) => {
    const structure = ketToStructure(R7E5F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_TWO_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with two single covalent bonds with electronegative atom"
    ).toBe(1);
  });
  it("covalent-counterion:1.3.7_E6F", async ({ expect }) => {
    const structure = ketToStructure(R7E6F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_TWO_SINGLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with two single covalent bonds with electronegative atom"
    ).toBe(1);
  });

  it("covalent-counterion:1.3.5_R5E1T", async ({ expect }) => {
    const structure = ketToStructure(R5E1T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_DOUBLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with double covalent bonds with electronegative atom"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.5_R5E2T", async ({ expect }) => {
    const structure = ketToStructure(R5E2T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_DOUBLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with double covalent bonds with electronegative atom"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.5_R5E3T", async ({ expect }) => {
    const structure = ketToStructure(R5E3T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_DOUBLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with double covalent bonds with electronegative atom"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.5_R5E4T", async ({ expect }) => {
    const structure = ketToStructure(R5E4T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_DOUBLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with double covalent bonds with electronegative atom"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.5_R5E5T", async ({ expect }) => {
    const structure = ketToStructure(R5E5T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_DOUBLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with double covalent bonds with electronegative atom"
    ).toBe(0);
  });
  it("covalent-counterion:1.3.5_R5E6T", async ({ expect }) => {
    const structure = ketToStructure(R5E6T);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_DOUBLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with double covalent bonds with electronegative atom"
    ).toBe(0);
  });

  it("covalent-counterion:1.3.5_R5E6F", async ({ expect }) => {
    const structure = ketToStructure(R5E1F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_DOUBLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with double covalent bonds with electronegative atom"
    ).toBe(1);
  });
  it("covalent-counterion:1.3.5_R5E2F", async ({ expect }) => {
    const structure = ketToStructure(R5E2F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_DOUBLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with double covalent bonds with electronegative atom"
    ).toBe(1);
  });
  it("covalent-counterion:1.3.5_R5E3F", async ({ expect }) => {
    const structure = ketToStructure(R5E3F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_DOUBLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with double covalent bonds with electronegative atom"
    ).toBe(1);
  });
  it("covalent-counterion:1.3.5_R5E4F", async ({ expect }) => {
    const structure = ketToStructure(R5E4F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_DOUBLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with double covalent bonds with electronegative atom"
    ).toBe(1);
  });
  it("covalent-counterion:1.3.5_R5E5F", async ({ expect }) => {
    const structure = ketToStructure(R5E5F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_DOUBLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with double covalent bonds with electronegative atom"
    ).toBe(2);
  });
  it("covalent-counterion:1.3.5_R5E6F", async ({ expect }) => {
    const structure = ketToStructure(R5E6F);
    const rule = getRule(RuleNames.CovalentCounterion);

    const results = rule.verify(structure);

    expect(
      results.filter(res => res.errorCode === COVALENT_DOUBLE_ALC_EARTH_BONDS).length,
      "Inspecto has detected an alkali-earth with double covalent bonds with electronegative atom"
    ).toBe(1);
  });
});
