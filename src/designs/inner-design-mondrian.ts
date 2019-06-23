import * as SimplexNoise from "simplex-noise";

const makerjs = require('makerjs');

import { OnOffMetaParameter, RangeMetaParameter, MetaParameterType, MetaParameter } from '../meta-parameter';
import { ModelMaker } from '../model';
import { SimplexNoiseUtils } from '../simplex-noise-utils'
import { FastRoundShim } from "./fast-abstract-inner-design";
const seedrandom = require('seedrandom');
import * as _ from 'lodash';

export class InnerDesignMondrianImpl implements MakerJs.IModel {
	public units = makerjs.unitType.Inch;
  public paths: MakerJs.IPathMap = {};
  public models: MakerJs.IModelMap = {};
  
  rects: any[] = [];
  maxDepth: number;
  splitChance: number;
  rng: () => number;
  xyBias: number;
  minSizeMultiplier: number;
  borderSize: number;
  
  splitRect(lo, hi, depth = 0) {
    const self = this;
    function makeThisRect() {
      const rect = makerjs.model.move(
        new makerjs.models.Rectangle(hi[0] - lo[0] - self.borderSize, hi[1] - lo[1] - self.borderSize),
        [lo[0] + self.borderSize/2, lo[1] + self.borderSize/2]
      );
      console.log(rect);
      self.rects.push(rect);
    }
    
    if (
      depth > this.maxDepth ||
      this.rng() > this.splitChance
    ) {
      console.log('adding a rect', lo, hi)
      console.log(hi[0] - lo[0], hi[1] - lo[1])
      // const rect = makerjs.model.move(
      //   new makerjs.models.Rectangle(hi[0] - lo[0], hi[1] - lo[1]),
      //   lo
      // );
      makeThisRect();
      return;
    }
    
    
    const splitX = this.rng() < this.xyBias;
    const splitPercent = this.rng() * 0.6 + 0.2;
    console.log(splitPercent)
    
    if (splitX) {
      console.log('splitting x', depth)
      const splitSize = splitPercent*(hi[0] - lo[0]);
      
      if (splitSize < this.borderSize * this.minSizeMultiplier) {
        makeThisRect();
        return;
      }
      
      this.splitRect(
        [lo[0] + splitSize, lo[1]], hi, depth+1
      )
       this.splitRect(
        lo, [lo[0] + splitSize, hi[1]], depth+1
      )
    } else {
      console.log('splitting y', depth)
      console.log('first')
      const splitSize = splitPercent*(hi[1] - lo[1]);
      
      if (splitSize < this.borderSize * this.minSizeMultiplier) {
        makeThisRect();
        return;
      }
      
      this.splitRect(
        [lo[0], lo[1] + splitSize],
        hi,
        depth+1
      )
      console.log('second');
       this.splitRect(
        lo, [hi[0], lo[1] + splitSize], depth+1
      )
    }
  }
  
  constructor(params) {
    const {
      height = 2,
      width = 10,
      boundaryModel,
      safeCone,
      borderSize,
      seed,
      maxDepth,
      splitChance,
      xyBias,
      minSizeMultiplier
    } = params;
    
    this.maxDepth = maxDepth;
    this.splitChance = splitChance;
    this.borderSize = borderSize;
    this.xyBias = xyBias;
    this.minSizeMultiplier = minSizeMultiplier;
  
    const boundaryMeasure = makerjs.measure.modelExtents(boundaryModel);
    const boundaryWidth = boundaryMeasure.high[0] - boundaryMeasure.low[0];
    const boundaryHeight = boundaryMeasure.high[1] - boundaryMeasure.low[1];

    this.rng = seedrandom(seed.toString());
    
    this.splitRect(boundaryMeasure.low, boundaryMeasure.high, 0);
    
    const gridModel = {models: {}}
    _(this.rects).each((rect, i) =>
      gridModel.models[i.toString()] = rect
    )
    
    // this.models.grid = gridModel;
    this.models.clamped = makerjs.model.combineIntersection(gridModel, boundaryModel);
  }
}

export class InnerDesignMondrian implements ModelMaker {
  get metaParameters(): Array<MetaParameter> {
    return [
      new RangeMetaParameter({title: "Seed",  min: 1, max: 10000, value: 1, step: 1, name: 'seed' }),
      new RangeMetaParameter({title: "Border Size", min: 0.05, max: 0.5, value: 0.15, step: 0.01, name: 'borderSize' }),
      new RangeMetaParameter({title: "Max Depth", min: 1, max: 10, value: 4, step: 1, name: 'maxDepth' }),
      new RangeMetaParameter({title: "Split Chance", min: 0.1, max: 1.0, value: 0.7, step: 0.01, name: 'splitChance' }),
      new RangeMetaParameter({title: "X/Y Bias", min: 0.0, max: 1.0, value: 0.5, step: 0.01, name: 'xyBias' }),
      new RangeMetaParameter({title: "Min Size Multiplier", min: 2, max: 10, value: 3, step: 0.1, name: 'minSizeMultiplier' }),
    ]
  }

  public make(params: Map<string, any>): MakerJs.IModel {
    return new InnerDesignMondrianImpl(params);
  }
}