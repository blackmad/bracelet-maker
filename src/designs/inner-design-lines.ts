import * as SimplexNoise from "simplex-noise";

const makerjs = require('makerjs');

import { OnOffMetaParameter, RangeMetaParameter, MetaParameterType, MetaParameter } from '../meta-parameter';
import { ModelMaker } from '../model';
import { SimplexNoiseUtils } from '../simplex-noise-utils'
import {expandWithoutOutline} from './design-utils'
import { FastRoundShim } from "./fast-abstract-inner-design";
const seedrandom = require('seedrandom');

// wowwwww this code is so gross and slow for what should be super simple

export class InnerDesignLinesImpl implements MakerJs.IModel {
	public units = makerjs.unitType.Inch;
  public paths: MakerJs.IPathMap = {};
  public models: MakerJs.IModelMap = {};
  
  constructor(params) {
    const {
      height = 2,
      width = 10,
      boundaryModel,
      numLines,
      borderSize,
      seed,
    } = params;
  
    const boundaryMeasure = makerjs.measure.modelExtents(boundaryModel);
    const boundaryWidth = boundaryMeasure.high[0] - boundaryMeasure.low[0];
    const boundaryHeight = boundaryMeasure.high[1] - boundaryMeasure.low[1];

    var rng = seedrandom(seed.toString());

    const paths = [];
    for (var c = 1; c <= numLines; c++) {
      const p1 = [
         boundaryMeasure.low[0] + rng() * boundaryWidth,
         boundaryMeasure.low[1] + rng() * boundaryHeight
      ]
      
      const slope = (rng()*2)-1;
      console.log(slope)
      
      const newP1 = [
        p1[0] + 10,
        p1[1] + 10*slope
      ]
      const newP2 = [
        p1[0] - 10,
        p1[1] - 10*slope
      ];
      
      const inter =
        makerjs.model.combineIntersection(
          {paths: [new makerjs.paths.Line(newP1, newP2)]},
          makerjs.model.clone(boundaryModel)
        );
        
      if (inter.models && inter.models.a) {
        paths.push(inter.models.a.paths[0])
      }
    }
    
    const lines = {paths: paths};

    const expandedModel = makerjs.model.expandPaths(
      {models: {
        lines
      }},
      borderSize,
      1
    );
    
    this.models.design = makerjs.model.combineSubtraction(
      makerjs.model.clone(boundaryModel),
      expandedModel
    );

  }
    
}

export class InnerDesignLines implements ModelMaker {
  get metaParameters(): Array<MetaParameter> {
    return [
      new RangeMetaParameter({title: "Seed",  min: 1, max: 10000, value: 1, step: 1, name: 'seed' }),
      new RangeMetaParameter({title: "Num Lines", min: 1, max: 100, value: 20, step: 1, name: 'numLines' }),
      new RangeMetaParameter({title: "Border Size", min: 0.01, max: 0.25, value: 0.02, step: 0.01, name: 'borderSize' }),
    ]
  }

  public make(params: Map<string, any>): MakerJs.IModel {
    return new InnerDesignLinesImpl(params);
  }
}