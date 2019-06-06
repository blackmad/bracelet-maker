var makerjs = require('makerjs');

import { Delaunay } from 'd3-delaunay';

import * as SimplexNoise from "simplex-noise";
import { SimplexNoiseUtils } from '../simplex-noise-utils'
import { RangeMetaParameter, MetaParameter } from '../meta-parameter';
import { ModelMaker } from 'src/model';


// function polygonArea(points,signed) {
//     var l = points.length
//     var det = 0
//     var isSigned = signed || false
  
//     points = points.map(normalize)
//     if (points[0] != points[points.length -1])  
//       points = points.concat(points[0])
  
//     for (var i = 0; i < l; i++)
//       det += points[i][0] * points[i + 1][1]
//         - points[i][1] * points[i + 1][0]
//     if (isSigned)
//       return det / 2
//     else
//       return Math.abs(det) / 2
//   }

// function modelArea(model) {
//     _.map(model.paths, function(path) {
//         console.log(path);
//     })
// }


export function InnerDesignVoronoiImpl(params) {
    const {
        height,
        width,
        numPoints = 100,
        expandWidth = 0.1,
        minPathLength = 1,
        xNoiseCoefficient,
        yNoiseCoefficient,
        seed,
        boundaryModel
    } = params;
    const maxX = width;
    const maxY = height;

    var simplex = new SimplexNoise(seed.toString());

    var seedPoints = []
    for (let i = 0; i < numPoints; i++) {
        seedPoints.push([
            SimplexNoiseUtils.positiveNoise2D(simplex, i, i*xNoiseCoefficient) * maxX, 
            SimplexNoiseUtils.positiveNoise2D(simplex, i, i*yNoiseCoefficient) * maxY
        ]);
    }

    var delaunay = Delaunay.from(seedPoints);
    var voronoi = delaunay.voronoi([0, 0, maxX, maxY]);

    // We do the triangulation and then run through it once (should probably be iterative) 
    // deleting seed points that result in polygons that are too small --
    // currently measured by border but probably should be by area
    const cellModels = {};
    const newSeedPoints = [];

    let index = 0;
    for (let cell of voronoi.cellPolygons()) {
        const seed = seedPoints[index];
        var cdModel = new makerjs.models.ConnectTheDots(true, cell);
        const tmpModel = makerjs.model.combineIntersection(
            cdModel,
            makerjs.model.clone(boundaryModel)
        );
        // console.log(tmpModel)

        var pathLength = makerjs.measure.modelPathLength(tmpModel.models.a);
        console.log(tmpModel.models.a)
        if (pathLength > minPathLength) {
            newSeedPoints.push(seed);
        }

        cellModels[index.toString()] = cdModel;
        index += 1;
    }
    // Return here to see the clamped triangulation 
    // console.log(cellModels);
    // this.models = cellModels;
    // console.log(this.models)
    // return;

    delaunay = Delaunay.from(newSeedPoints);
    voronoi = delaunay.voronoi([0, 0, maxX, maxY]);

    const boundaryRectModel= {
        paths: {
            'a': new makerjs.paths.Line([0, 0], [0, maxY]),
            'b': new makerjs.paths.Line([0, maxY], [maxX, maxY]),
            'c': new makerjs.paths.Line([maxX, maxY], [maxX, 0]),
            'd': new makerjs.paths.Line([maxX, 0], [0, 0])
        }
    }

    class CanvasShim {
        lastX: number;
        lastY: number;
        pathsDict: any;
        pathIndex: number;

        constructor(pathsDict) {
            this.lastX = 0;
            this.lastY = 0;
            this.pathsDict = pathsDict;
            this.pathIndex = 0;
        }

        moveTo(x, y) {
            this.lastX = x;
            this.lastY = y;

        }
        lineTo(x, y) {
            this.pathsDict[this.pathIndex.toString()] = 
                new makerjs.paths.Line([this.lastX, this.lastY], [x,y])
            this.pathIndex += 1;
        }
    }

    const voronoiPaths = {};
    voronoi.render(new CanvasShim(voronoiPaths));
    const voronoiTmpModel = {
        models: { 
            voronoi: {
                paths: voronoiPaths
            },
            boundingBox: boundaryRectModel
        }
    };

    const expandedModels = makerjs.model.expandPaths(voronoiTmpModel, expandWidth);

    const chainModels = {}
    const chains = makerjs.model.findChains(expandedModels);
    chains.forEach(function (chain, index) {
        if (index != 0) {
            // console.log(makerjs.chain.toNewModel(chain));
            const chainModel = makerjs.chain.toNewModel(chain);
            chainModels[index.toString()] = 
                makerjs.model.combineIntersection(
                    chainModel,
                    makerjs.model.clone(boundaryModel)
                );
        }
    })
    this.models = chainModels;

    this.units = makerjs.unitType.Inch;
}

export class InnerDesignVoronoi implements ModelMaker {
    get metaParameters(): Array<MetaParameter> {
        return [
            new RangeMetaParameter({ title: "Seed", min: 1, max: 10000, value: 1, step: 1, name: 'seed' }),
            new RangeMetaParameter({ title: "Num Points", min: 10, max: 100, value: 20, step: 1, name: 'numPoints' }),
            new RangeMetaParameter({ title: "Border Size (in)", min: 0.1, max: 0.75, value: 0.1, step: 0.01, name: 'expandWidth' }),
            new RangeMetaParameter({ title: "Min Cell Border Length", min: 0.5, max: 5, value: 1.0, step: 0.1, name: 'minPathLength' }),
            new RangeMetaParameter({ title: "xNoiseCoefficient", min: 0.01, max: 1, step: 0.1, value: 0.5, name: 'xNoiseCoefficient' }),
            new RangeMetaParameter({ title: "yNoiseCoefficient", min: 0.01, max: 1, step: 0.1, value: 0.2, name: 'yNoiseCoefficient' })
        ]
    }

    public make(params: Map<string, any>): MakerJs.IModel {
        return new InnerDesignVoronoiImpl(params);
      }
    }