import * as _ from "lodash";
import * as SimplexNoise from "simplex-noise";
import * as paper from 'paper';
import ExtendPaperJs from 'paperjs-offset'



const seedrandom = require("seedrandom");

import { RangeMetaParameter, MetaParameter, OnOffMetaParameter } from "../../meta-parameter";
import { PaperModelMaker } from "src/model-maker";
import * as offset from 'paperjs-offset'
import { PassThrough } from "stream";

export abstract class AbstractExpandAndSubtractInnerDesign
  implements PaperModelMaker {
  rng: () => number;
  simplex: SimplexNoise;

  abstract makePaths(scope: paper.PaperScope, params): paper.Path[];
  abstract get designMetaParameters(): Array<MetaParameter>;
  
  make(scope: paper.PaperScope, params): paper.PathItem[] {
    const { boundaryModel, borderSize, seed, debug } = params;

    this.rng = seedrandom(seed.toString());
    this.simplex = new SimplexNoise(params.seed.toString())

    const paths = this.makePaths(paper, params);
    // makerjs.model.simplify(pathModel);

    // console.log(compoundPath);
    
    if (!debug) {
      // compoundPath.strokeColor = 'purple';
      ExtendPaperJs(paper);
      // console.log(   paper.Path.prototype.offset);
      paths.forEach((p) => {
        const expanded= paper.Path.prototype.offset.call(p, borderSize, {cap: 'miter'})
        // expanded.closed = true;
        console.log(expanded)
      })
      // // paper.add
      // console.log(expanded);
      // scope.

      // return makerjs.model.combineSubtraction(
      //   makerjs.model.clone(boundaryModel),
      //   expandedModel
    } else {
      // return pathModel;
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
