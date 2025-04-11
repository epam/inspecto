# Creating a New Rule

This guide explains how to create and implement a new rule in the Inspecto system.

## Overview

Rules in Inspecto are algorithms that validate chemical structures against specific criteria. Each rule is responsible for checking particular aspects of molecular structures, such as bond angles, valence states, or query properties.

## Rule Creation Steps

### 1. Create Rule Algorithm File

Create a new TypeScript file in the `rules/algorithms` directory:

```typescript
// rules/algorithms/myNewRule.ts
import { type RulesValidationResults } from "@infrastructure";
import { type RuleAlgorithm } from "@rules/infrastructure";

// Define rule configuration interface
export interface MyNewRuleConfig {
  fixingRule?: boolean;
  // Add other configuration options
}

// Define error code constant
export const MY_NEW_RULE_ERROR = "my-new-rule:XX"; // XX is a unique number

// Implement rule algorithm
export const myNewRuleAlgorithm: RuleAlgorithm<MyNewRuleConfig> = (structure, config) => {
  const output: RulesValidationResults[] = [];

  for (const molecule of structure.molecules()) {
    // Implement your rule logic here
    // Add validation results to output array
  }

  return output;
};
```

### 2. Register the Rule

Add your rule to `rules/index.ts`:

```typescript
// Add import
import { type MyNewRuleConfig, myNewRuleAlgorithm } from "@rules/algorithms";

// Register rule with RulesManager
RulesManager.createRule<MyNewRuleConfig>(
  Rules.MyNewRule,
  myNewRuleAlgorithm,
  { fixingRule: false }, // default config
  []
);

// Add type to Registry
declare module "@rules/infrastructure" {
  interface Registry {
    [Rules.MyNewRule]: MyNewRuleConfig;
  }
}
```

### 3. Create Tests

Create a test file in `tests/myNewRule.test.ts`:

```typescript
import { it, describe } from "vitest";
import { ketToStructure, getRule } from "@testing";
import { Rules as RuleNames } from "@infrastructure";

import E1F from "./mocks/myNewRule/E1F.ket?raw";
import E1T from "./mocks/myNewRule/E1T.ket?raw";

const verifyKet = (ket: string): RulesValidationResults[] => {
  const structure = ketToStructure(ket);
  const rule = getRule(RuleNames.MyNewRule);
  return rule.verify(structure);
};

describe("My New Rule", async () => {
  it("myNewRule:E1F", async ({ expect }) => {
    const results = verifyKet(E1F);
    expect(results.length, "Rule should detect issues").toBeGreaterThan(0);
  });

  it("myNewRule:E1T", async ({ expect }) => {
    const results = verifyKet(E1T);
    expect(results.length, "No issues should be detected").toBe(0);
  });
});
```

## Rule Implementation Guidelines

### 1. Structure Access

Rules receive a `Structure` object that provides access to molecules:

```typescript
for (const molecule of structure.molecules()) {
  // Access molecule properties:
  molecule.atoms; // Array of atoms
  molecule.bonds; // Array of bonds
  molecule.id; // Molecule identifier
}
```

### 2. Validation Results

Each validation result should include:

```typescript
{
  errorCode: string; // Unique error code for the rule
  isFixable: boolean; // Whether the issue can be automatically fixed
  message: string; // Human-readable error message
  path: string; // Path to the problematic element
}
```

### 3. Fixing Support

If your rule supports fixing issues:

```typescript
import { shouldFix } from "@utils";

if (shouldFix(config, MY_NEW_RULE_ERROR, path)) {
  // Implement fix logic here
}
```

## Examples

### Valence Rule Example

```typescript
export const valenceAlgorithm: RuleAlgorithm<ValenceRuleConfig> = (structure, config) => {
  const output: RulesValidationResults[] = [];

  for (const molecule of structure.molecules()) {
    for (const atom of molecule.atoms) {
      // Check valence rules
      if (!VALENCE_RULES[atom.label].includes(currentValence)) {
        output.push({
          errorCode: VALENCE,
          isFixable: false,
          message: `Atom ${molecule.id}->${molecule.getAtomIndex(atom)} (${atom.label}) has incorrect valence`,
          path: `${molecule.id}->${molecule.getAtomIndex(atom)}`,
        });
      }
    }
  }

  return output;
};
```

