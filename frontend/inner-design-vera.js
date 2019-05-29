var makerjs = require('makerjs');


export class InnerDesignVera {
  constructor({ 
    height, 
    width, 
    boundaryModel, 
    squareSize,
    bufferWidth,
    seed,
    xNoiseCoefficient,
    yNoiseCoefficient,
    xScaleNoiseCoefficient,
    yScaleNoiseCoefficient,
    minScale,
    maxScale
  }) {
    var simplex = new SimplexNoise(seed.toString());

    const models = {};
    const paths = [];

    // const boxWidth = width / cols;
    // const boxHeight = height / rows;
    const gridCellSize = (squareSize + bufferWidth);
    // const gridCellSize = squareSize;
    const boxWidth = squareSize;
    const boxHeight = squareSize;
    const rows = width / gridCellSize;
    const cols = height / gridCellSize;

    for (var r = -1; r <= rows; r++) {
        for (var c = -1; c <= cols; c++) {

            models[r + '.' + c] = makerjs.$(
                // new makerjs.models.Rectangle(
                //     boxWidth, boxHeight
                // ),
                {paths: [
                    new makerjs.paths.Circle(
                        boxWidth/2
                    )
                ]}
            )
            .rotate(simplex.noise2DInRange(r*xNoiseCoefficient, c*yNoiseCoefficient, 0, 180))
            
            .scale(simplex.noise2DInRange(r*xScaleNoiseCoefficient, c*yScaleNoiseCoefficient, minScale, maxScale))
            //.move([r*gridCellSize, c*gridCellSize])
            .move([r*gridCellSize 
                +simplex.noise2DInRange(r*xNoiseCoefficient, c*yNoiseCoefficient, -bufferWidth/2, bufferWidth/2),
                 c*gridCellSize
                 + simplex.noise2DInRange(r*xNoiseCoefficient, c*yNoiseCoefficient, -bufferWidth/2, bufferWidth/2)
            ])
            .$result;
        }
    }

    this.models = makerjs.model.combineIntersection(
        makerjs.model.clone(boundaryModel),
        {models: models}
        // makerjs.model.expandPaths({models: models}, bufferWidth)
    ).models;

    this.units = makerjs.unitType.Inch;
  }
}

InnerDesignVera.metaParameters = [
  { title: "Seed", type: "range", min: 1, max: 10000, value: 1, step: 1, name: 'seed' },
  { title: "Square Size", type: "range", min: 0.1, max: 2.0, value: 0.2, step: 0.01, name: 'squareSize' },

  { title: "Border Size (in)", type: "range", min: 0.1, max: 0.75, value: 0.1, step: 0.01, name: 'bufferWidth' },
  { title: "xNoiseCoefficient", type: "range", min: 0.00, max: 0.2, step: 0.001, value: 0.01, name: 'xNoiseCoefficient' },
  { title: "yNoiseCoefficient", type: "range", min: 0.00, max: 0.2, step: 0.001, value: 0.01, name: 'yNoiseCoefficient' },
  { title: "xScaleNoiseCoefficient", type: "range", min: 0.00, max: 0.2, step: 0.001, value: 0.01, name: 'xScaleNoiseCoefficient' },
  { title: "yScaleNoiseCoefficient", type: "range", min: 0.00, max: 0.2, step: 0.001, value: 0.01, name: 'yScaleNoiseCoefficient' },

  { title: "Min scaling", type: "range", min: 0.1, max: 1.0, value: 0.5, step: 0.01, name: 'minScale' },
  { title: "Max scaling", type: "range", min: 1.0, max: 1.5, value: 1.25, step: 0.01, name: 'maxScale' },

  

];

export default {}