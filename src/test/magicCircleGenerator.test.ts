import { describe, expect, it, vi } from "vitest";
import {
  colorPaletteLibrary,
  defaultMagicCircleGenerationOptions,
  generateMagicCircleDiagram
} from "../domain/magicCircleGenerator";
import {
  areLanguageSymbolsCompatible,
  languageSymbolDefinitionMap
} from "../domain/magicCircleLanguage";
import { ApplicationLogger } from "../services/applicationLogger";

function expectAllNeighborsToBeCompatible() {
  const generatedMagicCircleDiagram = generateMagicCircleDiagram({
    ...defaultMagicCircleGenerationOptions,
    seedPhrase: "Compatibility-Inspection-Seed"
  });

  for (const renderableMagicCircleRing of generatedMagicCircleDiagram.rings) {
    for (const renderableMagicCircleCell of renderableMagicCircleRing.renderableCells) {
      const nextCellIndex =
        (renderableMagicCircleCell.segmentIndex + 1) %
        renderableMagicCircleRing.renderableCells.length;
      const neighboringRenderableMagicCircleCell =
        renderableMagicCircleRing.renderableCells[nextCellIndex];

      if (neighboringRenderableMagicCircleCell === undefined) {
        continue;
      }

      const currentLanguageSymbolDefinition = languageSymbolDefinitionMap.get(
        renderableMagicCircleCell.languageSymbolIdentifier
      );
      const neighboringLanguageSymbolDefinition = languageSymbolDefinitionMap.get(
        neighboringRenderableMagicCircleCell.languageSymbolIdentifier
      );

      if (
        currentLanguageSymbolDefinition === undefined ||
        neighboringLanguageSymbolDefinition === undefined
      ) {
        throw new Error("Expected generated cells to reference known language symbols.");
      }

      expect(
        areLanguageSymbolsCompatible(
          currentLanguageSymbolDefinition,
          neighboringLanguageSymbolDefinition,
          "tangential"
        )
      ).toBe(true);
    }
  }
}

describe("generateMagicCircleDiagram", () => {
  it("creates deterministic output for a repeated seed phrase", () => {
    const firstMagicCircleDiagram = generateMagicCircleDiagram({
      ...defaultMagicCircleGenerationOptions,
      seedPhrase: "Deterministic-Seed"
    });
    const secondMagicCircleDiagram = generateMagicCircleDiagram({
      ...defaultMagicCircleGenerationOptions,
      seedPhrase: "Deterministic-Seed"
    });

    expect(firstMagicCircleDiagram.rings).toEqual(secondMagicCircleDiagram.rings);
    expect(firstMagicCircleDiagram.centralLanguageSymbolIdentifier).toBe(
      secondMagicCircleDiagram.centralLanguageSymbolIdentifier
    );
    expect(firstMagicCircleDiagram.outerStarburstPointCount).toBe(
      secondMagicCircleDiagram.outerStarburstPointCount
    );
  });

  it("creates the requested number of rings", () => {
    const generatedMagicCircleDiagram = generateMagicCircleDiagram({
      ...defaultMagicCircleGenerationOptions,
      ringCount: 6
    });

    expect(generatedMagicCircleDiagram.rings).toHaveLength(6);
  });

  it("falls back to the default palette when the requested palette is unknown", () => {
    const applicationLogger = new ApplicationLogger();
    const infoSpy = vi.spyOn(applicationLogger, "info").mockImplementation(() => undefined);
    const defaultColorPaletteIdentifier = colorPaletteLibrary[0]?.identifier ?? "solar-gold";
    const generatedMagicCircleDiagram = generateMagicCircleDiagram(
      {
        ...defaultMagicCircleGenerationOptions,
        selectedColorPaletteIdentifier: "non-existent-palette"
      },
      applicationLogger
    );

    expect(generatedMagicCircleDiagram.selectedColorPalette.identifier).toBe(
      defaultColorPaletteIdentifier
    );
    expect(infoSpy).toHaveBeenCalled();
  });

  it("keeps tangential neighbors compatible within every ring", () => {
    expectAllNeighborsToBeCompatible();
  });
});
