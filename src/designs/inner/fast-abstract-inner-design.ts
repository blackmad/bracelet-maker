import * as SimplexNoise from "simplex-noise";
const makerjs = require("makerjs");
const seedrandom = require("seedrandom");

import { MetaParameter, RangeMetaParameter } from "../../meta-parameter";
import { ModelMaker } from "../../model-maker";
import { FastRoundShim } from './fast-round-shim'

export abstract class FastAbstractInnerDesign implements ModelMaker {
  rng: () => number;
  simplex: SimplexNoise

  abstract makeDesign(params: any): any;
  abstract get designMetaParameters(): Array<MetaParameter>;

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
      ...this.designMetaParameters
    ]
  }

  make(params: any): MakerJs.IModel {
    const self = this;
    let model = null;

    this.rng = seedrandom(params.seed.toString());
    this.simplex = new SimplexNoise(params.seed.toString())

    FastRoundShim.useFastRound(function() {
      model = self.makeDesign(params);
    });

    const debug = false;

    if (debug) {
      model.units = makerjs.unitType.Inch;
      return model;
    } else {
      const containedDesign = makerjs.model.combineIntersection(
        makerjs.model.clone(params.boundaryModel),
        model
      );

      return {
        models: containedDesign.models,
        units: makerjs.unitType.Inch
      }
    }
  }
}
