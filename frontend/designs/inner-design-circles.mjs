import { SimplexNoise } from '../external/simplex-noise.mjs';

var makerjs = require('makerjs');

// This is a super gross way of deleting the paths that lie along the "safe" inner boundary
// so that the circles are connected to the rest of the cuff
function cleanModel(model) {
    if (!model || !model.models) { return }
    for (let [key, value] of Object.entries(model.models)) {
        if (value.alpha) {
            model.models[key] = null;
        } else {
            cleanModel(value)
        }
    }
  }


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function combineIntersection(modelA, modelB, options) {
    return makerjs.model.combine(modelA, modelB, true, false, true, false);
}

export class InnerDesignCircles {
  constructor({ 
    height = 2, 
    width = 10, 
    boundaryModel, 
    numCircles,
    maxBorderSize,
    minCircleSize,
    maxCircleSize,
    seed,
    centerXNoiseDenom1,
    centerXNoiseDenom2,
    centerYNoiseDenom1,
    centerYNoiseDenom2
  }) {
    var simplex = new SimplexNoise(seed.toString());

    var currentModel = {}
   
    var madeModel = false;

    var combineOptions = {};
    for (var c = 1; c <= numCircles; c++) {
        const paths = [];
        
        const center = [
            simplex.noise2DInRange(c/centerXNoiseDenom1, c/centerXNoiseDenom2, 0, width),
            simplex.noise2DInRange(c/centerYNoiseDenom1, c/centerYNoiseDenom2, 0, height)
        ];

        const circleSize = simplex.noise2DInRange(c/20, c/10, minCircleSize, maxCircleSize);
        const borderCoefficient = 1 + simplex.noise2DInRange(c/10, c/20, 0.1, maxBorderSize);

        paths.push(new makerjs.paths.Circle(
            center, circleSize
        ));
        paths.push(new makerjs.paths.Circle(
            center, circleSize*borderCoefficient
        ));

        var newModel = combineIntersection(
            makerjs.model.clone(boundaryModel),
            { paths: paths},
            combineOptions
        )
        delete combineOptions['measureeB']
        
        if (madeModel) {
            currentModel = makerjs.model.combineUnion(
                currentModel,
                newModel
            )
        } else {
            madeModel = true;
            currentModel = newModel
        }
        
    }

    cleanModel(currentModel);
    this.models = currentModel.models;
    this.paths = currentModel.paths;

    this.units = makerjs.unitType.Inch;

  }

 
}

InnerDesignCircles.metaParameters = [
  { title: "Seed", type: "range", min: 1, max: 10000, value: 1, step: 1, name: 'seed' },
  { title: "Num Circles", type: "range", min: 1, max: 30, value: 3, step: 1, name: 'numCircles' },
  { title: "Max Border Size", type: "range", min: 0.1, max: 0.25, value: 0.1, step: 0.01, name: 'maxBorderSize' },
  { title: "Min Circle Size", type: "range", min: 0.1, max: 2.0, value: 0.5, step: 0.01, name: 'minCircleSize' },
  { title: "Max Circle Size", type: "range", min: 0.1, max: 3.0, value: 1.5, step: 0.01, name: 'maxCircleSize' },
  { title: "Center X Noise Demon 1", type: "range", min: 1, max: 40, value: 20, step: 1, name: 'centerXNoiseDenom1' },
  { title: "Center X Noise Demon 2", type: "range", min: 1, max: 40, value: 20, step: 1, name: 'centerXNoiseDenom2' },
  { title: "Center Y Noise Demon 1", type: "range", min: 1, max: 40, value: 20, step: 1, name: 'centerYNoiseDenom1' },
  { title: "Center Y Noise Demon 2", type: "range", min: 1, max: 40, value: 10, step: 1, name: 'centerYNoiseDenom2' }
];

export default {}