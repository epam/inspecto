import { type IRulesManager } from "@rules/infrastructure";
import { RulesManagerProcessor } from "@rules/processors";
import {
  type BondAngleRuleConfig,
  type BondLengthRuleConfig,
  type CovalentCounterionRuleConfig,
  type OverlappingRuleConfig,
  type TrippleBondAngleRuleConfig,
  type ValenceRuleConfig,
  type StereoLabelDoubleRuleConfig,
  type StereoLabelTetrahedralCenterRuleConfig,
  type AliasRuleConfig,
  type UndefinedChiralCentersAlgorithmType,
  type AromaticityRuleConfig,
  type StraightDoubleBondRuleConfig,
  type CombinedStereoRuleConfig,
  type IncorrectCovalentBondsRuleConfig,
  // type AtomMappingRuleConfig,
  // type RareElementsRuleConfig,
  // type QueryBondAlgorithmType,
  // type RingStrainsAlgorithmType,
  // type ValencePropertyRuleConfig,
  // type RemovingRadicalRuleConfig,
  // type ChargedMoleculesRuleConfig,
  // type WigglyDoubleBondRuleConfig,
  // type RemoveSolventRuleConfig,
  // type CrossedDoubleBondRuleConfig,
  // type RemoveExplicitHydrogensRuleConfig,
  // type AddExplicitHydrogensRuleConfig,
  // type IncorrectIsotopeRuleConfig,
  // type QueryPropertiesRuleConfig,
  // type TetrahedralStereoRuleConfig,
  AliasRule,
  bondAngleAlgorithm,
  covalentCounterionAlgorithm,
  overlappingAlgorithm,
  trippleBondAngleAlgorithm,
  valenceAlgorithm,
  stereoLabelDoubleBondAlgorithm,
  StereoLabelTetrahedralCenterRule,
  undefinedChiralCentersAlgorithm,
  AromaticityRule,
  StraightDoubleBondRule,
  combinedStereoRuleAlgorithm,
  IncorrectCovalentBondsRule,
  BondLengthRule,
  // ChargedMoleculesRule,
  // WigglyDoubleBondRule,
  // RemoveSolventRule,
  // CrossedDoubleBondRule,
  // RemoveExplicitHydrogensRule,
  // AddExplicitHydrogensRule,
  // ValencePropertyRule,
  // RemovingRadicalRule,
  // ringStrainsAlgorithm,
  // incorrectIsotopeAlgorithm,
  // queryPropertiesAlgorithm,
  // tetrahedralStereoAlgorithm,
  // atomMappingAlgorithm,
  // rareElementsAlgorithm,
  // queryBondAlgorithm,
} from "@rules/algorithms";

import { Rules } from "@infrastructure";
export { Rule } from "./models/Rule";

const RulesManager: IRulesManager = new RulesManagerProcessor();

RulesManager.createRule<ValenceRuleConfig>(Rules.Valence, valenceAlgorithm, {}, []);

RulesManager.createRule<CovalentCounterionRuleConfig>(
  Rules.CovalentCounterion,
  covalentCounterionAlgorithm,
  { fixingRule: false },
  []
);

RulesManager.createRule<IncorrectCovalentBondsRuleConfig>(
  Rules.IncorrectCovalentBonds,
  IncorrectCovalentBondsRule,
  { cutOff: 1.9, fixingRule: false },
  []
);

RulesManager.createRule<BondLengthRuleConfig>(
  Rules.BondLength,
  BondLengthRule,
  { bondLength: 1, differenceError: 0.01, fixingRule: false },
  []
);

RulesManager.createRule<TrippleBondAngleRuleConfig>(
  Rules.TrippleBondAngle,
  trippleBondAngleAlgorithm,
  { angleDiffError: 0.5, fixingRule: false },
  []
);

RulesManager.createRule<AliasRuleConfig>(Rules.Alias, AliasRule, { fixingRule: false }, []);

RulesManager.createRule<AromaticityRuleConfig>(Rules.Aromaticity, AromaticityRule, { fixingRule: false }, []);

RulesManager.createRule<StraightDoubleBondRuleConfig>(
  Rules.StraightDoubleBond,
  StraightDoubleBondRule,
  { fixingRule: false },
  []
);

RulesManager.createRule<BondAngleRuleConfig>(Rules.BondAngle, bondAngleAlgorithm, { fixingRule: false }, []);
RulesManager.createRule<OverlappingRuleConfig>(
  Rules.Overlapping,
  overlappingAlgorithm,
  { bondLength: 1, overlappingFactor: 0.33, fixingRule: false },
  []
);
RulesManager.createRule<StereoLabelDoubleRuleConfig>(
  Rules.StereoLabelDoubleBond,
  stereoLabelDoubleBondAlgorithm,
  { fixingRule: false },
  []
);

RulesManager.createRule<StereoLabelTetrahedralCenterRuleConfig>(
  Rules.StereoLabelTetrahedralCenter,
  StereoLabelTetrahedralCenterRule,
  { fixingRule: false },
  []
);

RulesManager.createRule<CombinedStereoRuleConfig>(
  Rules.CombinedStereo,
  combinedStereoRuleAlgorithm,
  { fixingRule: false },
  []
);

