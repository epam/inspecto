import { describe, it, expect } from "vitest";
import { shouldFix } from "./shouldFix";
import { type RuleConfig } from "@rules/algorithms/base";
import { type FixingScope } from "@infrastructure";

describe("shouldFix", () => {
  const errorCode1 = "ERR001";
  const path1 = "root.nodes.0";
  const errorCode2 = "ERR002";
  const path2 = "root.nodes.1.bonds.0";

  const fixingScope: FixingScope[] = [
    { errorCode: errorCode1, path: path1, data: {} },
    { errorCode: errorCode2, path: path2, data: {} },
  ];

  it("should return true if config.fixingRule is true, regardless of scope", () => {
    const config: RuleConfig = { fixingRule: true };
    expect(shouldFix(config, errorCode1, path1)).toBe(true);
    expect(shouldFix(config, "OTHER_ERROR", "other.path")).toBe(true);
  });

  it("should return true if config.fixingRule is true and fixingScope is provided", () => {
    const config: RuleConfig = { fixingRule: true, fixingScope };
    expect(shouldFix(config, errorCode1, path1)).toBe(true);
  });

  it("should return true if config.fixingRule is false but errorCode and path match an entry in fixingScope", () => {
    const config: RuleConfig = { fixingRule: false, fixingScope };
    expect(shouldFix(config, errorCode1, path1)).toBe(true);
    expect(shouldFix(config, errorCode2, path2)).toBe(true);
  });

  it("should return true if config.fixingRule is undefined but errorCode and path match an entry in fixingScope", () => {
    const config: RuleConfig = { fixingScope }; // fixingRule is undefined
    expect(shouldFix(config, errorCode1, path1)).toBe(true);
    expect(shouldFix(config, errorCode2, path2)).toBe(true);
  });

  it("should return false if config.fixingRule is false and no matching entry is found in fixingScope", () => {
    const config: RuleConfig = { fixingRule: false, fixingScope };
    expect(shouldFix(config, "OTHER_ERROR", path1)).toBe(false);
    expect(shouldFix(config, errorCode1, "other.path")).toBe(false);
    expect(shouldFix(config, "OTHER_ERROR", "other.path")).toBe(false);
  });

  it("should return false if config.fixingRule is false and fixingScope is empty", () => {
    const config: RuleConfig = { fixingRule: false, fixingScope: [] };
    expect(shouldFix(config, errorCode1, path1)).toBe(false);
  });

  it("should return false if config.fixingRule is false and fixingScope is undefined", () => {
    const config: RuleConfig = { fixingRule: false };
    expect(shouldFix(config, errorCode1, path1)).toBe(false);
  });

  it("should return false if config.fixingRule is undefined and fixingScope is undefined", () => {
    const config: RuleConfig = {};
    expect(shouldFix(config, errorCode1, path1)).toBe(false);
  });

  it("should return false if config.fixingRule is undefined and fixingScope is empty", () => {
    const config: RuleConfig = { fixingScope: [] };
    expect(shouldFix(config, errorCode1, path1)).toBe(false);
  });

  it("should return false if config.fixingRule is undefined and no matching entry is found in fixingScope", () => {
    const config: RuleConfig = { fixingScope };
    expect(shouldFix(config, "OTHER_ERROR", path1)).toBe(false);
    expect(shouldFix(config, errorCode1, "other.path")).toBe(false);
  });
});
