import { languageSymbolDefinitionMap, type GeometryFamilyIdentifier, type RingRoleIdentifier } from "./magicCircleLanguage";
import {
  collapseMagicCircleLanguageAcrossRings,
  createRingBlueprintsFromSegmentCounts,
  type CollapsedMagicCircleCell,
  type CollapsedMagicCircleRing
} from "./waveFunctionCollapseEngine";
import { createSeededRandomNumberGenerator, type SeededRandomNumberGenerator } from "../utilities/seededRandomNumberGenerator";
import type { ApplicationLogger } from "../services/applicationLogger";

export interface ColorPaletteDefinition {
  identifier: string;
  displayName: string;
  backgroundStartColorValue: string;
  backgroundEndColorValue: string;
  strokeColorValue: string;
  glowColorValue: string;
  accentColorValue: string;
  secondaryAccentColorValue: string;
}

export interface MagicCircleGenerationOptions {
  seedPhrase: string;
  ringCount: number;
  baseSegmentCount: number;
  symmetrySectorCount: number;
  complexityLevel: number;
  selectedColorPaletteIdentifier: string;
}

export interface RenderableMagicCircleCell extends CollapsedMagicCircleCell {
  geometryFamilyIdentifier: GeometryFamilyIdentifier;
  ringRoleIdentifier: RingRoleIdentifier;
}

export interface RenderableMagicCircleRing extends CollapsedMagicCircleRing {
  radiusLength: number;
  thicknessLength: number;
  renderableCells: RenderableMagicCircleCell[];
}

export interface MagicCircleDiagram {
  seedPhrase: string;
  generatedAtIsoString: string;
  symmetrySectorCount: number;
  selectedColorPalette: ColorPaletteDefinition;
  rings: RenderableMagicCircleRing[];
  centralLanguageSymbolIdentifier: string;
  outerStarburstPointCount: number;
  solverRestartCount: number;
}

const defaultRingCount = 5;
const defaultBaseSegmentCount = 12;
const defaultSymmetrySectorCount = 4;
const defaultComplexityLevel = 3;
const magicCircleCanvasRadiusLength = 420;
const ringThicknessScalingFactor = 0.8;

/**
 * These palettes were chosen to echo the mood of mystical alchemical diagrams while still
 * remaining original. Each palette includes both high-contrast stroke colors and softer
 * accent colors for glows and fills.
 */
export const colorPaletteLibrary: readonly ColorPaletteDefinition[] = [
  {
    identifier: "solar-gold",
    displayName: "Solar Gold",
    backgroundStartColorValue: "#050813",
    backgroundEndColorValue: "#12061f",
    strokeColorValue: "#f8f1ba",
    glowColorValue: "#f2b84f",
    accentColorValue: "#ffdd79",
    secondaryAccentColorValue: "#6de7ff"
  },
  {
    identifier: "astral-cyan",
    displayName: "Astral Cyan",
    backgroundStartColorValue: "#04131a",
    backgroundEndColorValue: "#170f28",
    strokeColorValue: "#d7f9ff",
    glowColorValue: "#47d4ff",
    accentColorValue: "#90f1ff",
    secondaryAccentColorValue: "#ffd580"
  },
  {
    identifier: "ember-vermilion",
    displayName: "Ember Vermilion",
    backgroundStartColorValue: "#100506",
    backgroundEndColorValue: "#241115",
    strokeColorValue: "#ffe8c7",
    glowColorValue: "#ff7f50",
    accentColorValue: "#ffb26b",
    secondaryAccentColorValue: "#ffc7d1"
  }
] as const;

function getDefaultColorPaletteDefinition(): ColorPaletteDefinition {
  const defaultColorPaletteDefinition = colorPaletteLibrary[0];

  if (defaultColorPaletteDefinition === undefined) {
    throw new Error("The color palette library must contain at least one palette.");
  }

  return defaultColorPaletteDefinition;
}

export const defaultMagicCircleGenerationOptions: MagicCircleGenerationOptions = {
  seedPhrase: "Tartsi-First-Sigil",
  ringCount: defaultRingCount,
  baseSegmentCount: defaultBaseSegmentCount,
  symmetrySectorCount: defaultSymmetrySectorCount,
  complexityLevel: defaultComplexityLevel,
  selectedColorPaletteIdentifier: getDefaultColorPaletteDefinition().identifier
};

function getColorPaletteByIdentifier(selectedColorPaletteIdentifier: string): ColorPaletteDefinition {
  return (
    colorPaletteLibrary.find(
      (colorPaletteDefinition) =>
        colorPaletteDefinition.identifier === selectedColorPaletteIdentifier
    ) ?? getDefaultColorPaletteDefinition()
  );
}

function calculateSegmentCountsForRings(
  ringCount: number,
  baseSegmentCount: number,
  complexityLevel: number,
  symmetrySectorCount: number
): number[] {
  return Array.from({ length: ringCount }, (_, ringIndex) => {
    const complexityBonusSegmentCount = complexityLevel * 2;
    const expandingSegmentCount = baseSegmentCount + ringIndex * complexityBonusSegmentCount;
    const symmetryAlignedSegmentCount =
      Math.ceil(expandingSegmentCount / symmetrySectorCount) * symmetrySectorCount;

    return Math.max(symmetryAlignedSegmentCount, symmetrySectorCount);
  });
}

