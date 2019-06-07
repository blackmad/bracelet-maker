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
        const origRound = makerjs.round;
        const origFromPolar =  makerjs.point.fromPolar;
        makerjs.round = function(x) { return Math.round(x * 1000000) / 1000000 };

        makerjs.point.fromPolar = function(angleInRadians: number, radius: number): MakerJs.IPoint {
          return [
              (angleInRadians == Math.PI / 2 || angleInRadians == 3 * Math.PI / 2) ? 0 : radius * Math.cos(angleInRadians),
              (angleInRadians == Math.PI || 2 * Math.PI) ? 0 : radius * Math.sin(angleInRadians)
          ];
        }

        const boundaryMeasure = makerjs.measure.modelExtents(boundaryModel);
        var rng = seedrandom(seed.toString());
        // var simplex: SimplexNoise = new SimplexNoise(seed.toString());

        const circles: MakerJs.paths.Circle[] = [];

        console.log(boundaryModel);

        console.log('forceContainment', forceContainment)
        var radius = maxCircleSize;
        // const triesPerRadius = 10;
        const triesPerRadius = 200;
        while (radius > minCircleSize) {
        // while (radius > maxCircleSize * 0.99) {
          
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

        makerjs.round = origRound;
        makerjs.point.fromPolar = origFromPolar;

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
      new RangeMetaParameter({title: "Min Circle Size", min: 0.02, max: 2.0, value: 0.02, step: 0.01, name: 'minCircleSize' }),
      new RangeMetaParameter({title: "Max Circle Size", min: 0.05, max: 3.0, value: 0.75, step: 0.01, name: 'maxCircleSize' }),
      new OnOffMetaParameter({title: "Force Containment", name: 'forceContainment', value: true }),
    ]
  }

  public make(params: Map<string, any>): MakerJs.IModel {
    return new InnerDesignCirclePackingImpl(params);
  }
}