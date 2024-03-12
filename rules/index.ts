import { Rule } from "../src/models/Rule";
import { bondLengthAlgorithm } from "./bondLength";

const bondLengthRule = new Rule("Bond Length", bondLengthAlgorithm);

export { bondLengthRule };
