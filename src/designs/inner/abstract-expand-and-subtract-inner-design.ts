import * as _ from "lodash";
import * as SimplexNoise from "simplex-noise";

const makerjs = require("makerjs");
const seedrandom = require("seedrandom");

import { RangeMetaParameter, MetaParameter } from "../../meta-parameter";
import { ModelMaker } from "src/model-maker";

export abstract class AbstractExpandAndSubtractInnerDesign
  implements ModelMaker {
  rng: () => number;
  simplex: SimplexNoise;

  abstract makePaths(params): MakerJs.IPath[];
  abstract get designMetaParameters(): Array<MetaParameter>;
  
  make(params) {
    const { boundaryModel, borderSize, seed } = params;

    this.rng = seedrandom(seed.toString());
    this.simplex = new SimplexNoise(params.seed.toString())

    const lines = { paths: this.makePaths(params) };

    const expandedModel = makerjs.model.expandPaths(
      {
        models: {
          lines
        }
      },
      borderSize,
      1
    );

    return makerjs.model.combineSubtraction(
      makerjs.model.clone(boundaryModel),
      expandedModel
    );
  }

  get metaParameters() {
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
