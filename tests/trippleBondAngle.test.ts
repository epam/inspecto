import { describe, it, expect } from "vitest";
import { Atom, Location, Bond, BOND_TYPES, Molecule, Structure } from "@models"; // Adjust path if necessary based on tsconfig paths
import {
  trippleBondAngleAlgorithm,
  TRIPLE_BOND_ANGLE,
  type TrippleBondAngleRuleConfig,
} from "../rules/algorithms/trippleBondAngle"; // Adjust path as needed

// Helper function to create a structure with a single molecule
const createStructure = (atoms: Atom[], bonds: Bond[]): Structure => {
  // Molecule ID can be arbitrary for tests unless specific paths are checked deeply
  const molecule = new Molecule("testMol", atoms, bonds, []);
  return new Structure([molecule]);
};

// Default config for most tests
const config: TrippleBondAngleRuleConfig = { angleDiffError: 0.1, fixingRule: false };
// Config with fixing enabled
const fixingConfig: TrippleBondAngleRuleConfig = { angleDiffError: 0.1, fixingRule: true };

describe("trippleBondAngleAlgorithm", () => {
  it("should not report errors for correct 180-degree angle", () => {
    const atom1 = new Atom("C", new Location(0, 0, 0));
    const atom2 = new Atom("C", new Location(1, 0, 0));
    const atom3 = new Atom("C", new Location(2, 0, 0));
    const bond1 = new Bond(BOND_TYPES.TRIPLE, [atom1, atom2], [0, 1]);
    const bond2 = new Bond(BOND_TYPES.SINGLE, [atom2, atom3], [1, 2]);
    const structure = createStructure([atom1, atom2, atom3], [bond1, bond2]);

    const results = trippleBondAngleAlgorithm(structure, config);
    expect(results.length).toBe(0);
  });

  it("should report an error for incorrect angle (e.g., 90 degrees)", () => {
    const atom1 = new Atom("C", new Location(0, 0, 0));
    const atom2 = new Atom("C", new Location(1, 0, 0));
    const atom3 = new Atom("C", new Location(1, 1, 0)); // Creates a 90-degree angle
    const bond1 = new Bond(BOND_TYPES.TRIPLE, [atom1, atom2], [0, 1]);
    const bond2 = new Bond(BOND_TYPES.SINGLE, [atom2, atom3], [1, 2]);
    const structure = createStructure([atom1, atom2, atom3], [bond1, bond2]);

    const results = trippleBondAngleAlgorithm(structure, config);
    expect(results.length).toBe(1);
    expect(results[0].errorCode).toBe(TRIPLE_BOND_ANGLE);
    // Check that the path points to the triple bond (index 0)
    expect(results[0].path).toBe("testMol->bonds->0");
    // Check that the message identifies the adjacent bond (index 1)
    expect(results[0].message).toBe("adjacent bond:testMol->bonds->1");
  });

  it("should not report errors when no triple bonds are present", () => {
    const atom1 = new Atom("C", new Location(0, 0, 0));
    const atom2 = new Atom("C", new Location(1, 0, 0));
    const atom3 = new Atom("C", new Location(2, 0, 0));
    const bond1 = new Bond(BOND_TYPES.SINGLE, [atom1, atom2], [0, 1]); // All single bonds
    const bond2 = new Bond(BOND_TYPES.SINGLE, [atom2, atom3], [1, 2]);
    const structure = createStructure([atom1, atom2, atom3], [bond1, bond2]);

    const results = trippleBondAngleAlgorithm(structure, config);
    expect(results.length).toBe(0);
  });

  it("should report error for the incorrect adjacent bond when multiple exist", () => {
    const atom1 = new Atom("C", new Location(0, 0, 0)); // idx 0
    const atom2 = new Atom("C", new Location(1, 0, 0)); // idx 1 (common atom)
    const atom3 = new Atom("C", new Location(2, 0, 0)); // idx 2 (correct angle relative to bond1)
    const atom4 = new Atom("C", new Location(1, 1, 0)); // idx 3 (incorrect angle relative to bond1)
    const bond1 = new Bond(BOND_TYPES.TRIPLE, [atom1, atom2], [0, 1]); // Triple bond (index 0)
    const bond2 = new Bond(BOND_TYPES.SINGLE, [atom2, atom3], [1, 2]); // Correct adjacent (index 1)
    const bond3 = new Bond(BOND_TYPES.SINGLE, [atom2, atom4], [1, 3]); // Incorrect adjacent (index 2)
    const structure = createStructure([atom1, atom2, atom3, atom4], [bond1, bond2, bond3]);

    const results = trippleBondAngleAlgorithm(structure, config);
    expect(results.length).toBe(1); // Only the incorrect angle should be reported
    expect(results[0].errorCode).toBe(TRIPLE_BOND_ANGLE);
    expect(results[0].path).toBe("testMol->bonds->0"); // Path points to the triple bond
    expect(results[0].message).toBe("adjacent bond:testMol->bonds->2"); // Message points to the incorrect adjacent bond (bond3)
  });

  it("should fix the incorrect angle when fixingRule is true", () => {
    const atom1 = new Atom("C", new Location(0, 0, 0));
    const atom2 = new Atom("C", new Location(1, 0, 0));
    const atom3 = new Atom("C", new Location(1, 1, 0)); // Incorrect position, angle is 90 deg
    const bond1 = new Bond(BOND_TYPES.TRIPLE, [atom1, atom2], [0, 1]);
    const bond2 = new Bond(BOND_TYPES.SINGLE, [atom2, atom3], [1, 2]);
    const structure = createStructure([atom1, atom2, atom3], [bond1, bond2]);

    const results = trippleBondAngleAlgorithm(structure, fixingConfig);

    // Error should still be reported before fix is applied conceptually
    expect(results.length).toBe(1);
    expect(results[0].errorCode).toBe(TRIPLE_BOND_ANGLE);

    // Check if atom3 position was corrected to make the angle 180 degrees
    // Calculation based on algorithm logic: targetAtom moves along the line defined by the triple bond
    // Expected position for atom3 is (2, 0, 0) if bond lengths are 1.
    expect(atom3.x).toBeCloseTo(2);
    expect(atom3.y).toBeCloseTo(0);
    expect(atom3.z).toBeCloseTo(0); // Assuming 2D operations, z should remain 0
  });

  it("should handle multiple molecules correctly", () => {
    // Molecule 1: Incorrect angle
    const m1atom1 = new Atom("C", new Location(0, 0, 0));
    const m1atom2 = new Atom("C", new Location(1, 0, 0));
    const m1atom3 = new Atom("C", new Location(1, 1, 0)); // Incorrect angle
    const m1bond1 = new Bond(BOND_TYPES.TRIPLE, [m1atom1, m1atom2], [0, 1]);
    const m1bond2 = new Bond(BOND_TYPES.SINGLE, [m1atom2, m1atom3], [1, 2]);
    const molecule1 = new Molecule("mol1", [m1atom1, m1atom2, m1atom3], [m1bond1, m1bond2], []);

    // Molecule 2: Correct angle
    const m2atom1 = new Atom("N", new Location(5, 5, 0));
    const m2atom2 = new Atom("C", new Location(6, 5, 0));
    const m2atom3 = new Atom("H", new Location(7, 5, 0)); // Correct angle
    const m2bond1 = new Bond(BOND_TYPES.TRIPLE, [m2atom1, m2atom2], [0, 1]);
    const m2bond2 = new Bond(BOND_TYPES.SINGLE, [m2atom2, m2atom3], [1, 2]);
    const molecule2 = new Molecule("mol2", [m2atom1, m2atom2, m2atom3], [m2bond1, m2bond2], []);

    // Create structure with both molecules
    const structure = new Structure([molecule1, molecule2]);

    const results = trippleBondAngleAlgorithm(structure, config);
    expect(results.length).toBe(1); // Only one error from molecule 1
    expect(results[0].errorCode).toBe(TRIPLE_BOND_ANGLE);
    expect(results[0].path).toBe("mol1->bonds->0"); // Ensure error path includes molecule ID
    expect(results[0].message).toBe("adjacent bond:mol1->bonds->1");
  });

  it("should not report errors for a triple bond with no adjacent bonds", () => {
    const atom1 = new Atom("C", new Location(0, 0, 0));
    const atom2 = new Atom("C", new Location(1, 0, 0));
    const bond1 = new Bond(BOND_TYPES.TRIPLE, [atom1, atom2], [0, 1]);
    const structure = createStructure([atom1, atom2], [bond1]); // Only the triple bond exists

    const results = trippleBondAngleAlgorithm(structure, config);
    expect(results.length).toBe(0);
  });

  it.skip("should respect the angleDiffError configuration", () => {
    const atom1 = new Atom("C", new Location(0, 0, 0));
    const atom2 = new Atom("C", new Location(1, 0, 0));
    // Angle slightly off PI (180 deg), but within error margin 0.1 rad
    const smallAngleDeviation = 0.05; // Radians (~2.86 degrees)
    // Calculate position for atom3 based on the deviation
    const bondLength = 1.0; // Assume bond length for calculation simplicity
    const angle = Math.PI - smallAngleDeviation;
    const atom3 = new Atom("C", new Location(1 + bondLength * Math.cos(angle), bondLength * Math.sin(angle), 0));

    const bond1 = new Bond(BOND_TYPES.TRIPLE, [atom1, atom2], [0, 1]);
    const bond2 = new Bond(BOND_TYPES.SINGLE, [atom2, atom3], [1, 2]);
    const structure = createStructure([atom1, atom2, atom3], [bond1, bond2]);

    // Test with config error = 0.1 -> should pass (0.05 < 0.1)
    const resultsPass = trippleBondAngleAlgorithm(structure, { angleDiffError: 0.1, fixingRule: false });
    expect(resultsPass.length).toBe(0);

    // Test with config error = 0.01 -> should fail (0.05 > 0.01)
    const resultsFail = trippleBondAngleAlgorithm(structure, { angleDiffError: 0.01, fixingRule: false });
    expect(resultsFail.length).toBe(1);
    expect(resultsFail[0].errorCode).toBe(TRIPLE_BOND_ANGLE);
  });
});
