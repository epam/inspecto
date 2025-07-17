import { Atom, BOND_TYPES, type Molecule, Location } from "@models";
import { ATOMIC_MASS, ATOMIC_NUMBER } from "@utils/atomicNumberAndMass";
export function compareSubstituentPair(molecule: Molecule, atom: Atom): Atom | null | undefined {
  const substituent = findSubstituents(molecule, atom);
  if (substituent.length !== 2) {
    throw new Error("Incorrect substitute count for compareSubstituentPair case");
  }
  const [substituent1, substituent2] = substituent;

  if (substituent1.cip !== null && substituent2.cip !== null) {
    if (
      (substituent1.cip === "R" && substituent2.cip === "S") ||
      (substituent1.cip === "r" && substituent2.cip === "s")
    ) {
      return substituent1;
    } else if (
      (substituent1.cip === "S" && substituent2.cip === "R") ||
      (substituent1.cip === "s" && substituent2.cip === "r")
    ) {
      return substituent2;
    }
  }

  const compareResult = compareSubstituents(substituent1, substituent2);
  if (compareResult !== 0) {
    const result = compareResult > 0 ? substituent2 : substituent1;

    return result;
  }

  const childrenOfSubstituent1 = findChild(substituent1, molecule, atom);
  const childrenOfSubstituent2 = findChild(substituent2, molecule, atom);

  if (childrenOfSubstituent1 === childrenOfSubstituent2) {
    return undefined;
  }
  const childWithLabelRInSubstituent1 = containsCipLabel(childrenOfSubstituent1, "R");
  const childWithLabelSInSubstituent2 = containsCipLabel(childrenOfSubstituent2, "S");

  const childWithLabelRInSubstituent2 = containsCipLabel(childrenOfSubstituent2, "R");
  const childWithLabelSInSubstituent1 = containsCipLabel(childrenOfSubstituent1, "S");

  const childWithLabelrInSubstituent1 = containsCipLabel(childrenOfSubstituent1, "r");
  const childWithLabelsInSubstituent2 = containsCipLabel(childrenOfSubstituent2, "s");

  const childWithLabelrInSubstituent2 = containsCipLabel(childrenOfSubstituent2, "r");
  const childWithLabelsInSubstituent1 = containsCipLabel(childrenOfSubstituent1, "s");

  if (
    (childWithLabelRInSubstituent1 && childWithLabelSInSubstituent2) ||
    (childWithLabelrInSubstituent1 && childWithLabelsInSubstituent2)
  ) {
    return substituent1;
  } else if (
    (childWithLabelRInSubstituent2 && childWithLabelSInSubstituent1) ||
    (childWithLabelrInSubstituent2 && childWithLabelsInSubstituent1)
  ) {
    return substituent2;
  }

  if (substituent1.cip !== null && substituent2.cip !== null) {
    if (
      (substituent1.cip === "R" && substituent2.cip === "S") ||
      (substituent1.cip === "r" && substituent2.cip === "s")
    ) {
      return substituent1;
    } else if (
      (substituent1.cip === "S" && substituent2.cip === "R") ||
      (substituent1.cip === "s" && substituent2.cip === "r")
    ) {
      return substituent2;
    }
  }

  if (childrenOfSubstituent1.length === 0 && childrenOfSubstituent2.length === 0) {
    return null;
  }
  if (childrenOfSubstituent1.length === 0) {
    return substituent2;
  }
  if (childrenOfSubstituent2.length === 0) {
    return substituent1;
  }

  const result = determineHigherPrioritySubstituentBasedOnChildren(
    molecule,
    substituent1,
    childrenOfSubstituent1,
    substituent2,
    childrenOfSubstituent2,
  );
  if (result !== null) {
    return result;
  } else {
    const highestChild1 = findHighestPriorityChild(childrenOfSubstituent1);
    const highestChild2 = findHighestPriorityChild(childrenOfSubstituent2);

    if (highestChild1 === null && highestChild2 !== null) {
      return substituent2;
    } else if (highestChild2 === null && highestChild1 !== null) {
      return substituent1;
    }

    if (
      highestChild1 !== undefined &&
      highestChild2 !== undefined &&
      highestChild1 !== null &&
      highestChild2 !== null
    ) {
      const childCompareResult = compareSubstituents(highestChild1, highestChild2);
      if (childCompareResult !== 0) {
        const resultingSubstituent = childCompareResult > 0 ? substituent2 : substituent1;

        return resultingSubstituent;
      } else if (childCompareResult === 0) {
        const grandChildrenOfSubstituent1 = findGrandchildren(childrenOfSubstituent1, molecule, substituent1);
        const grandChildrenOfSubstituent2 = findGrandchildren(childrenOfSubstituent2, molecule, substituent2);

        if (grandChildrenOfSubstituent1 === null && grandChildrenOfSubstituent2 !== null) {
          return substituent2;
        }
        if (grandChildrenOfSubstituent2 === null && grandChildrenOfSubstituent1 !== null) {
          return substituent1;
        }
        if (grandChildrenOfSubstituent1 === null && grandChildrenOfSubstituent2 === null) {
          return null;
        } else {
          const highestGrandchild1 = findHighestPriorityChild(grandChildrenOfSubstituent1);
          const highestGrandchild2 = findHighestPriorityChild(grandChildrenOfSubstituent2);

          if (highestGrandchild1 === null && highestGrandchild2 === null) {
            return null;
          } else if (highestGrandchild1 === null) {
            return substituent2;
          } else if (highestGrandchild2 === null) {
            return substituent1;
          }

          if (
            highestGrandchild1 !== undefined &&
            highestGrandchild2 !== undefined &&
            highestGrandchild1 !== null &&
            highestGrandchild2 !== null
          ) {
            const grandchildCompareResult = compareSubstituents(highestGrandchild1, highestGrandchild2);
            if (grandchildCompareResult !== 0) {
              const resultingSubstituent = grandchildCompareResult > 0 ? substituent2 : substituent1;

              return resultingSubstituent;
            }
          }
          const compareTotalAtomicNum = compareTotalAtomicNumbers(
            childrenOfSubstituent1,
            grandChildrenOfSubstituent1,
            childrenOfSubstituent2,
            grandChildrenOfSubstituent2,
          );

          if (compareTotalAtomicNum === 1) {
            return substituent2;
          }
          if (compareTotalAtomicNum === 2) {
            return substituent1;
          }
          if (compareTotalAtomicNum === undefined) {
            return null;
          }
        }
      }
    }
  }
  return null;
}

