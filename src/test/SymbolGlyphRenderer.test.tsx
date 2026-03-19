import { render } from "@testing-library/react";
import { SymbolGlyphRenderer } from "../components/SymbolGlyphRenderer";

describe("SymbolGlyphRenderer", () => {
  it("returns no SVG content when an unknown geometry family is supplied", () => {
    const { container } = render(
      <svg>
        <SymbolGlyphRenderer
          geometryFamilyIdentifier={"unknown-geometry-family" as never}
          centerXCoordinate={100}
          centerYCoordinate={100}
          symbolSizeLength={40}
          rotationAngleInDegrees={0}
          strokeColorValue="#ffffff"
          accentColorValue="#ffd700"
          strokeWidthValue={2}
        />
      </svg>
    );

    expect(container.querySelector("g")).toBeNull();
  });
});
