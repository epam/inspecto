import { describe, it, expect } from "vitest";
import { isAngleEquals } from "./isAngleEquals";

describe("isAngleEquals", () => {
  it("should return true for angles within 1 degree difference", () => {
    expect(isAngleEquals(120, 120.5)).toBe(true);
    expect(isAngleEquals(120, 119.5)).toBe(true);
    expect(isAngleEquals(120, 120)).toBe(true);
    expect(isAngleEquals(0, 0.9)).toBe(true);
    expect(isAngleEquals(359.1, 0)).toBe(true); // Wraps around
  });

  it("should return false for angles with difference > 1 degree", () => {
    expect(isAngleEquals(119.1, 121)).toBe(false);
    expect(isAngleEquals(120.1, 119)).toBe(false);
    expect(isAngleEquals(90, 91.1)).toBe(false);
    expect(isAngleEquals(0, 1.1)).toBe(false);
    expect(isAngleEquals(358.9, 0)).toBe(false);
  });

  it("should handle negative angles correctly (assuming comparison is based on absolute difference)", () => {
    // Note: The current implementation uses isNumbersEqual which relies on absolute difference.
    // Depending on desired behavior for negative angles, tests might need adjustment.
    expect(isAngleEquals(-10, -10.5)).toBe(true);
    expect(isAngleEquals(10, -10)).toBe(false); // Large difference
  });
});
