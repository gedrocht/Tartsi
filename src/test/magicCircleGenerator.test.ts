import { describe, expect, it } from "vitest";
import {
  defaultMagicCircleGenerationOptions,
  generateMagicCircleDiagram
} from "../domain/magicCircleGenerator";
import {
  areLanguageSymbolsCompatible,
  languageSymbolDefinitionMap
} from "../domain/magicCircleLanguage";

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

      expect(currentLanguageSymbolDefinition).toBeDefined();
      expect(neighboringLanguageSymbolDefinition).toBeDefined();

      expect(
        areLanguageSymbolsCompatible(
          currentLanguageSymbolDefinition!,
          neighboringLanguageSymbolDefinition!,
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

  it("keeps tangential neighbors compatible within every ring", () => {
    expectAllNeighborsToBeCompatible();
  });
});
