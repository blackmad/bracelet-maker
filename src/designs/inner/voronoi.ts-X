var makerjs = require("makerjs");
import * as _ from "lodash";
import { Delaunay } from "d3-delaunay";

import { RangeMetaParameter, MetaParameter } from "../../meta-parameter";
import { CanvasShim } from "../canvas-shim";
import { AbstractExpandAndSubtractInnerDesign } from "./abstract-expand-and-subtract-inner-design";
import { MakerJsUtils } from "../../utils/makerjs-utils";

export class InnerDesignVoronoi extends AbstractExpandAndSubtractInnerDesign {
  makePaths(params): MakerJs.IPath[] {
    const {
      height,
      width,
      numPoints = 100,
      minPathLength = 1,
      boundaryModel
    } = params;
    const maxX = width;
    const maxY = height;

    let seedPoints = [];
    for (let i = 0; i < numPoints * 10; i++) {
      if (seedPoints.length == numPoints) {
        break;
      }
      const testPoint = [this.rng() * maxX, this.rng() * maxY];
      if (makerjs.measure.isPointInsideModel(testPoint, boundaryModel)) {
        seedPoints.push(testPoint);
      }
    }

    var delaunay = Delaunay.from(seedPoints);
    var voronoi = delaunay.voronoi([0, 0, maxX, maxY]);

    // We do the triangulation and then run through it once (should probably be iterative)
    // deleting seed points that result in polygons that are too small
    const newSeedPoints = [];

    let index = 0;
    for (let cell of voronoi.cellPolygons()) {
      const seed = seedPoints[index];
      const pathLength = MakerJsUtils.polygonArea(cell);
      if (pathLength > minPathLength) {
        newSeedPoints.push(seed);
      }
      index += 1;
    }

    console.log(newSeedPoints);
    seedPoints = newSeedPoints;
    delaunay = Delaunay.from(seedPoints);
    voronoi = delaunay.voronoi([0, 0, maxX, maxY]);

    const voronoiPaths = {};
    voronoi.render(new CanvasShim(voronoiPaths));

    return _.map(voronoiPaths, (v) => v);
  }

  get designMetaParameters(): Array<MetaParameter> {
    return [
      new RangeMetaParameter({
        title: "Num Points",
        min: 3,
        max: 100,
        value: 20,
        step: 1,
        name: "numPoints"
      }),
      new RangeMetaParameter({
        title: "Min Cell Size",
        min: 0.05,
        max: 1,
        value: 0.55,
        step: 0.01,
        name: "minPathLength"
      })
    ];
  }
}
