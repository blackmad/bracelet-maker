import { SimplexNoise } from '../external/simplex-noise.mjs';

var makerjs = require('makerjs');

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