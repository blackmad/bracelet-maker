const SimplexNoise = require('simplex-noise');
const makerjs = require('makerjs');

import { RangeMetaParameter, MetaParameterType, MetaParameter } from '../meta-parameter';
import { ModelMaker } from '../model';
import { SimplexNoiseUtils } from '../simplex-noise-utils'

export class InnerDesignCirclesImpl implements MakerJs.IModel {
	public units = makerjs.unitType.Inch;
  public paths: MakerJs.IPathMap = {};
  public models: MakerJs.IModelMap = {};
  
  constructor(params) {
    const { 
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
    } = params;

    var simplex = new SimplexNoise(seed.toString());

    const paths = [];
    for (var c = 1; c <= numCircles; c++) {
        const center = [
            SimplexNoiseUtils.noise2DInRange(simplex, c/centerXNoiseDenom1, c/centerXNoiseDenom2, 0, width),
            SimplexNoiseUtils.noise2DInRange(simplex, c/centerYNoiseDenom1, c/centerYNoiseDenom2, 0, height)
        ];

        const circleSize = SimplexNoiseUtils.noise2DInRange(simplex, c/20, c/10, minCircleSize, maxCircleSize);

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
  }
}

export class InnerDesignCircles implements ModelMaker {
  get metaParameters(): Array<MetaParameter> {
    return [
      new RangeMetaParameter({title: "Seed", type: MetaParameterType.Range, min: 1, max: 10000, value: 1, step: 1, name: 'seed' }),
      new RangeMetaParameter({title: "Num Circles", type: MetaParameterType.Range, min: 1, max: 40, value: 20, step: 1, name: 'numCircles' }),
      new RangeMetaParameter({title: "Border Size", type: MetaParameterType.Range, min: 0.1, max: 0.25, value: 0.1, step: 0.01, name: 'borderSize' }),
      new RangeMetaParameter({title: "Min Circle Size", type: MetaParameterType.Range, min: 0.1, max: 2.0, value: 0.5, step: 0.01, name: 'minCircleSize' }),
      new RangeMetaParameter({title: "Max Circle Size", type: MetaParameterType.Range, min: 0.1, max: 3.0, value: 1.5, step: 0.01, name: 'maxCircleSize' }),
      new RangeMetaParameter({title: "Center X Noise Demon 1", type: MetaParameterType.Range, min: 1, max: 40, value: 20, step: 1, name: 'centerXNoiseDenom1' }),
      new RangeMetaParameter({title: "Center X Noise Demon 2", type: MetaParameterType.Range, min: 1, max: 40, value: 20, step: 1, name: 'centerXNoiseDenom2' }),
      new RangeMetaParameter({title: "Center Y Noise Demon 1", type: MetaParameterType.Range, min: 1, max: 40, value: 20, step: 1, name: 'centerYNoiseDenom1' }),
      new RangeMetaParameter({title: "Center Y Noise Demon 2", type: MetaParameterType.Range, min: 1, max: 40, value: 10, step: 1, name: 'centerYNoiseDenom2' })
    ]
  }

  public make(params: Map<string, any>): MakerJs.IModel {
    return new InnerDesignCirclesImpl(params);
  }
}