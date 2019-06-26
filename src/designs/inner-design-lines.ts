import * as SimplexNoise from "simplex-noise";

const makerjs = require("makerjs");

import {
  OnOffMetaParameter,
  RangeMetaParameter,
  MetaParameterType,
  MetaParameter
} from "../meta-parameter";
import { ModelMaker } from "../model";
import { FastRoundShim } from "./fast-abstract-inner-design";
import { MakerJsUtils } from "../makerjs-utils";
const seedrandom = require("seedrandom");

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
      seed
    } = params;

    const boundaryRect = new makerjs.models.Rectangle(boundaryModel);
    var rng = seedrandom(seed.toString());

    const paths = [];
    for (var c = 1; c <= numLines; c++) {
      const line = MakerJsUtils.randomLineInRectangle(boundaryRect);
      paths.push(line);
    }

    // for (var c = 1; c <= numLines; c++) {
      
    //   const line = MakerJsUtils.randomLineInRectangle(boundaryRect);
    //   paths.push(line);
    // }

    const lines = { paths: paths };

    const expandedModel = makerjs.model.expandPaths(
      {
        models: {
          lines
        }
      },
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
      new RangeMetaParameter({
        title: "Seed",
        min: 1,
        max: 10000,
        value: 1,
        step: 1,
        name: "seed"
      }),
      new RangeMetaParameter({
        title: "Num Lines",
        min: 1,
        max: 100,
        value: 20,
        step: 1,
        name: "numLines"
      }),
      new RangeMetaParameter({
        title: "Border Size",
        min: 0.01,
        max: 0.25,
        value: 0.02,
        step: 0.01,
        name: "borderSize"
      })
    ];
  }

  public make(params: Map<string, any>): MakerJs.IModel {
    return new InnerDesignLinesImpl(params);
  }
}