export function findSubstituents(molecule: Molecule, atom: Atom): Atom[] {
  const singleBonds = molecule.getAtomBonds(atom).filter(bond => bond.bondType === BOND_TYPES.SINGLE);
  const uniqueSubstituents = new Set(singleBonds.map(bond => (bond.from === atom ? bond.to : bond.from)));

  if (uniqueSubstituents.size === 1) {
    const iteratorResult = uniqueSubstituents.values().next();
    if (iteratorResult.done !== null && iteratorResult.done !== undefined && !iteratorResult.done) {
      const existingSubstituent = iteratorResult.value;
      const mirrorX = 2 * atom.x - existingSubstituent.x;
      const mirrorY = 2 * atom.y - existingSubstituent.y;
      const mirrorZ = 2 * atom.z - existingSubstituent.z;
      const virtualHydrogen = new Atom("H", new Location(mirrorX, mirrorY, mirrorZ));
      uniqueSubstituents.add(virtualHydrogen);
    }
  }

  return Array.from(uniqueSubstituents);
}

export function compareSubstituents(atomA: Atom, atomB: Atom): number {
  if (atomA.label === undefined || atomA.label === "" || atomB.label === undefined || atomB.label === "") {
    console.error("One of the atom labels is undefined or empty.");
    return 0;
  }
  const massAtomA = atomA.isotope ?? ATOMIC_MASS[atomA.label];
  const massAtomB = atomB.isotope ?? ATOMIC_MASS[atomB.label];

  if (atomA.isotope !== undefined || atomB.isotope !== undefined) {
    return massAtomB - massAtomA;
  }
  const atomicNumberA = ATOMIC_NUMBER[atomA.label];
  const atomicNumberB = ATOMIC_NUMBER[atomB.label];

  if (atomicNumberA === undefined || atomicNumberB === undefined) {
    return massAtomB - massAtomA;
  }

  if (atomicNumberA !== atomicNumberB) {
    return atomicNumberB - atomicNumberA;
  }
  return massAtomB - massAtomA;
}

