var makerjs = require('makerjs');
import {Delaunay} from '../external/d3-delaunay.mjs';

function polygonArea(points,signed) {
    var l = points.length
    var det = 0
    var isSigned = signed || false
  
    points = points.map(normalize)
    if (points[0] != points[points.length -1])  
      points = points.concat(points[0])
  
    for (var i = 0; i < l; i++)
      det += points[i][0] * points[i + 1][1]
        - points[i][1] * points[i + 1][0]
    if (isSigned)
      return det / 2
    else
      return Math.abs(det) / 2
  }


export function InnerDesignVoronoi({
    height,
    width,
    numPoints = 100,
    expandWidth = 0.1,
    minPathLength = 1,
    boundaryModel
}) {
    const maxX = width;
    const maxY = height;

    var seedPoints = []
    for (let i = 0; i < numPoints; i++) {
        seedPoints.push([Math.random() * maxX, Math.random() * maxY]);
    }

    var delaunay = Delaunay.from(seedPoints);
    var voronoi = delaunay.voronoi([0, 0, maxX, maxY]);

    let i = 0;
    const cellModels = {};
    const newSeedPoints = [];
    _.each(_.zip(Array.from(voronoi.cellPolygons()), seedPoints), function (cellAndSeed, index) {
        // console.log(cellAndSeed);
        const cell = cellAndSeed[0];
        const seed = cellAndSeed[1];
        var cdModel = new makerjs.models.ConnectTheDots(true, cell);
        const tmpModel = makerjs.model.combineIntersection(
            cdModel,
            makerjs.model.clone(boundaryModel)
        );
        // console.log(tmpModel)

        // bbox not working for some reason
        var pathLength = makerjs.measure.modelPathLength(tmpModel.models.a);
        // console.log()
        if (pathLength > minPathLength) {
            newSeedPoints.push(seed);
        }
        

        cellModels[i.toString()] = cdModel;
        i += 1;
    });
    // console.log(cellModels);
    // this.models = cellModels;
    // console.log(this.models)

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
    _.each(chains, function (chain, index) {
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

export default InnerDesignVoronoi;

InnerDesignVoronoi.metaParameters = [
    { title: "Num Points", type: "range", min: 10, max: 100, value: 20, step: 1, name: 'numPoints' },
    { title: "Border Size (in)", type: "range", min: 0.1, max: 0.75, value: 0.1, step: 0.01, name: 'expandWidth' },
    { title: "Min Cell Border Length", type: "range", min: 0.5, max: 5, value: 1.0, step: 0.1, name: 'minPathLength' }
  ];