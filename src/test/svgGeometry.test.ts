import { describe, expect, it } from "vitest";
import { createCircleArcPath, createRegularPolygonPointList } from "../utilities/svgGeometry";

describe("svgGeometry", () => {
  it("creates a polygon point list for the requested number of vertices", () => {
    const polygonPointList = createRegularPolygonPointList(4, 10, 0, 0, 45);

    expect(polygonPointList.split(" ")).toHaveLength(4);
  });

  it("marks large SVG arcs correctly when the sweep spans more than 180 degrees", () => {
    const largeArcPath = createCircleArcPath(0, 0, 10, 0, 270);

    expect(largeArcPath).toContain("A 10 10 0 1 1");
  });
});
