import { describe, it, expect } from "vitest";
import { findCoordinatesForAngle } from "./getCoordinatesForAngle";
import { Atom, Location } from "@models";

function createAtomWithLocation(label: string, x: number, y: number, z: number): Atom {
  return new Atom(label, new Location(x, y, z));
}

describe("findCoordinatesForAngle", () => {
  it("calculates coordinates for a 45-degree angle", () => {
    const referenceAtom = createAtomWithLocation("H", 3, 1, 0);
    const centerAtom = createAtomWithLocation("C", 2, 1, 0);
    const distance = 1;
    const angle = 45;

    const radians = angle * (Math.PI / 180);
    const expectedX = centerAtom.x + Math.cos(radians) * distance;
    const expectedY = centerAtom.y - Math.sin(radians) * distance;

    const { x, y } = findCoordinatesForAngle(referenceAtom, centerAtom, distance, angle);
    expect(x).toBeCloseTo(expectedX);
    expect(y).toBeCloseTo(expectedY);
  });

  it("calculates coordinates for a 0-degree angle", () => {
    const referenceAtom = createAtomWithLocation("H", 1, 1, 0);
    const centerAtom = createAtomWithLocation("C", 2, 1, 0);
    const distance = 1;
    const angle = 0;

    const { x, y } = findCoordinatesForAngle(referenceAtom, centerAtom, distance, angle);
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(1);
  });

  it("calculates coordinates for a 30-degree angle", () => {
    const referenceAtom = createAtomWithLocation("H", 3, 1, 0);
    const centerAtom = createAtomWithLocation("C", 2, 1, 0);
    const distance = 1;
    const angle = 30;

    const radians = angle * (Math.PI / 180);
    const expectedX = centerAtom.x + Math.cos(radians) * distance;
    const expectedY = centerAtom.y - Math.sin(radians) * distance;

    const { x, y } = findCoordinatesForAngle(referenceAtom, centerAtom, distance, angle);
    expect(x).toBeCloseTo(expectedX);
    expect(y).toBeCloseTo(expectedY);
  });

  it("calculates coordinates for a 60-degree angle", () => {
    const referenceAtom = createAtomWithLocation("H", 3, 1, 0);
    const centerAtom = createAtomWithLocation("C", 2, 1, 0);
    const distance = 1;
    const angle = 60;

    const radians = angle * (Math.PI / 180);
    const expectedX = centerAtom.x + Math.cos(radians) * distance;
    const expectedY = centerAtom.y - Math.sin(radians) * distance;

    const { x, y } = findCoordinatesForAngle(referenceAtom, centerAtom, distance, angle);
    expect(x).toBeCloseTo(expectedX);
    expect(y).toBeCloseTo(expectedY);
  });

  it("calculates coordinates for a 120-degree angle", () => {
    const referenceAtom = createAtomWithLocation("H", 1, 1, 0);
    const centerAtom = createAtomWithLocation("C", 2, 1, 0);
    const distance = 1;
    const angle = 120;

    const radians = angle * (Math.PI / 180);
    const expectedX = centerAtom.x - Math.cos(radians) * distance;
    const expectedY = centerAtom.y + Math.sin(radians) * distance;

    const { x, y } = findCoordinatesForAngle(referenceAtom, centerAtom, distance, angle);
    expect(x).toBeCloseTo(expectedX);
    expect(y).toBeCloseTo(expectedY);
  });

  it("calculates coordinates for a 90-degree angle", () => {
    const referenceAtom = createAtomWithLocation("H", 1, 1, 0);
    const centerAtom = createAtomWithLocation("C", 2, 1, 0);
    const distance = 1;
    const angle = 90;

    const { x, y } = findCoordinatesForAngle(referenceAtom, centerAtom, distance, angle);
    expect(x).toBeCloseTo(2);
    expect(y).toBeCloseTo(2);
  });

  it("calculates coordinates for a 180-degree angle", () => {
    const referenceAtom = createAtomWithLocation("H", 3, 1, 0);
    const centerAtom = createAtomWithLocation("C", 2, 1, 0);
    const distance = 1;
    const angle = 180;

    const { x, y } = findCoordinatesForAngle(referenceAtom, centerAtom, distance, angle);
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(1);
  });
});
