import { Rule } from "../src/models/Rule";
import { bondLengthAlgorithm, type BondLengthAlgorithmType } from "./bondLength";

const bondLengthRule = new Rule<BondLengthAlgorithmType>(
  "Bond Length",
  bondLengthAlgorithm,
  { bondLength: 0.5, differenceError: 0.01 },
);

export { bondLengthRule };
