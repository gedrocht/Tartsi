import type { SVGProps } from "react";
import { createCircleArcPath, createRegularPolygonPointList } from "../utilities/svgGeometry";
import type { GeometryFamilyIdentifier } from "../domain/magicCircleLanguage";

export interface SymbolGlyphRendererProperties {
  geometryFamilyIdentifier: GeometryFamilyIdentifier;
  centerXCoordinate: number;
  centerYCoordinate: number;
  symbolSizeLength: number;
  rotationAngleInDegrees: number;
  strokeColorValue: string;
  accentColorValue: string;
  strokeWidthValue: number;
}

function createSharedGroupProperties(
  centerXCoordinate: number,
  centerYCoordinate: number,
  rotationAngleInDegrees: number
): SVGProps<SVGGElement> {
  return {
    transform: `translate(${centerXCoordinate} ${centerYCoordinate}) rotate(${rotationAngleInDegrees})`
  };
}

/**
 * This renderer translates high-level symbol families into small reusable SVG compositions.
 * The rest of the application never needs to know how a chevron or spiral is drawn.
 */
export function SymbolGlyphRenderer({
  geometryFamilyIdentifier,
  centerXCoordinate,
  centerYCoordinate,
  symbolSizeLength,
  rotationAngleInDegrees,
  strokeColorValue,
  accentColorValue,
  strokeWidthValue
}: SymbolGlyphRendererProperties) {
  const halfSymbolSizeLength = symbolSizeLength / 2;
  const thirdSymbolSizeLength = symbolSizeLength / 3;
  const groupProperties = createSharedGroupProperties(
    centerXCoordinate,
    centerYCoordinate,
    rotationAngleInDegrees
  );

  switch (geometryFamilyIdentifier) {
    case "triangle":
      return (
        <g {...groupProperties}>
          <polygon
            points={createRegularPolygonPointList(3, halfSymbolSizeLength, 0, 0, -90)}
            fill="none"
            stroke={strokeColorValue}
            strokeWidth={strokeWidthValue}
          />
        </g>
      );
    case "square":
      return (
        <g {...groupProperties}>
          <rect
            x={-halfSymbolSizeLength}
            y={-halfSymbolSizeLength}
            width={symbolSizeLength}
            height={symbolSizeLength}
            fill="none"
            stroke={strokeColorValue}
            strokeWidth={strokeWidthValue}
          />
          <circle
            cx={0}
            cy={0}
            r={thirdSymbolSizeLength}
            fill="none"
            stroke={accentColorValue}
            strokeWidth={strokeWidthValue * 0.75}
          />
        </g>
      );
    case "diamond":
      return (
        <g {...groupProperties}>
          <polygon
            points={createRegularPolygonPointList(4, halfSymbolSizeLength, 0, 0, 45)}
            fill="none"
            stroke={strokeColorValue}
            strokeWidth={strokeWidthValue}
          />
          <path
            d={`M ${-thirdSymbolSizeLength} 0 L 0 ${-thirdSymbolSizeLength} L ${thirdSymbolSizeLength} 0 L 0 ${thirdSymbolSizeLength} Z`}
            fill="none"
            stroke={accentColorValue}
            strokeWidth={strokeWidthValue * 0.8}
          />
        </g>
      );
    case "hexagon":
      return (
        <g {...groupProperties}>
          <polygon
            points={createRegularPolygonPointList(6, halfSymbolSizeLength, 0, 0, 30)}
            fill="none"
            stroke={strokeColorValue}
            strokeWidth={strokeWidthValue}
          />
          <polygon
            points={createRegularPolygonPointList(6, thirdSymbolSizeLength, 0, 0, 30)}
            fill="none"
            stroke={accentColorValue}
            strokeWidth={strokeWidthValue * 0.7}
          />
        </g>
      );
    case "sunburst":
      return (
        <g {...groupProperties}>
          <circle
            cx={0}
            cy={0}
            r={thirdSymbolSizeLength}
            fill="none"
            stroke={strokeColorValue}
            strokeWidth={strokeWidthValue}
          />
          {Array.from({ length: 8 }, (_, spokeIndex) => (
            <line
              key={spokeIndex}
              x1={0}
              y1={-thirdSymbolSizeLength}
              x2={0}
              y2={-halfSymbolSizeLength}
              stroke={accentColorValue}
              strokeWidth={strokeWidthValue * 0.75}
              transform={`rotate(${spokeIndex * 45})`}
            />
          ))}
        </g>
      );
    case "wave":
      return (
        <g {...groupProperties}>
          <path
            d={`M ${-halfSymbolSizeLength} 0 Q ${-thirdSymbolSizeLength} ${-thirdSymbolSizeLength} 0 0 T ${halfSymbolSizeLength} 0`}
            fill="none"
            stroke={strokeColorValue}
            strokeWidth={strokeWidthValue}
          />
          <path
            d={createCircleArcPath(0, 0, thirdSymbolSizeLength, 200, 340)}
            fill="none"
            stroke={accentColorValue}
            strokeWidth={strokeWidthValue * 0.75}
          />
        </g>
      );
    case "orbit":
      return (
        <g {...groupProperties}>
          <circle
            cx={0}
            cy={0}
            r={thirdSymbolSizeLength}
            fill="none"
            stroke={strokeColorValue}
            strokeWidth={strokeWidthValue}
          />
          {Array.from({ length: 4 }, (_, orbitalDotIndex) => (
            <circle
              key={orbitalDotIndex}
              cx={Math.cos((orbitalDotIndex * Math.PI) / 2) * halfSymbolSizeLength}
              cy={Math.sin((orbitalDotIndex * Math.PI) / 2) * halfSymbolSizeLength}
              r={strokeWidthValue}
              fill={accentColorValue}
            />
          ))}
        </g>
      );
    case "petal":
      return (
        <g {...groupProperties}>
          {Array.from({ length: 4 }, (_, petalIndex) => (
            <path
              key={petalIndex}
              d={`M 0 0 C ${thirdSymbolSizeLength} ${-thirdSymbolSizeLength}, ${thirdSymbolSizeLength} ${-halfSymbolSizeLength}, 0 ${-halfSymbolSizeLength} C ${-thirdSymbolSizeLength} ${-halfSymbolSizeLength}, ${-thirdSymbolSizeLength} ${-thirdSymbolSizeLength}, 0 0`}
              fill="none"
              stroke={strokeColorValue}
              strokeWidth={strokeWidthValue}
              transform={`rotate(${petalIndex * 90})`}
            />
          ))}
        </g>
      );
    case "chevron":
      return (
        <g {...groupProperties}>
          <polyline
            points={`${-halfSymbolSizeLength},${-thirdSymbolSizeLength} 0,${thirdSymbolSizeLength} ${halfSymbolSizeLength},${-thirdSymbolSizeLength}`}
            fill="none"
            stroke={strokeColorValue}
            strokeWidth={strokeWidthValue}
          />
          <polyline
            points={`${-thirdSymbolSizeLength},0 0,${halfSymbolSizeLength} ${thirdSymbolSizeLength},0`}
            fill="none"
            stroke={accentColorValue}
            strokeWidth={strokeWidthValue * 0.8}
          />
        </g>
      );
    case "spiral":
      return (
        <g {...groupProperties}>
          <path
            d={`M 0 0 C ${thirdSymbolSizeLength} ${-thirdSymbolSizeLength}, ${halfSymbolSizeLength} 0, ${thirdSymbolSizeLength} ${thirdSymbolSizeLength} C 0 ${halfSymbolSizeLength}, ${-thirdSymbolSizeLength} ${thirdSymbolSizeLength}, ${-thirdSymbolSizeLength} 0`}
            fill="none"
            stroke={strokeColorValue}
            strokeWidth={strokeWidthValue}
          />
          <circle
            cx={-thirdSymbolSizeLength}
            cy={0}
            r={strokeWidthValue}
            fill={accentColorValue}
          />
        </g>
      );
    default:
      return null;
  }
}
