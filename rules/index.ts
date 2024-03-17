import { Rule } from "../src/models/Rule";
import {
  bondLengthAlgorithm,
  type BondLengthAlgorithmType,
} from "./bondLength";
import {
  trippleBondAngleAlgorithm,
  type trippleBondAngleAlgorithmType,
} from "./trippleBondAngle";

const bondLengthRule = new Rule<BondLengthAlgorithmType>(
  "Bond Length",
  bondLengthAlgorithm,
  { bondLength: 0.5, differenceError: 0.01 },
);

const trippleBondAngleRule = new Rule<trippleBondAngleAlgorithmType>(
  "Tripple Bond Angle",
  trippleBondAngleAlgorithm,
  { angleDiffError: 0.5 },
);

export { bondLengthRule, trippleBondAngleRule };
