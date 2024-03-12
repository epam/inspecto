// import { type RuleAlgorithm } from "@infrastructure";
// import { BOND_TYPES, Rule, type Structure } from "@models";
// import { getAngleBetweenBonds } from "@utils";

// const bondAngleTrippleBondAngle: RuleAlgorithm = (structure: Structure) => {
//   const output: string[] = [];

//   for (const molecule of structure) {
//     const trippleBonds = molecule.filterBondsByType(BOND_TYPES.TRIPLE);

//     if (trippleBonds.length > 0) {
//       for (const bond of trippleBonds) {
//         const adjacentBonds = molecule.getAdjacentBonds(bond);

//         for (const adjacentBond of adjacentBonds) {
//           const angle = getAngleBetweenBonds(adjacentBond, bond);
//           if (Math.abs(angle - Math.PI) > 0.5) {
//             output.push(
//               `The triple bond with the following metadata ${bond.toString()} violets the rule`,
//             );
//           }
//         }
//       }
//     } else {
//       output.push("There is no tripple bonds in molecule " + molecule.id);
//     }
//   }
//   return output;
// };

// export const defaultRules = [
//   new Rule("Bond Length", bondLength),
//   new Rule("Bond Angle: Triple Bond Angle", bondAngleTrippleBondAngle),
// ];