function calculateRingThicknessLengths(ringCount: number): number[] {
  const baseRingThicknessLength =
    magicCircleCanvasRadiusLength / (ringCount + ringThicknessScalingFactor);

  return Array.from({ length: ringCount }, () => baseRingThicknessLength);
}

function convertCollapsedRingsToRenderableRings(
  collapsedRings: readonly CollapsedMagicCircleRing[],
  ringThicknessLengths: readonly number[]
): RenderableMagicCircleRing[] {
  return collapsedRings.map((collapsedRing, ringIndex) => {
    const radiusLength = ringThicknessLengths
      .slice(0, ringIndex + 1)
      .reduce(
        (accumulatedRadiusLength, ringThicknessLength) =>
          accumulatedRadiusLength + ringThicknessLength,
        60
      );
    const thicknessLength = ringThicknessLengths[ringIndex] ?? ringThicknessLengths[0] ?? 72;

    return {
      ...collapsedRing,
      radiusLength,
      thicknessLength,
      renderableCells: collapsedRing.collapsedCells.map((collapsedCell) => {
        const languageSymbolDefinition = languageSymbolDefinitionMap.get(
          collapsedCell.languageSymbolIdentifier
        );

        if (languageSymbolDefinition === undefined) {
          throw new Error("A collapsed cell referenced an unknown language symbol.");
        }

        return {
          ...collapsedCell,
          geometryFamilyIdentifier: languageSymbolDefinition.geometryFamilyIdentifier,
          ringRoleIdentifier: collapsedRing.ringRoleIdentifier
        };
      })
    };
  });
}

function chooseCentralLanguageSymbolIdentifier(
  seededRandomNumberGenerator: SeededRandomNumberGenerator
): string {
  const centralLanguageSymbolIdentifiers = [
    "sunburst-spokes",
    "equilateral-triangle",
    "petal-arc",
    "spiral-hook"
  ];

  return seededRandomNumberGenerator.pickOne(centralLanguageSymbolIdentifiers);
}

/**
 * This is the main domain entry point used by the React application.
 * It prepares deterministic randomness, constructs the ring plan, solves the symbol layout,
 * and enriches the result with rendering-specific metadata.
 *
 * @example
 * ```ts
 * const diagram = generateMagicCircleDiagram(defaultMagicCircleGenerationOptions);
 * ```
 */
export function generateMagicCircleDiagram(
  magicCircleGenerationOptions: MagicCircleGenerationOptions,
  applicationLogger?: ApplicationLogger
): MagicCircleDiagram {
  applicationLogger?.info("generator", "Starting magic circle generation.", {
    magicCircleGenerationOptions
  });

  const seededRandomNumberGenerator = createSeededRandomNumberGenerator(
    magicCircleGenerationOptions.seedPhrase
  );
  const segmentCountsForRings = calculateSegmentCountsForRings(
    magicCircleGenerationOptions.ringCount,
    magicCircleGenerationOptions.baseSegmentCount,
    magicCircleGenerationOptions.complexityLevel,
    magicCircleGenerationOptions.symmetrySectorCount
  );
  const ringBlueprints = createRingBlueprintsFromSegmentCounts(segmentCountsForRings);
  const waveFunctionCollapseResult = collapseMagicCircleLanguageAcrossRings(
    ringBlueprints,
    magicCircleGenerationOptions.symmetrySectorCount,
    seededRandomNumberGenerator
  );
  const ringThicknessLengths = calculateRingThicknessLengths(magicCircleGenerationOptions.ringCount);
  const renderableRings = convertCollapsedRingsToRenderableRings(
    waveFunctionCollapseResult.collapsedRings,
    ringThicknessLengths
  );
  const selectedColorPalette = getColorPaletteByIdentifier(
    magicCircleGenerationOptions.selectedColorPaletteIdentifier
  );
  const centralLanguageSymbolIdentifier = chooseCentralLanguageSymbolIdentifier(
    seededRandomNumberGenerator
  );
  const outerStarburstPointCount =
    (magicCircleGenerationOptions.baseSegmentCount + magicCircleGenerationOptions.complexityLevel) * 2;

  applicationLogger?.info("generator", "Finished magic circle generation.", {
    restartCount: waveFunctionCollapseResult.restartCount,
    segmentCountsForRings
  });

  return {
    seedPhrase: magicCircleGenerationOptions.seedPhrase,
    generatedAtIsoString: new Date().toISOString(),
    symmetrySectorCount: magicCircleGenerationOptions.symmetrySectorCount,
    selectedColorPalette,
    rings: renderableRings,
    centralLanguageSymbolIdentifier,
    outerStarburstPointCount,
    solverRestartCount: waveFunctionCollapseResult.restartCount
  };
}
