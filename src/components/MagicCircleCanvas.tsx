import { useId, useRef } from "react";
import type { ApplicationLogger } from "../services/applicationLogger";
import type { MagicCircleDiagram, RenderableMagicCircleRing } from "../domain/magicCircleGenerator";
import { languageSymbolDefinitionMap } from "../domain/magicCircleLanguage";
import { SymbolGlyphRenderer } from "./SymbolGlyphRenderer";
import {
  convertPolarCoordinateToCartesianCoordinate,
  createCircleArcPath,
  createRegularPolygonPointList
} from "../utilities/svgGeometry";

export interface MagicCircleCanvasProperties {
  magicCircleDiagram: MagicCircleDiagram;
  applicationLogger: ApplicationLogger;
}

const canvasSizeLength = 1000;
const circleCenterCoordinate = canvasSizeLength / 2;

function renderRingGuides(
  renderableMagicCircleRing: RenderableMagicCircleRing,
  strokeColorValue: string,
  accentColorValue: string
) {
  const segmentAngleInDegrees = 360 / renderableMagicCircleRing.segmentCount;
  const innerRadiusLength =
    renderableMagicCircleRing.radiusLength - renderableMagicCircleRing.thicknessLength / 2;
  const outerRadiusLength =
    renderableMagicCircleRing.radiusLength + renderableMagicCircleRing.thicknessLength / 2;

  return (
    <g key={`ring-guide-${renderableMagicCircleRing.ringIndex}`}>
      <circle
        cx={circleCenterCoordinate}
        cy={circleCenterCoordinate}
        r={innerRadiusLength}
        fill="none"
        stroke={strokeColorValue}
        strokeOpacity={0.4}
        strokeWidth={1}
      />
      <circle
        cx={circleCenterCoordinate}
        cy={circleCenterCoordinate}
        r={outerRadiusLength}
        fill="none"
        stroke={accentColorValue}
        strokeOpacity={0.3}
        strokeWidth={1.5}
      />
      {Array.from({ length: renderableMagicCircleRing.segmentCount }, (_, segmentIndex) => {
        const rayAngleInDegrees = segmentIndex * segmentAngleInDegrees - 90;
        const innerCoordinate = convertPolarCoordinateToCartesianCoordinate(
          circleCenterCoordinate,
          circleCenterCoordinate,
          innerRadiusLength,
          rayAngleInDegrees
        );
        const outerCoordinate = convertPolarCoordinateToCartesianCoordinate(
          circleCenterCoordinate,
          circleCenterCoordinate,
          outerRadiusLength,
          rayAngleInDegrees
        );

        return (
          <line
            key={`ring-guide-ray-${renderableMagicCircleRing.ringIndex}-${segmentIndex}`}
            x1={innerCoordinate.xCoordinate}
            y1={innerCoordinate.yCoordinate}
            x2={outerCoordinate.xCoordinate}
            y2={outerCoordinate.yCoordinate}
            stroke={strokeColorValue}
            strokeOpacity={0.18}
            strokeWidth={1}
          />
        );
      })}
    </g>
  );
}

function renderRingSymbols(
  renderableMagicCircleRing: RenderableMagicCircleRing,
  strokeColorValue: string,
  accentColorValue: string
) {
  const segmentAngleInDegrees = 360 / renderableMagicCircleRing.segmentCount;

  return renderableMagicCircleRing.renderableCells.map((renderableMagicCircleCell) => {
    const symbolAngleInDegrees =
      renderableMagicCircleCell.segmentIndex * segmentAngleInDegrees +
      segmentAngleInDegrees / 2 -
      90;
    const symbolCenterCoordinate = convertPolarCoordinateToCartesianCoordinate(
      circleCenterCoordinate,
      circleCenterCoordinate,
      renderableMagicCircleRing.radiusLength,
      symbolAngleInDegrees
    );
    const symbolSizeLength = Math.max(renderableMagicCircleRing.thicknessLength * 0.5, 18);

    return (
      <g key={`ring-symbol-${renderableMagicCircleCell.ringIndex}-${renderableMagicCircleCell.segmentIndex}`}>
        <path
          d={createCircleArcPath(
            circleCenterCoordinate,
            circleCenterCoordinate,
            renderableMagicCircleRing.radiusLength,
            symbolAngleInDegrees - segmentAngleInDegrees * 0.36,
            symbolAngleInDegrees + segmentAngleInDegrees * 0.36
          )}
          fill="none"
          stroke={strokeColorValue}
          strokeOpacity={0.22}
          strokeWidth={1}
        />
        <SymbolGlyphRenderer
          geometryFamilyIdentifier={renderableMagicCircleCell.geometryFamilyIdentifier}
          centerXCoordinate={symbolCenterCoordinate.xCoordinate}
          centerYCoordinate={symbolCenterCoordinate.yCoordinate}
          symbolSizeLength={symbolSizeLength}
          rotationAngleInDegrees={symbolAngleInDegrees + 90}
          strokeColorValue={strokeColorValue}
          accentColorValue={accentColorValue}
          strokeWidthValue={2}
        />
      </g>
    );
  });
}

