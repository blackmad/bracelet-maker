import { SimplexNoise } from '../external/simplex-noise.mjs';

var makerjs = require('makerjs');

export class InnerDesignCirclesXVera {
  constructor({ 
    height = 2, 
    width = 10, 
    boundaryModel, 
    cols,
    rows,
    minCircleSize,
    maxCircleSize,
    borderSize,
    yOffset,
    rowOffset,
    seed,
    centerXNoiseDenom1,
    centerXNoiseDenom2,
    centerYNoiseDenom1,
    centerYNoiseDenom2
  }) {
    var simplex = new SimplexNoise(seed.toString());

    const rowCellSize = width/cols;
    const widthCellSize = height/rows;

    const paths = [];

    const boundaryExtents = makerjs.measure.modelExtents(boundaryModel);
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            const center = [
                ((r%2) * rowOffset*rowCellSize) + c*rowCellSize + simplex.noise2DInRange(c/centerXNoiseDenom1, c/centerXNoiseDenom2, -rowCellSize*2, rowCellSize*2),
                 yOffset + (r*widthCellSize + simplex.noise2DInRange(r/centerYNoiseDenom1, r/centerYNoiseDenom2, -widthCellSize*2, widthCellSize*2))
            ];

            const circleSize = simplex.noise2DInRange(r/10, c/10, minCircleSize, maxCircleSize);

            const possibleCircle = new makerjs.paths.Circle(center, circleSize);
            const shouldUseCircle = makerjs.measure.isMeasurementOverlapping(boundaryExtents, makerjs.measure.modelExtents({paths: [possibleCircle]}));
            // if (true) {
            if (shouldUseCircle) {
                paths.push(possibleCircle);
            }
        }
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

InnerDesignCirclesXVera.metaParameters = [
  { title: "Seed", type: "range", min: 1, max: 10000, value: 1, step: 1, name: 'seed' },
  { title: "Cols", type: "range", min: 1, max: 10, value: 5, step: 1, name: 'cols' },
  { title: "Rows", type: "range", min: 1, max: 10, value: 5, step: 1, name: 'rows' },
  { title: "Border Size", type: "range", min: 0.1, max: 0.25, value: 0.1, step: 0.01, name: 'borderSize' },
  { title: "Min Circle Size", type: "range", min: 0.1, max: 2.0, value: 0.5, step: 0.01, name: 'minCircleSize' },
  { title: "Max Circle Size", type: "range", min: 0.1, max: 3.0, value: 1.5, step: 0.01, name: 'maxCircleSize' },
  { title: "Center X Noise Demon 1", type: "range", min: 1, max: 400, value: 20, step: 1, name: 'centerXNoiseDenom1' },
  { title: "Center X Noise Demon 2", type: "range", min: 1, max: 400, value: 20, step: 1, name: 'centerXNoiseDenom2' },
  { title: "Center Y Noise Demon 1", type: "range", min: 1, max: 400, value: 20, step: 1, name: 'centerYNoiseDenom1' },
  { title: "Center Y Noise Demon 2", type: "range", min: 1, max: 400, value: 10, step: 1, name: 'centerYNoiseDenom2' },
  { title: "Y Offset", type: "range", min: 0.1, max: 3.0, value: 0.5, step: 0.01, name: 'yOffset' },
  { title: "Row Offset", type: "range", min: 0.0, max: 1.0, value: 0.2, step: 0.01, name: 'rowOffset' },


];

export default {}