RulesManager.createRule<UndefinedChiralCentersAlgorithmType>(
  Rules.UndefinedChiralCenters,
  undefinedChiralCentersAlgorithm,
  { fixingRule: false },
  []
);

// RulesManager.createRule<AddExplicitHydrogensRuleConfig>(
//   Rules.AddExplicitHydrogensRule,
//   AddExplicitHydrogensRule,
//   { fixingRule: false },
//   []
// );

// RulesManager.createRule<RemoveExplicitHydrogensRuleConfig>(
//   Rules.RemoveExplicitHydrogensRule,
//   RemoveExplicitHydrogensRule,
//   { fixingRule: false },
//   []
// );

// RulesManager.createRule<ValencePropertyRuleConfig>(
//   Rules.ValenceProperty,
//   ValencePropertyRule,
//   { fixingRule: false },
//   []
// );

// RulesManager.createRule<RemovingRadicalRuleConfig>(
//   Rules.RemovingRadical,
//   RemovingRadicalRule,
//   { fixingRule: false },
//   []
// );

// RulesManager.createRule<IncorrectIsotopeRuleConfig>(
//   Rules.IncorrectIsotope,
//   incorrectIsotopeAlgorithm,
//   { fixingRule: false },
//   []
// );

// RulesManager.createRule<TetrahedralStereoRuleConfig>(
//   Rules.TetrahedralStereo,
//   tetrahedralStereoAlgorithm,
//   { fixingRule: false },
//   []
// );

// RulesManager.createRule<QueryPropertiesRuleConfig>(Rules.QueryProperties, queryPropertiesAlgorithm, {}, []);

// RulesManager.createRule<AtomMappingRuleConfig>(Rules.AtomMapping, atomMappingAlgorithm, {}, []);

// RulesManager.createRule<RareElementsRuleConfig>(Rules.RareElements, rareElementsAlgorithm, { fixingRule: false }, []);

// RulesManager.createRule<QueryBondAlgorithmType>(Rules.QueryBond, queryBondAlgorithm, { fixingRule: false }, []);

// RulesManager.createRule<RingStrainsAlgorithmType>(Rules.RingStrains, ringStrainsAlgorithm, { fixingRule: false }, []);

// RulesManager.createRule<ChargedMoleculesRuleConfig>(
//   Rules.ChargedMolecules,
//   ChargedMoleculesRule,
//   { fixingRule: false },
//   []
// );

// RulesManager.createRule<WigglyDoubleBondRuleConfig>(
//   Rules.WigglyDoubleBond,
//   WigglyDoubleBondRule,
//   { fixingRule: false },
//   []
// );

// RulesManager.createRule<RemoveSolventRuleConfig>(Rules.RemoveSolvent, RemoveSolventRule, { fixingRule: false }, []);

// RulesManager.createRule<CrossedDoubleBondRuleConfig>(
//   Rules.CrossedDoubleBond,
//   CrossedDoubleBondRule,
//   { fixingRule: false },
//   []
// );

// DO NOT DELETE: this is how TypeScript knows how to look up your rule config by name.
declare module "@rules/infrastructure" {
  interface Registry {
    [Rules.Valence]: ValenceRuleConfig;
    [Rules.CovalentCounterion]: CovalentCounterionRuleConfig;
    [Rules.IncorrectCovalentBonds]: IncorrectCovalentBondsRuleConfig;
    [Rules.BondLength]: BondLengthRuleConfig;
    [Rules.TrippleBondAngle]: TrippleBondAngleRuleConfig;
    [Rules.Alias]: AliasRuleConfig;
    [Rules.Aromaticity]: AromaticityRuleConfig;
    [Rules.StraightDoubleBond]: StraightDoubleBondRuleConfig;
    [Rules.BondAngle]: BondAngleRuleConfig;
    [Rules.Overlapping]: OverlappingRuleConfig;
    [Rules.StereoLabelDoubleBond]: StereoLabelDoubleRuleConfig;
    [Rules.StereoLabelTetrahedralCenter]: StereoLabelTetrahedralCenterRuleConfig;
    [Rules.UndefinedChiralCenters]: UndefinedChiralCentersAlgorithmType;
    [Rules.CombinedStereo]: CombinedStereoRuleConfig;
    // [Rules.ValenceProperty]: ValencePropertyRuleConfig;
    // [Rules.RemovingRadical]: RemovingRadicalRuleConfig;
    // [Rules.IncorrectIsotope]: IncorrectIsotopeRuleConfig;
    // [Rules.TetrahedralStereo]: TetrahedralStereoRuleConfig;
    // [Rules.QueryProperties]: QueryPropertiesRuleConfig;
    // [Rules.AtomMapping]: AtomMappingRuleConfig;
    // [Rules.RareElements]: RareElementsRuleConfig;
    // [Rules.QueryBond]: QueryBondAlgorithmType;
    // [Rules.RingStrains]: RingStrainsAlgorithmType;
    // [Rules.ChargedMolecules]: ChargedMoleculesRuleConfig;
    // [Rules.WigglyDoubleBond]: WigglyDoubleBondRuleConfig;
    // [Rules.RemoveSolvent]: RemoveSolventRuleConfig;
    // [Rules.CrossedDoubleBond]: CrossedDoubleBondRuleConfig;
  }
}

export { RulesManager, type IRulesManager };
