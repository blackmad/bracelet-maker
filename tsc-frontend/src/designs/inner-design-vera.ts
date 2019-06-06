import { ShapeMaker } from './shape-maker';

import * as SimplexNoise from "simplex-noise";
import { SimplexNoiseUtils } from '../simplex-noise-utils'
import { ModelMaker } from '../model';
import { MetaParameter, RangeMetaParameter, SelectMetaParameter } from '../meta-parameter';

var makerjs = require('makerjs');

export class InnerDesignVeraImpl implements MakerJs.IModel {
  public units = makerjs.unitType.Inch;
  public paths: MakerJs.IPathMap = {};
  public models: MakerJs.IModelMap = {};
  
  constructor(params) {
    const { 
        height, 
        width, 
        boundaryModel, 
        shapeSize1,
        shapeSize2,
        bufferWidth,
        seed,
        xNoiseCoefficient,
        yNoiseCoefficient,
        xScaleNoiseCoefficient,
        yScaleNoiseCoefficient,
        minScale,
        maxScale,
        shapeName
    } = params;
    var simplex = new SimplexNoise(seed.toString());

    const models = {};
    const paths = [];

    const gridCellSizeX = (shapeSize1 + bufferWidth*2);
    const gridCellSizeY = (shapeSize2 + bufferWidth*2);
    const rows = width / gridCellSizeX;
    const cols = height / gridCellSizeY;

    for (var r = -1; r <= rows; r++) {
        for (var c = -1; c <= cols; c++) {

            models[r + '.' + c] = makerjs.$(
                ShapeMaker.makeShape(shapeName, shapeSize1, shapeSize2)
                // ShapeMaker.makeShape(shapeName, boxWidth)
            )
            .rotate(SimplexNoiseUtils.noise2DInRange(simplex, r*xNoiseCoefficient, c*yNoiseCoefficient, 0, 180))
            .scale(SimplexNoiseUtils.noise2DInRange(simplex, r*xScaleNoiseCoefficient, c*yScaleNoiseCoefficient, minScale, maxScale))
            //.move([r*gridCellSize, c*gridCellSize])
            .move([r*gridCellSizeX 
                +SimplexNoiseUtils.noise2DInRange(simplex, r*xNoiseCoefficient, c*yNoiseCoefficient, -bufferWidth/2, bufferWidth/2),
                 c*gridCellSizeY
                 + SimplexNoiseUtils.noise2DInRange(simplex, r*xNoiseCoefficient, c*yNoiseCoefficient, -bufferWidth/2, bufferWidth/2)
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

export class InnerDesignVera implements ModelMaker {
  get metaParameters(): Array<MetaParameter> {
    return [
        new RangeMetaParameter({ title: "Seed", min: 1, max: 10000, value: 1, step: 1, name: 'seed' }),
        new RangeMetaParameter({ title: "Shape Size 1 (Width?)", min: 0.02, max: 2.0, value: 0.2, step: 0.01, name: 'shapeSize1' }),
        new RangeMetaParameter({ title: "Shape Size 2 (Height?)", min: 0.02, max: 2.0, value: 0.2, step: 0.01, name: 'shapeSize2' }),
      
        new RangeMetaParameter({ title: "Border Size (in)", min: 0.1, max: 0.75, value: 0.1, step: 0.01, name: 'bufferWidth' }),
        new RangeMetaParameter({ title: "xNoiseCoefficient", min: 0.00, max: 0.2, step: 0.001, value: 0.01, name: 'xNoiseCoefficient' }),
        new RangeMetaParameter({ title: "yNoiseCoefficient", min: 0.00, max: 0.2, step: 0.001, value: 0.01, name: 'yNoiseCoefficient' }),
        new RangeMetaParameter({ title: "xScaleNoiseCoefficient", min: 0.00, max: 0.2, step: 0.001, value: 0.01, name: 'xScaleNoiseCoefficient' }),
        new RangeMetaParameter({ title: "yScaleNoiseCoefficient", min: 0.00, max: 0.2, step: 0.001, value: 0.01, name: 'yScaleNoiseCoefficient' }),
      
        new RangeMetaParameter({ title: "Min scaling", min: 0.1, max: 1.0, value: 0.5, step: 0.01, name: 'minScale' }),
        new RangeMetaParameter({ title: "Max scaling", min: 1.0, max: 1.5, value: 1.25, step: 0.01, name: 'maxScale' }),
      
        new SelectMetaParameter({ title: "Shape", options: ShapeMaker.modelNames, name: 'shapeName', value: 'Rectangle'})
    ]
  }

  public make(params: Map<string, any>): MakerJs.IModel {
    return new InnerDesignVeraImpl(params);
  }
}