/**
 * This module defines the visual "alphabet" that our generator can arrange.
 * Each symbol definition carries descriptive traits instead of low-level drawing commands.
 * The wave-function-collapse engine reads those traits to decide which symbols are allowed
 * to sit next to one another in the same ring or across neighboring rings.
 */

export type RingRoleIdentifier =
  | "core"
  | "inner-harmonic"
  | "middle-translation"
  | "outer-ward"
  | "halo";

export type GeometryFamilyIdentifier =
  | "triangle"
  | "square"
  | "diamond"
  | "hexagon"
  | "sunburst"
  | "wave"
  | "orbit"
  | "petal"
  | "chevron"
  | "spiral";

export type LineCharacterIdentifier = "angular" | "balanced" | "curved";
export type PatternDensityIdentifier = "sparse" | "moderate" | "dense";
export type MotionFamilyIdentifier = "stable" | "radiant" | "orbital" | "flowing";
export type DirectionalRelationshipIdentifier = "tangential" | "radial";

export interface LanguageSymbolDefinition {
  identifier: string;
  displayName: string;
  summaryDescription: string;
  geometryFamilyIdentifier: GeometryFamilyIdentifier;
  lineCharacterIdentifier: LineCharacterIdentifier;
  patternDensityIdentifier: PatternDensityIdentifier;
  motionFamilyIdentifier: MotionFamilyIdentifier;
  preferredRingRoleIdentifiers: readonly RingRoleIdentifier[];
  strokeWeightMultiplier: number;
}

export const allLanguageSymbolDefinitions: readonly LanguageSymbolDefinition[] = [
  {
    identifier: "equilateral-triangle",
    displayName: "Equilateral Triangle",
    summaryDescription:
      "A stable triangular marker that signals focus and directional intent.",
    geometryFamilyIdentifier: "triangle",
    lineCharacterIdentifier: "angular",
    patternDensityIdentifier: "sparse",
    motionFamilyIdentifier: "stable",
    preferredRingRoleIdentifiers: ["core", "inner-harmonic", "middle-translation"],
    strokeWeightMultiplier: 1.05
  },
  {
    identifier: "square-frame",
    displayName: "Square Frame",
    summaryDescription:
      "A grounding square that behaves like a supportive architectural brace.",
    geometryFamilyIdentifier: "square",
    lineCharacterIdentifier: "balanced",
    patternDensityIdentifier: "moderate",
    motionFamilyIdentifier: "stable",
    preferredRingRoleIdentifiers: ["inner-harmonic", "middle-translation", "outer-ward"],
    strokeWeightMultiplier: 1
  },
  {
    identifier: "diamond-knot",
    displayName: "Diamond Knot",
    summaryDescription:
      "A rotated rhombus that creates a feeling of locked alignment between layers.",
    geometryFamilyIdentifier: "diamond",
    lineCharacterIdentifier: "angular",
    patternDensityIdentifier: "moderate",
    motionFamilyIdentifier: "radiant",
    preferredRingRoleIdentifiers: ["inner-harmonic", "middle-translation", "outer-ward"],
    strokeWeightMultiplier: 0.95
  },
  {
    identifier: "hexagonal-lattice",
    displayName: "Hexagonal Lattice",
    summaryDescription:
      "A dense six-sided cell that makes the outer rings feel engineered and defensive.",
    geometryFamilyIdentifier: "hexagon",
    lineCharacterIdentifier: "balanced",
    patternDensityIdentifier: "dense",
    motionFamilyIdentifier: "stable",
    preferredRingRoleIdentifiers: ["middle-translation", "outer-ward", "halo"],
    strokeWeightMultiplier: 0.9
  },
  {
    identifier: "sunburst-spokes",
    displayName: "Sunburst Spokes",
    summaryDescription:
      "A radiant emblem whose short beams push energy outward from the center.",
    geometryFamilyIdentifier: "sunburst",
    lineCharacterIdentifier: "balanced",
    patternDensityIdentifier: "moderate",
    motionFamilyIdentifier: "radiant",
    preferredRingRoleIdentifiers: ["core", "inner-harmonic", "halo"],
    strokeWeightMultiplier: 1.15
  },
  {
    identifier: "crescent-wave",
    displayName: "Crescent Wave",
    summaryDescription: "A flowing arc motif that softens neighboring sharp symbols.",
    geometryFamilyIdentifier: "wave",
    lineCharacterIdentifier: "curved",
    patternDensityIdentifier: "moderate",
    motionFamilyIdentifier: "flowing",
    preferredRingRoleIdentifiers: ["inner-harmonic", "middle-translation", "halo"],
    strokeWeightMultiplier: 0.9
  },
  {
    identifier: "orbital-dots",
    displayName: "Orbital Dots",
    summaryDescription:
      "A dotted orbital sign that implies circulation and measured motion.",
    geometryFamilyIdentifier: "orbit",
    lineCharacterIdentifier: "curved",
    patternDensityIdentifier: "dense",
    motionFamilyIdentifier: "orbital",
    preferredRingRoleIdentifiers: ["core", "inner-harmonic", "outer-ward", "halo"],
    strokeWeightMultiplier: 0.85
  },
  {
    identifier: "petal-arc",
    displayName: "Petal Arc",
    summaryDescription:
      "A ceremonial petal curve that gives the circle a softer sacred rhythm.",
    geometryFamilyIdentifier: "petal",
    lineCharacterIdentifier: "curved",
    patternDensityIdentifier: "moderate",
    motionFamilyIdentifier: "flowing",
    preferredRingRoleIdentifiers: ["core", "inner-harmonic", "middle-translation"],
    strokeWeightMultiplier: 1
  },
  {
    identifier: "chevron-ward",
    displayName: "Chevron Ward",
    summaryDescription:
      "A directional chevron that strengthens the impression of a protective boundary.",
    geometryFamilyIdentifier: "chevron",
    lineCharacterIdentifier: "angular",
    patternDensityIdentifier: "moderate",
    motionFamilyIdentifier: "radiant",
    preferredRingRoleIdentifiers: ["middle-translation", "outer-ward", "halo"],
    strokeWeightMultiplier: 0.95
  },
  {
    identifier: "spiral-hook",
    displayName: "Spiral Hook",
    summaryDescription:
      "A hooked spiral that introduces a slightly mysterious orbiting pull.",
    geometryFamilyIdentifier: "spiral",
    lineCharacterIdentifier: "curved",
    patternDensityIdentifier: "sparse",
    motionFamilyIdentifier: "orbital",
    preferredRingRoleIdentifiers: ["core", "inner-harmonic", "halo"],
    strokeWeightMultiplier: 0.9
  }
] as const;

