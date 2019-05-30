import { SimplexNoise } from '../external/simplex-noise.mjs';

var makerjs = require('makerjs');

// This is a super gross way of deleting the paths that lie along the "safe" inner boundary
// so that the circles are connected to the rest of the cuff
function extractBoundaryChunks(model) {
    const chunks = [];
    extractBoundaryChunksHelper(model, chunks);
    return chunks;
}

function extractBoundaryChunksHelper(model, chunks) {
if (!model || !model.models) { return }
for (let [key, value] of Object.entries(model.models)) {
    if (value.alpha) {
        chunks.push(model.models[key]);
        delete model.models[key];
    } else {
        extractBoundaryChunksHelper(value, chunks)
    }
}
}

function lineLength(line) {
    return Math.sqrt(Math.pow(line.end[0] - line.origin[0], 2) + Math.pow(line.end[1] - line.origin[1], 2));
}

function combineIntersection(modelA, modelB, options) {
    return makerjs.model.combine(modelA, modelB, true, false, true, false);
}

function extractPaths(model, optionalType) {
    const paths = [];
    var walkOptions = {
        onPath: function (wp) {
            if (!optionalType || optionalType == wp.pathContext.type) {
                paths.push(wp.pathContext);
            }
        }
      };
      
    makerjs.model.walk(model, walkOptions);
    return paths;
}

function approxSlope(line) {
    if (!line.end) { return NaN; }
    return Math.round(
        (line.origin[0] - line.end[0]) / (line.origin[1] - line.end[1]) * 1000
    )
}

export class InnerDesignCircles {
  constructor({ 
    height = 2, 
    width = 10, 
    boundaryModel, 
    numCircles,
    minCircleSize,
    maxCircleSize,
    borderSize,
    seed,
    centerXNoiseDenom1,
    centerXNoiseDenom2,
    centerYNoiseDenom1,
    centerYNoiseDenom2
  }) {
    var simplex = new SimplexNoise(seed.toString());

    const paths = [];
    for (var c = 1; c <= numCircles; c++) {
        const center = [
            simplex.noise2DInRange(c/centerXNoiseDenom1, c/centerXNoiseDenom2, 0, width),
            simplex.noise2DInRange(c/centerYNoiseDenom1, c/centerYNoiseDenom2, 0, height)
        ];

        const circleSize = simplex.noise2DInRange(c/20, c/10, minCircleSize, maxCircleSize);

        paths.push(new makerjs.paths.Circle(
            center, circleSize
        ));
    }

    const expandedModels = makerjs.model.expandPaths({paths: paths}, borderSize);
    this.models = expandedModels.models;
    this.models = makerjs.model.combineSubtraction(
        makerjs.model.clone(boundaryModel),
        expandedModels
    ).models;

    this.units = makerjs.unitType.Inch;
  }
}

InnerDesignCircles.metaParameters = [
  { title: "Seed", type: "range", min: 1, max: 10000, value: 1, step: 1, name: 'seed' },
  { title: "Num Circles", type: "range", min: 1, max: 40, value: 20, step: 1, name: 'numCircles' },
  { title: "Border Size", type: "range", min: 0.1, max: 0.25, value: 0.1, step: 0.01, name: 'borderSize' },
  { title: "Min Circle Size", type: "range", min: 0.1, max: 2.0, value: 0.5, step: 0.01, name: 'minCircleSize' },
  { title: "Max Circle Size", type: "range", min: 0.1, max: 3.0, value: 1.5, step: 0.01, name: 'maxCircleSize' },
  { title: "Center X Noise Demon 1", type: "range", min: 1, max: 40, value: 20, step: 1, name: 'centerXNoiseDenom1' },
  { title: "Center X Noise Demon 2", type: "range", min: 1, max: 40, value: 20, step: 1, name: 'centerXNoiseDenom2' },
  { title: "Center Y Noise Demon 1", type: "range", min: 1, max: 40, value: 20, step: 1, name: 'centerYNoiseDenom1' },
  { title: "Center Y Noise Demon 2", type: "range", min: 1, max: 40, value: 10, step: 1, name: 'centerYNoiseDenom2' }
];

export default {}