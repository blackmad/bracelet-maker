var makerjs = require('makerjs');

export class InnerDesignNoiseWaves {
  constructor({ 
    height,
    width,
    boundaryModel, 
    seed, 
    numLines = 5
    // bufferWidth, 
    // hashWidth, 
    // initialNoiseRange1, 
    // initialNoiseRange2, 
    // noiseOffset1, 
    // noiseOffset2, 
    // noiseInfluence 
  }) {
    var simplex = new SimplexNoise(seed.toString());
    var bbox = makerjs.measure.modelExtents(boundaryModel);
    var totalWidth = bbox.high[0] - bbox.low[0];
    var totalHeight = bbox.high[1] - bbox.low[1];

    const lines = []
    let lastPoint = null;
    for (var x = 0; x < width; x+=0.2) {
      const nextPoint = [x, ((simplex.noise2D(x, x*2)+1)*0.5*height*0.1) + height/2]
      if (lastPoint) {
        lines.push(new makerjs.paths.Line(lastPoint, nextPoint));
      }
      lastPoint = nextPoint;
    }

    const baseModel = { paths: lines, models: {} };
    
    var chain = makerjs.model.findSingleChain(baseModel);
    var filletsModel = makerjs.chain.fillet(chain, 0.1);
    baseModel.models.fillets = filletsModel;

    const expandedModel = makerjs.model.expandPaths(baseModel, 0.05, 10);
    const clampedModel = makerjs.model.combineIntersection(boundaryModel, expandedModel);
    this.models = clampedModel.models;
    this.paths = clampedModel.paths;

    this.units = makerjs.unitType.Inch;
  }
}

InnerDesignNoiseWaves.metaParameters = [
  // { title: "Buffer Width", type: "range", min: 0.075, max: 0.75, value: 0.15, step: 0.05, name: 'bufferWidth' },
  // { title: "Hash Width", type: "range", min: 0.075, max: 0.75, value: 0.25, step: 0.05, name: 'hashWidth' },
  { title: "Seed", type: "range", min: 1, max: 10000, value: 1, step: 1, name: 'seed' },
  // { title: "Start Noise Coeff 1", type: "range", min: 0, max: 20, step: 0.1, value: 10, name: 'initialNoiseRange1' },
  // { title: "Start Noise Coeff 2", type: "range", min: 0, max: 20, step: 0.1, value: 10, name: 'initialNoiseRange2' },
  // { title: "Noise Offset 1", type: "range", min: 0.01, max: 1, step: 0.1, value: 0.5, name: 'noiseOffset1' },
  // { title: "Noise Offset 2", type: "range", min: 0.01, max: 1, step: 0.1, value: 0.75, name: 'noiseOffset2' },
  // { title: "Noise Influence", type: "range", min: 0, max: 1, step: 0.01, value: 0.5, name: 'noiseInfluence' }
];

export default {}