### Query Bond Rule Example

```typescript
export const queryBondAlgorithm: RuleAlgorithm<QueryBondAlgorithmType> = (structure, config) => {
  const output: RulesValidationResults[] = [];

  for (const molecule of structure.molecules()) {
    const bonds = molecule.bonds.filter(bond =>
      [BOND_TYPES.SINGLE_DOUBLE, BOND_TYPES.SINGLE_AROMATIC].includes(bond.bondType)
    );

    bonds.forEach(bond => {
      if (shouldFix(config, INCORRECT_QUERY_BOND, path)) {
        bond.bondType = BOND_TYPES.SINGLE;
      } else {
        output.push({
          isFixable: true,
          errorCode: INCORRECT_QUERY_BOND,
          message: `Incorrect query bond type detected`,
          path: path,
        });
      }
    });
  }

  return output;
};
```

### Class-Based Rule Example

Rules can also be implemented using classes for more complex logic or when you need to maintain state:

```typescript
import { type RulesValidationResults } from "@infrastructure";
import { type RuleAlgorithm } from "@rules/infrastructure";
import { shouldFix } from "@utils";
import { BaseRule, type RuleConfig } from "@rules/algorithms/base";
import { type Structure } from "@models";

export interface ValencePropertyRuleConfig extends RuleConfig {
  fixingRule?: boolean;
}

export const VALENCE_PROPERTY = "valence-property:27";

export class ValencePropertyRule extends BaseRule<ValencePropertyRuleConfig> {
  private output: RulesValidationResults[] = [];
  private config: ValencePropertyRuleConfig;
  private structure: Structure;

  verify(structure: Structure, config: ValencePropertyRuleConfig): RulesValidationResults[] {
    this.structure = structure;
    this.config = config;
    this.output = [];

    for (const molecule of this.structure.molecules()) {
      this.validateMolecule(molecule);
    }

    return this.output;
  }

  private validateMolecule(molecule: Molecule): void {
    for (const atom of molecule.atoms) {
      if (atom.valenceProperty) {
        const path = `${molecule.id}->${molecule.getAtomIndex(atom)}`;

        if (shouldFix(this.config, VALENCE_PROPERTY, path)) {
          atom.valenceProperty = undefined;
        } else {
          this.output.push({
            errorCode: VALENCE_PROPERTY,
            isFixable: true,
            message: `Atom ${atom.label}[${molecule.getAtomIndex(atom)}] has valence property`,
            path,
          });
        }
      }
    }
  }
}

// Usage in rules/index.ts:
RulesManager.createRule<ValencePropertyRuleConfig>(
  Rules.ValenceProperty,
  ValencePropertyRule,
  { fixingRule: false },
  []
);
// Add type to Registry
declare module "@rules/infrastructure" {
  interface Registry {
    [Rules.ValenceProperty]: ValencePropertyRuleConfig;
  }
}
```

Class-based rules offer several advantages:

1. Better organization of complex rule logic
2. Ability to share state between methods
3. Easier to maintain and extend
4. Support for private helper methods
5. Better TypeScript type inference

## Best Practices

1. **Unique Error Codes**: Use a unique number for your rule's error code
2. **Clear Messages**: Provide detailed, actionable error messages
3. **Efficient Processing**: Optimize loops and filtering for large structures
4. **Comprehensive Tests**: Include tests for both valid and invalid cases
5. **Type Safety**: Use TypeScript interfaces for rule configuration
6. **Documentation**: Document configuration options and error codes

## Testing

1. Create test files in `tests/mocks/yourRule/`
2. Include both failing (E*F) and passing (E*T) test cases
3. Test edge cases and common scenarios
4. Verify fixing functionality if supported

## Debugging Tips

1. Use molecule and atom indices in error messages
2. Log intermediate values during development
3. Test with simple structures first
4. Verify rule registration and configuration

For more examples, refer to existing rules in the `rules/algorithms` directory.
