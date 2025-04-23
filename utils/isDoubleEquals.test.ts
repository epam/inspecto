import { describe, it, expect } from "vitest";
import { isNumbersEqual } from "./isDoubleEquals"; // Assuming the function is exported as isNumbersEqual

describe("isNumbersEqual", () => {
  it("should return true for strictly equal numbers", () => {
    expect(isNumbersEqual(5, 5)).toBe(true);
    expect(isNumbersEqual(-10, -10)).toBe(true);
    expect(isNumbersEqual(0, 0)).toBe(true);
  });

  it("should return true for numbers within default epsilon (Number.EPSILON)", () => {
    const a = 0.1 + 0.2;
    const b = 0.3;
    expect(a).not.toBe(b); // Standard floating point issue
    expect(isNumbersEqual(a, b)).toBe(true);

    expect(isNumbersEqual(1, 1 + Number.EPSILON / 2)).toBe(true);
    expect(isNumbersEqual(1, 1 - Number.EPSILON / 2)).toBe(true);
  });

  it("should return false for numbers outside default epsilon", () => {
    expect(isNumbersEqual(1, 1.000000000000001)).toBe(false); // Slightly larger than EPSILON
    expect(isNumbersEqual(1, 1 + Number.EPSILON * 2)).toBe(false);
    expect(isNumbersEqual(5, 6)).toBe(false);
    expect(isNumbersEqual(0.1, 0.2)).toBe(false);
  });

  it("should return true for numbers within custom epsilon", () => {
    const epsilon = 0.01;
    expect(isNumbersEqual(5.005, 5, epsilon)).toBe(true);
    expect(isNumbersEqual(4.995, 5, epsilon)).toBe(true);
  });

  it("should return false for numbers outside custom epsilon", () => {
    const epsilon = 0.01;
    expect(isNumbersEqual(5.015, 5, epsilon)).toBe(false);
    expect(isNumbersEqual(4.985, 5, epsilon)).toBe(false);
  });

  it("should handle zero correctly with epsilon", () => {
    expect(isNumbersEqual(0, Number.EPSILON / 2)).toBe(true);
    expect(isNumbersEqual(0, -Number.EPSILON / 2)).toBe(true);
    expect(isNumbersEqual(0, Number.EPSILON * 2)).toBe(false);
    expect(isNumbersEqual(0, -Number.EPSILON * 2)).toBe(false);
    expect(isNumbersEqual(0, 0.0000000000000001)).toBe(true); // Within default epsilon
    expect(isNumbersEqual(0, 0.000000000000001)).toBe(false); // Outside default epsilon
  });
});
