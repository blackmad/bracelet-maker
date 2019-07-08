import * as _ from "lodash";
import * as SimplexNoise from "simplex-noise";

const makerjs = require("makerjs");
const seedrandom = require("seedrandom");

import { RangeMetaParameter, MetaParameter, OnOffMetaParameter } from "../../meta-parameter";
import { ModelMaker } from "src/model-maker";

export abstract class AbstractExpandAndSubtractInnerDesign
  implements ModelMaker {
  rng: () => number;
  simplex: SimplexNoise;

  abstract makePaths(params): MakerJs.IPath[];
  abstract get designMetaParameters(): Array<MetaParameter>;
  
  make(params) {
    const { boundaryModel, borderSize, seed, debug } = params;

    this.rng = seedrandom(seed.toString());
    this.simplex = new SimplexNoise(params.seed.toString())

    const pathModel = { paths: this.makePaths(params) };
    makerjs.model.simplify(pathModel);

    console.log(pathModel);
    
    if (!debug) {
      const expandedModel = makerjs.model.expandPaths(
        {
          models: {
            pathModel
          }
        },
        borderSize,
        1
      );
      console.log('expanded')
      // return expandedModel;

      return makerjs.model.combineSubtraction(
        makerjs.model.clone(boundaryModel),
        expandedModel
      );
    } else {
      return pathModel;
    }
  }

  get metaParameters() {
    return [
      new OnOffMetaParameter({
        title: "Debug",
        name: "debug",
        value: false
      }),
      new RangeMetaParameter({
        title: "Seed",
        min: 1,
        max: 10000,
        value: 1,
        step: 1,
        name: "seed"
      }),
      new RangeMetaParameter({
        title: "Border Size",
        min: 0.04,
        max: 0.25,
        value: 0.04,
        step: 0.01,
        name: "borderSize"
      }),
      ...this.designMetaParameters
    ];
  }
}
