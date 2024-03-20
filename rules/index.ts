import { Rule } from "./models";
import {
  bondLengthAlgorithm,
  type BondLengthAlgorithmType,
} from "./bondLength";
import {
  trippleBondAngleAlgorithm,
  type trippleBondAngleAlgorithmType,
} from "./trippleBondAngle";

export const bondLengthRule = new Rule<BondLengthAlgorithmType>(
  "Bond Length",
  bondLengthAlgorithm,
  { bondLength: 1, differenceError: 0.01 },
);

export const trippleBondAngleRule = new Rule<trippleBondAngleAlgorithmType>(
  "Tripple Bond Angle",
  trippleBondAngleAlgorithm,
  { angleDiffError: 0.5 },
);

export { Rule };
