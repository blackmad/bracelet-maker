import * as SimplexNoise from "simplex-noise";

const makerjs = require('makerjs');

import { OnOffMetaParameter, RangeMetaParameter, MetaParameterType, MetaParameter } from '../meta-parameter';
import { ModelMaker } from '../model';
import { SimplexNoiseUtils } from '../simplex-noise-utils'
import { FastRoundShim } from "./fast-abstract-inner-design";
const seedrandom = require('seedrandom');

export class InnerDesignCirclesImpl implements MakerJs.IModel {
	public units = makerjs.unitType.Inch;
  public paths: MakerJs.IPathMap = {};
  public models: MakerJs.IModelMap = {};
  
  constructor(params) {
    const {
      height = 2,
      width = 10,
      boundaryModel,
      safeCone,
      numCircles,
      minCircleSize,
      maxCircleSize,
      borderSize,
      seed,
      centerXNoiseDenom1,
      centerXNoiseDenom2,
      centerYNoiseDenom1,
      centerYNoiseDenom2,
      forceContainment
    } = params;


    const boundaryMeasure = makerjs.measure.modelExtents(boundaryModel);
    const boundaryWidth = boundaryMeasure.high[0] - boundaryMeasure.low[0];
    const boundaryHeight = boundaryMeasure.high[1] - boundaryMeasure.low[1];

    
    const paths = FastRoundShim.useFastRound(function() {
      var simplex: SimplexNoise = new SimplexNoise(seed.toString());
      
      var rng = seedrandom(seed.toString());
      
      const paths = [];
      for (var c = 1; c <= numCircles; c++) {
          const center = [
              boundaryMeasure.low[0] + rng() * boundaryWidth,
              boundaryMeasure.low[1] + rng() * boundaryHeight
          ];

          const circleSize = SimplexNoiseUtils.noise2DInRange(simplex, center[0]/10, center[1]/10, minCircleSize, maxCircleSize);

          paths.push(new makerjs.paths.Circle(
              center, circleSize
          ));
      }
      return paths;
    });

    const clampedModel = makerjs.model.combineIntersection(
      makerjs.model.clone(safeCone),
      makerjs.model.clone({paths: paths})

    );
    // this.models.clampedModel = clampedModel;
    // const clampedModels = makerjs.model.clone({paths: paths});

    const expandedModel = makerjs.model.expandPaths(
     makerjs.model.clone(clampedModel), borderSize);

    
    if (forceContainment) {
      this.models.expanded = makerjs.model.combineSubtraction(
          makerjs.model.clone(boundaryModel),
          expandedModel
      );
    } else {
      this.models.expanded = expandedModel;
      var outline = makerjs.model.outline(makerjs.model.clone(clampedModel), borderSize*3);
  
      this.models.outline = outline;
    }
  }
}

export class InnerDesignCircles implements ModelMaker {
  get metaParameters(): Array<MetaParameter> {
    return [
      new RangeMetaParameter({title: "Seed",  min: 1, max: 10000, value: 1, step: 1, name: 'seed' }),
      new RangeMetaParameter({title: "Num Circles", min: 1, max: 40, value: 20, step: 1, name: 'numCircles' }),
      new RangeMetaParameter({title: "Border Size", min: 0.1, max: 0.25, value: 0.1, step: 0.01, name: 'borderSize' }),
      new RangeMetaParameter({title: "Min Circle Size", min: 0.1, max: 2.0, value: 0.5, step: 0.01, name: 'minCircleSize' }),
      new RangeMetaParameter({title: "Max Circle Size", min: 0.1, max: 3.0, value: 1.5, step: 0.01, name: 'maxCircleSize' }),
      new RangeMetaParameter({title: "Center X Noise Demon 1", min: 1, max: 40, value: 20, step: 1, name: 'centerXNoiseDenom1' }),
      new RangeMetaParameter({title: "Center X Noise Demon 2", min: 1, max: 40, value: 20, step: 1, name: 'centerXNoiseDenom2' }),
      new RangeMetaParameter({title: "Center Y Noise Demon 1", min: 1, max: 40, value: 20, step: 1, name: 'centerYNoiseDenom1' }),
      new RangeMetaParameter({title: "Center Y Noise Demon 2", min: 1, max: 40, value: 10, step: 1, name: 'centerYNoiseDenom2' }),
      new OnOffMetaParameter({title: "Force Containment", name: 'forceContainment', value: false }),
    ]
  }

  public make(params: Map<string, any>): MakerJs.IModel {
    return new InnerDesignCirclesImpl(params);
  }
}