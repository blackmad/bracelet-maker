var makerjs = require('makerjs');
var Delaunay = require('../../external/d3-delaunay');



function Voronoi() {
    const maxX = 100;
    const maxY = 100;
    const numPoints = 20;

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

    const paths = {
        // 'a': new makerjs.paths.Line([0, 0], [0, maxY]),
        // 'b': new makerjs.paths.Line([0, maxY], [maxX, maxY]),
        // 'c': new makerjs.paths.Line([maxX, maxY], [maxX, 0]),
        // 'd': new makerjs.paths.Line([maxX, 0], [0, 0])
    }


    voronoi.render(new CanvasShim(paths));
    // this.paths = paths;
    var models = makerjs.model.expandPaths({paths: paths}, 2);
    console.log(models);
    // this.paths = paths;
    this.models = models.models;
}

module.exports = Voronoi;