function downloadSvgMarkup(svgMarkupText: string): void {
  const downloadableBlob = new Blob([svgMarkupText], { type: "image/svg+xml;charset=utf-8" });
  const objectUrl = URL.createObjectURL(downloadableBlob);
  const temporaryAnchorElement = document.createElement("a");
  temporaryAnchorElement.href = objectUrl;
  temporaryAnchorElement.download = "tartsi-magic-circle.svg";
  temporaryAnchorElement.click();
  URL.revokeObjectURL(objectUrl);
}

/**
 * The canvas renderer converts the diagram domain model into a dramatic SVG scene.
 * SVG was chosen because it stays sharp at any size and can be exported without quality loss.
 */
export function MagicCircleCanvas({
  magicCircleDiagram,
  applicationLogger
}: MagicCircleCanvasProperties) {
  const gradientIdentifier = useId();
  const glowFilterIdentifier = useId();
  const magicCircleSvgElementReference = useRef<SVGSVGElement | null>(null);
  const centralLanguageSymbolDefinition = languageSymbolDefinitionMap.get(
    magicCircleDiagram.centralLanguageSymbolIdentifier
  );

  const handleExportButtonClick = () => {
    if (magicCircleSvgElementReference.current === null) {
      applicationLogger.warn("canvas", "The SVG export was requested before the canvas was ready.");
      return;
    }

    downloadSvgMarkup(magicCircleSvgElementReference.current.outerHTML);
    applicationLogger.info("canvas", "Exported the current magic circle as SVG.");
  };

  return (
    <section
      className="magic-circle-card"
      aria-labelledby="magic-circle-preview-title"
    >
      <div className="panel-header-row">
        <div>
          <p className="eyebrow-label">Generated sigil</p>
          <h2 id="magic-circle-preview-title">Magic circle preview</h2>
        </div>
        <button
          className="secondary-button"
          type="button"
          onClick={handleExportButtonClick}
        >
          Export SVG
        </button>
      </div>
      <svg
        ref={magicCircleSvgElementReference}
        className="magic-circle-svg"
        viewBox={`0 0 ${canvasSizeLength} ${canvasSizeLength}`}
        role="img"
        aria-label={`Magic circle generated from the seed ${magicCircleDiagram.seedPhrase}`}
      >
        <defs>
          <radialGradient id={gradientIdentifier}>
            <stop
              offset="0%"
              stopColor={magicCircleDiagram.selectedColorPalette.backgroundEndColorValue}
            />
            <stop
              offset="100%"
              stopColor={magicCircleDiagram.selectedColorPalette.backgroundStartColorValue}
            />
          </radialGradient>
          <filter id={glowFilterIdentifier}>
            <feGaussianBlur
              stdDeviation="5"
              result="blurred-stroke"
            />
            <feMerge>
              <feMergeNode in="blurred-stroke" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          x={0}
          y={0}
          width={canvasSizeLength}
          height={canvasSizeLength}
          fill={`url(#${gradientIdentifier})`}
          rx={44}
        />

        <g filter={`url(#${glowFilterIdentifier})`}>
          <polygon
            points={createRegularPolygonPointList(
              magicCircleDiagram.outerStarburstPointCount,
              470,
              circleCenterCoordinate,
              circleCenterCoordinate,
              -90
            )}
            fill="none"
            stroke={magicCircleDiagram.selectedColorPalette.glowColorValue}
            strokeOpacity={0.16}
            strokeWidth={2}
          />

          {magicCircleDiagram.rings.map((renderableMagicCircleRing) =>
            renderRingGuides(
              renderableMagicCircleRing,
              magicCircleDiagram.selectedColorPalette.strokeColorValue,
              magicCircleDiagram.selectedColorPalette.secondaryAccentColorValue
            )
          )}

          {magicCircleDiagram.rings.map((renderableMagicCircleRing) =>
            renderRingSymbols(
              renderableMagicCircleRing,
              magicCircleDiagram.selectedColorPalette.strokeColorValue,
              magicCircleDiagram.selectedColorPalette.accentColorValue
            )
          )}

          <circle
            cx={circleCenterCoordinate}
            cy={circleCenterCoordinate}
            r={74}
            fill="none"
            stroke={magicCircleDiagram.selectedColorPalette.strokeColorValue}
            strokeWidth={2}
          />
          <circle
            cx={circleCenterCoordinate}
            cy={circleCenterCoordinate}
            r={42}
            fill="none"
            stroke={magicCircleDiagram.selectedColorPalette.secondaryAccentColorValue}
            strokeWidth={2}
          />
          <SymbolGlyphRenderer
            geometryFamilyIdentifier={
              centralLanguageSymbolDefinition?.geometryFamilyIdentifier ?? "sunburst"
            }
            centerXCoordinate={circleCenterCoordinate}
            centerYCoordinate={circleCenterCoordinate}
            symbolSizeLength={92}
            rotationAngleInDegrees={0}
            strokeColorValue={magicCircleDiagram.selectedColorPalette.strokeColorValue}
            accentColorValue={magicCircleDiagram.selectedColorPalette.accentColorValue}
            strokeWidthValue={3}
          />
        </g>
      </svg>
      <p className="supporting-text">
        Generated from seed <strong>{magicCircleDiagram.seedPhrase}</strong> with{" "}
        {magicCircleDiagram.rings.length} rings and {magicCircleDiagram.symmetrySectorCount} symmetry sectors.
      </p>
    </section>
  );
}
