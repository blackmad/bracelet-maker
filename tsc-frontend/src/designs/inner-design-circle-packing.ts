import * as SimplexNoise from "simplex-noise";
import { MakerJsUtils } from '../makerjs-utils';

const makerjs = require('makerjs');

import { RangeMetaParameter, OnOffMetaParameter, MetaParameter } from '../meta-parameter';
import { ModelMaker } from '../model';
import * as _ from "lodash";
const seedrandom = require('seedrandom');

export class InnerDesignCirclePackingImpl implements MakerJs.IModel {
  public units = makerjs.unitType.Inch;
  public paths: MakerJs.IPathMap = {};
  public models: MakerJs.IModelMap = {};
  
  constructor(params) {
    const { 
      height = 2, 
      width = 10, 
      boundaryModel, 
      minCircleSize,
      maxCircleSize,
      borderSize,
      seed,
      forceContainment
    } = params;
        const boundaryMeasure = makerjs.measure.modelExtents(boundaryModel);
        var rng = seedrandom(seed.toString());
        // var simplex: SimplexNoise = new SimplexNoise(seed.toString());

        const circles: MakerJs.paths.Circle[] = [];

        console.log(boundaryModel);

        var radius = maxCircleSize;
        const triesPerRadius = 300;
        while (radius > minCircleSize) {
            for (let i = 0; i < triesPerRadius; i++) {
                const center = [
                    rng() * width,
                    rng() * height,
                ]
                const testCircle = new makerjs.paths.Circle(center, radius);
                if (MakerJsUtils.checkPathMeasureOverlap(testCircle, boundaryMeasure) &&
                    (!forceContainment || !MakerJsUtils.checkPathIntersectsModel(testCircle, boundaryModel)) &&
                    _.every(circles, (c) => !MakerJsUtils.checkCircleCircleIntersection(c, testCircle, borderSize))) {
                        circles.push(testCircle)
                }
            }
            radius *= 0.99
        }

        const containedCircles = makerjs.model.combineIntersection(
          makerjs.model.clone(boundaryModel),
          {paths: circles}
        );

        this.models = containedCircles.models;
    }
}

export class InnerDesignCirclePacking implements ModelMaker {
  get metaParameters(): Array<MetaParameter> {
    return [
      new RangeMetaParameter({title: "Seed", min: 1, max: 10000, value: 1, step: 1, name: 'seed' }),
      new RangeMetaParameter({title: "Border Size", min: 0.1, max: 0.25, value: 0.1, step: 0.01, name: 'borderSize' }),
      new RangeMetaParameter({title: "Min Circle Size", min: 0.02, max: 2.0, value: 0.5, step: 0.01, name: 'minCircleSize' }),
      new RangeMetaParameter({title: "Max Circle Size", min: 0.1, max: 3.0, value: 1.5, step: 0.01, name: 'maxCircleSize' }),
      new OnOffMetaParameter({title: "Force Containment", name: 'forceContainment', value: true }),
    //   new RangeMetaParameter({title: "Center X Noise Demon 1", type: MetaParameterType.Range, min: 1, max: 40, value: 20, step: 1, name: 'centerXNoiseDenom1' }),
    //   new RangeMetaParameter({title: "Center X Noise Demon 2", type: MetaParameterType.Range, min: 1, max: 40, value: 20, step: 1, name: 'centerXNoiseDenom2' }),
    //   new RangeMetaParameter({title: "Center Y Noise Demon 1", type: MetaParameterType.Range, min: 1, max: 40, value: 20, step: 1, name: 'centerYNoiseDenom1' }),
    //   new RangeMetaParameter({title: "Center Y Noise Demon 2", type: MetaParameterType.Range, min: 1, max: 40, value: 10, step: 1, name: 'centerYNoiseDenom2' })
    ]
  }

  public make(params: Map<string, any>): MakerJs.IModel {
    return new InnerDesignCirclePackingImpl(params);
  }
}