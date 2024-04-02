import { Rule } from "./models";
import {
  bondLengthAlgorithm,
  type BondLengthAlgorithmType,
} from "./bondLength";
import {
  trippleBondAngleAlgorithm,
  type trippleBondAngleAlgorithmType,
} from "./trippleBondAngle";
import {
  overlappingBondsAlgorithm,
  type OverlappingBondsConfigType,
} from "./overlappingBonds";

export const bondLengthRule = new Rule<BondLengthAlgorithmType>(
  "Bond Length",
  bondLengthAlgorithm,
  { bondLength: 1, differenceError: 0.01 },
);

export const trippleBondAngleRule = new Rule<trippleBondAngleAlgorithmType>(
  "Tripple Bond Angle",
  trippleBondAngleAlgorithm,
  { angleDiffError: 0.5, fixingRule: false },
);

export const overlappingBonds = new Rule<OverlappingBondsConfigType>(
  "Overlapping Bonds",
  overlappingBondsAlgorithm,
  {},
);

export { Rule };
