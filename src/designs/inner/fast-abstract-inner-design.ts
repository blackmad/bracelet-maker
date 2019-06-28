import * as SimplexNoise from "simplex-noise";
const makerjs = require("makerjs");
const seedrandom = require("seedrandom");

import {
  MetaParameter,
  RangeMetaParameter,
  OnOffMetaParameter
} from "../../meta-parameter";
import { ModelMaker } from "../../model-maker";
import { FastRoundShim } from "./fast-round-shim";

export abstract class FastAbstractInnerDesign implements ModelMaker {
  rng: () => number;
  simplex: SimplexNoise;
  useFastRound: boolean = true;
  needSubtraction: boolean = true;
  allowOutline: boolean = false;

  abstract makeDesign(params: any): any;
  abstract get designMetaParameters(): Array<MetaParameter>;

  get metaParameters(): Array<MetaParameter> {
    const metaParams = [
      new RangeMetaParameter({
        title: "Seed",
        min: 1,
        max: 10000,
        value: 1,
        step: 1,
        name: "seed"
      }),
      ...this.designMetaParameters
    ];

    if (this.allowOutline) {
      metaParams.push(
        new OnOffMetaParameter({
          title: "Force Containment",
          name: "forceContainment",
          value: false
        })
      );
    }

    return metaParams;
  }

  make(params: any): MakerJs.IModel {
    const self = this;
    let model = null;

    if (params.seed) {
      this.rng = seedrandom(params.seed.toString());
      this.simplex = new SimplexNoise(params.seed.toString());
    }

    if (this.useFastRound) {
      FastRoundShim.useFastRound(function() {
        model = self.makeDesign(params);
      });
    } else {
      console.log("not fast");
      model = self.makeDesign(params);
    }

    const debug = false;
    console.log(model);

    if (debug) {
      model.units = makerjs.unitType.Inch;
      return model;
    }

    let requiresSubtraction =
      (this.allowOutline && params.forceContainment) ||
      (!this.allowOutline && this.needSubtraction);

    if (requiresSubtraction) {
      const containedDesign = makerjs.model.combineIntersection(
        makerjs.model.clone(params.boundaryModel),
        model
      );

      return {
        models: containedDesign.models,
        units: makerjs.unitType.Inch
      };
    } else {
      model.units = makerjs.unitType.Inch;
      if (this.allowOutline && !params.forceContainment && !model.models.outline) {
        console.log("outlining");
        const outline = makerjs.model.outline(model, 0.1);
        console.log(outline);
        return {
          models: {
            model: model,
            outline: outline
          }
        };
      } else {
        return model;
      }
    }
  }
}
