var makerjs = require('makerjs');
import {Delaunay} from '../external/d3-delaunay.mjs';

export function InnerDesignVoronoi({
    height,
    width,
    numPoints = 100,
    expandWidth = 0.1,
    boundaryModel
}) {
    const maxX = width;
    const maxY = height;

    var seedPoints = []
    for (let i = 0; i < numPoints; i++) {
        seedPoints.push([Math.random() * maxX, Math.random() * maxY]);
    }

    const delaunay = Delaunay.from(seedPoints);
    const voronoi = delaunay.voronoi([0, 0, maxX, maxY]);

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

    // let i = 0;
    // const cellModels = {};
    // for (let cell of voronoi.cellPolygons()) {
    //     cellModels[i.toString()] = new makerjs.models.ConnectTheDots(true, cell);
    //     i += 1
    // }

    const boundaryRectModel= {
        paths: {
            'a': new makerjs.paths.Line([0, 0], [0, maxY]),
            'b': new makerjs.paths.Line([0, maxY], [maxX, maxY]),
            'c': new makerjs.paths.Line([maxX, maxY], [maxX, 0]),
            'd': new makerjs.paths.Line([maxX, 0], [0, 0])
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
            console.log(makerjs.chain.toNewModel(chain));
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
    { title: "Border Size (in)", type: "range", min: 0.1, max: 0.75, value: 0.1, step: 0.01, name: 'expandWidth' }
  ];