export function findChild(atom: Atom, molecule: Molecule, exclude: Atom): Atom[] {
  const foundChild = molecule
    .getAtomBonds(atom)
    .filter(bond => bond.from !== exclude && bond.to !== exclude)
    .map(bond => (bond.from === atom ? bond.to : bond.from));
  return foundChild;
}

export function containsCipLabel(atomList: Atom[], label: string): boolean {
  return atomList.some(atom => atom.cip === label);
}

export function determineHigherPrioritySubstituentBasedOnChildren(
  molecule: Molecule,
  substituent1: Atom,
  childrenOfSubstituent1: Atom[],
  substituent2: Atom,
  childrenOfSubstituent2: Atom[],
): Atom | null {
  const substituent1TotalChildPriority = calculateTotalEffectiveAtomCount(molecule, childrenOfSubstituent1);
  const substituent2TotalChildPriority = calculateTotalEffectiveAtomCount(molecule, childrenOfSubstituent2);

  if (substituent1TotalChildPriority > substituent2TotalChildPriority) {
    return substituent1;
  } else if (substituent1TotalChildPriority < substituent2TotalChildPriority) {
    return substituent2;
  } else {
    return null;
  }
}

export function calculateTotalEffectiveAtomCount(molecule: Molecule, children: Atom[]): number {
  return children.reduce((acc, child) => acc + calculateEffectiveAtomCount(molecule, child), 0);
}

export function calculateEffectiveAtomCount(molecule: Molecule, atom: Atom): number {
  let count = 1;
  const bonds = molecule.getAtomBonds(atom);
  bonds.forEach(bond => {
    switch (bond.bondType) {
      case BOND_TYPES.DOUBLE:
        count += 1;
        break;
      case BOND_TYPES.TRIPLE:
        count += 2;
        break;
      default:
        break;
    }
  });

  return count;
}

export function findHighestPriorityChild(children: Atom[]): Atom | null | undefined {
  if (children.length === 0) {
    return null;
  }
  if (children.length === 1) {
    return children[0];
  }
  let highestPriority = children[0];

  for (let i = 1; i < children.length; i++) {
    const current = children[i];
    const comparison = compareSubstituents(highestPriority, current);
    if (comparison > 0) {
      highestPriority = current;
    }
  }
  return highestPriority;
}

export function findGrandchildren(children: Atom[], molecule: Molecule, substituent: Atom): Atom[] {
  let grandchildren: Atom[] = [];

  for (const child of children) {
    const childChildren = findChild(child, molecule, substituent);
    grandchildren = grandchildren.concat(childChildren);
  }

  return grandchildren;
}

export function compareTotalAtomicNumbers(
  children1: Atom[],
  grandChildren1: Atom[],
  children2: Atom[],
  grandChildren2: Atom[],
): number | undefined {
  function sumOfAtomicNumbers(atoms: Atom[]): number {
    return atoms.reduce((sum, atom) => {
      const atomicNumber = ATOMIC_NUMBER[atom.label];
      return sum + atomicNumber;
    }, 0);
  }
  const total1 = sumOfAtomicNumbers([...children1, ...grandChildren1]);
  const total2 = sumOfAtomicNumbers([...children2, ...grandChildren2]);

  if (total1 > total2) {
    return 1;
  } else if (total1 < total2) {
    return 2;
  }

  return undefined;
}