const patternDensityScoreByIdentifier: Record<PatternDensityIdentifier, number> = {
  sparse: 1,
  moderate: 2,
  dense: 3
};

function calculateTangentialCompatibilityScore(
  firstLanguageSymbolDefinition: LanguageSymbolDefinition,
  secondLanguageSymbolDefinition: LanguageSymbolDefinition
): number {
  let compatibilityScore = 0;

  if (
    firstLanguageSymbolDefinition.lineCharacterIdentifier ===
    secondLanguageSymbolDefinition.lineCharacterIdentifier
  ) {
    compatibilityScore += 3;
  }

  if (
    firstLanguageSymbolDefinition.lineCharacterIdentifier === "balanced" ||
    secondLanguageSymbolDefinition.lineCharacterIdentifier === "balanced"
  ) {
    compatibilityScore += 2;
  }

  if (
    Math.abs(
      patternDensityScoreByIdentifier[firstLanguageSymbolDefinition.patternDensityIdentifier] -
        patternDensityScoreByIdentifier[secondLanguageSymbolDefinition.patternDensityIdentifier]
    ) <= 1
  ) {
    compatibilityScore += 2;
  }

  if (
    firstLanguageSymbolDefinition.geometryFamilyIdentifier !==
    secondLanguageSymbolDefinition.geometryFamilyIdentifier
  ) {
    compatibilityScore += 1;
  }

  return compatibilityScore;
}

function calculateRadialCompatibilityScore(
  firstLanguageSymbolDefinition: LanguageSymbolDefinition,
  secondLanguageSymbolDefinition: LanguageSymbolDefinition
): number {
  let compatibilityScore = 0;

  if (
    firstLanguageSymbolDefinition.geometryFamilyIdentifier !==
    secondLanguageSymbolDefinition.geometryFamilyIdentifier
  ) {
    compatibilityScore += 3;
  }

  if (
    firstLanguageSymbolDefinition.motionFamilyIdentifier !==
    secondLanguageSymbolDefinition.motionFamilyIdentifier
  ) {
    compatibilityScore += 2;
  }

  if (
    firstLanguageSymbolDefinition.lineCharacterIdentifier === "balanced" ||
    secondLanguageSymbolDefinition.lineCharacterIdentifier === "balanced"
  ) {
    compatibilityScore += 1;
  }

  if (
    Math.abs(
      patternDensityScoreByIdentifier[firstLanguageSymbolDefinition.patternDensityIdentifier] -
        patternDensityScoreByIdentifier[secondLanguageSymbolDefinition.patternDensityIdentifier]
    ) <= 1
  ) {
    compatibilityScore += 1;
  }

  return compatibilityScore;
}

export function areLanguageSymbolsCompatible(
  firstLanguageSymbolDefinition: LanguageSymbolDefinition,
  secondLanguageSymbolDefinition: LanguageSymbolDefinition,
  directionalRelationshipIdentifier: DirectionalRelationshipIdentifier
): boolean {
  const compatibilityScore =
    directionalRelationshipIdentifier === "tangential"
      ? calculateTangentialCompatibilityScore(
          firstLanguageSymbolDefinition,
          secondLanguageSymbolDefinition
        )
      : calculateRadialCompatibilityScore(
          firstLanguageSymbolDefinition,
          secondLanguageSymbolDefinition
        );

  return compatibilityScore >= 4;
}

export function getRingRoleIdentifier(
  ringIndex: number,
  totalRingCount: number
): RingRoleIdentifier {
  if (ringIndex === 0) {
    return "core";
  }

  if (ringIndex === totalRingCount - 1) {
    return "halo";
  }

  const relativeRingProgress = ringIndex / Math.max(totalRingCount - 1, 1);

  if (relativeRingProgress < 0.34) {
    return "inner-harmonic";
  }

  if (relativeRingProgress < 0.67) {
    return "middle-translation";
  }

  return "outer-ward";
}

export function filterLanguageSymbolsForRingRole(
  ringRoleIdentifier: RingRoleIdentifier
): readonly LanguageSymbolDefinition[] {
  return allLanguageSymbolDefinitions.filter((languageSymbolDefinition) =>
    languageSymbolDefinition.preferredRingRoleIdentifiers.includes(ringRoleIdentifier)
  );
}

export const languageSymbolDefinitionMap = new Map(
  allLanguageSymbolDefinitions.map((languageSymbolDefinition) => [
    languageSymbolDefinition.identifier,
    languageSymbolDefinition
  ])
);
