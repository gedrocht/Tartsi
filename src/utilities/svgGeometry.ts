/**
 * These geometry helpers keep the rendering component easier to read by giving names to the
 * small mathematical operations needed to place symbols around a circle.
 */

export interface CartesianCoordinate {
  xCoordinate: number;
  yCoordinate: number;
}

const degreesToRadiansConversionFactor = Math.PI / 180;

export function convertPolarCoordinateToCartesianCoordinate(
  circleCenterXCoordinate: number,
  circleCenterYCoordinate: number,
  radiusLength: number,
  angleInDegrees: number
): CartesianCoordinate {
  const angleInRadians = angleInDegrees * degreesToRadiansConversionFactor;

  return {
    xCoordinate: circleCenterXCoordinate + radiusLength * Math.cos(angleInRadians),
    yCoordinate: circleCenterYCoordinate + radiusLength * Math.sin(angleInRadians)
  };
}

export function createRegularPolygonPointList(
  pointCount: number,
  polygonRadiusLength: number,
  centerXCoordinate: number,
  centerYCoordinate: number,
  startingAngleInDegrees: number
): string {
  const polygonPointList = Array.from({ length: pointCount }, (_, pointIndex) => {
    const angleInDegrees = startingAngleInDegrees + (360 / pointCount) * pointIndex;
    const polygonPointCoordinate = convertPolarCoordinateToCartesianCoordinate(
      centerXCoordinate,
      centerYCoordinate,
      polygonRadiusLength,
      angleInDegrees
    );

    return `${polygonPointCoordinate.xCoordinate},${polygonPointCoordinate.yCoordinate}`;
  });

  return polygonPointList.join(" ");
}

export function createCircleArcPath(
  centerXCoordinate: number,
  centerYCoordinate: number,
  radiusLength: number,
  startingAngleInDegrees: number,
  endingAngleInDegrees: number
): string {
  const startingCoordinate = convertPolarCoordinateToCartesianCoordinate(
    centerXCoordinate,
    centerYCoordinate,
    radiusLength,
    startingAngleInDegrees
  );
  const endingCoordinate = convertPolarCoordinateToCartesianCoordinate(
    centerXCoordinate,
    centerYCoordinate,
    radiusLength,
    endingAngleInDegrees
  );
  const largeArcFlag = endingAngleInDegrees - startingAngleInDegrees <= 180 ? "0" : "1";

  return [
    `M ${startingCoordinate.xCoordinate} ${startingCoordinate.yCoordinate}`,
    `A ${radiusLength} ${radiusLength} 0 ${largeArcFlag} 1 ${endingCoordinate.xCoordinate} ${endingCoordinate.yCoordinate}`
  ].join(" ");
}

