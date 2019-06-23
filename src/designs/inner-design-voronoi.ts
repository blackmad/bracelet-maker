var makerjs = require("makerjs");

import { Delaunay } from "d3-delaunay";

import { RangeMetaParameter, MetaParameter } from "../meta-parameter";
import { ModelMaker } from "src/model";
import { CanvasShim } from "./canvas-shim";

import * as _ from "lodash";

const seedrandom = require("seedrandom");

function polygonArea(points) {
  var l = points.length;
  var det = 0;

  for (var i = 0; i < l - 1; i++) {
    det += points[i][0] * points[i + 1][1] - points[i][1] * points[i + 1][0];
  }

  return Math.abs(det) / 2;
}

export function InnerDesignVoronoiImpl(params) {
  const {
    height,
    width,
    numPoints = 100,
    expandWidth = 0.1,
    minPathLength = 1,
    seed,
    boundaryModel
  } = params;
  const maxX = width;
  const maxY = height;

  var rng = seedrandom(seed.toString());

  let seedPoints = [];
  for (let i = 0; i < numPoints * 10; i++) {
    if (seedPoints.length == numPoints) {
      break;
    }
    const testPoint = [rng() * maxX, rng() * maxY];
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
    const pathLength = polygonArea(cell);
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
  const voronoiTmpModel = {
    models: {
      voronoi: {
        paths: voronoiPaths
      },
      // adding the bounding box here causes the voronois to clamp to it,
      // otherwise they're just weird unbounded pipe waffles
      boundingBox: boundaryModel
    }
  };

  const expandedModels = makerjs.model.expandPaths(
    voronoiTmpModel,
    expandWidth / 2
  );

  const chainModels = {};
  const chains = makerjs.model.findChains(expandedModels);
  chains.forEach(function(chain, index) {
    if (index != 0) {
      console.log(makerjs.chain.toNewModel(chain));
      let chainModel = makerjs.chain.toNewModel(chain);
      const isInside = _.every(chainModel.paths, path =>
        makerjs.model.isPathInsideModel(path, boundaryModel)
      );
      if (isInside) {
        chainModels[index.toString()] = chainModel;
      }
    }
  });
  this.models = chainModels;

  this.units = makerjs.unitType.Inch;
}

export class InnerDesignVoronoi implements ModelMaker {
  get metaParameters(): Array<MetaParameter> {
    return [
      new RangeMetaParameter({
        title: "Seed",
        min: 1,
        max: 10000,
        value: 1,
        step: 1,
        name: "seed"
      }),
      new RangeMetaParameter({
        title: "Num Points",
        min: 3,
        max: 100,
        value: 20,
        step: 1,
        name: "numPoints"
      }),
      new RangeMetaParameter({
        title: "Border Size (in)",
        min: 0.1,
        max: 0.75,
        value: 0.2,
        step: 0.01,
        name: "expandWidth"
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

  public make(params: Map<string, any>): MakerJs.IModel {
    return new InnerDesignVoronoiImpl(params);
  }
}
