import * as _ from "lodash";
const makerjs = require("makerjs");

import {
  RangeMetaParameter,
  MetaParameter
} from "../../meta-parameter";
import { MakerJsUtils } from "../../utils/makerjs-utils";

import { AbstractExpandAndSubtractInnerDesign } from './abstract-expand-and-subtract-inner-design'

export class InnerDesignExplode extends AbstractExpandAndSubtractInnerDesign {
  makePaths(params): MakerJs.IPath[] {
    const { boundaryModel, numLines, numCenters } = params;

    const boundaryRect = new makerjs.models.Rectangle(boundaryModel);
    makerjs.model.originate(boundaryRect);

    const paths = [];

    const boundaryExtents = makerjs.measure.modelExtents(boundaryModel);
    let centers = _.times(numCenters, i => [
      (boundaryExtents.low[0] + boundaryExtents.high[0]) *
        ((i + 1) / (numCenters + 1)),
      (boundaryExtents.low[1] + boundaryExtents.high[1]) *
        ((i + 1) / (numCenters + 1))
    ]);

    if (numCenters == 1) {
      centers = [
        [
          boundaryExtents.low[0] +
            (boundaryExtents.high[0] - boundaryExtents.low[0]) * this.rng(),
          boundaryExtents.low[1] +
            (boundaryExtents.high[1] + boundaryExtents.low[1]) * this.rng()
        ]
      ];
    }

    for (let c = 1; c <= numLines; c++) {
      const p1 = MakerJsUtils.randomPointOnPathsInModel(boundaryRect, this.rng);
      const center = centers[Math.floor(this.rng() * centers.length)];
      const line = new makerjs.paths.Line(center, p1);
      paths.push(line);
    }

    return paths;
  }

  get designMetaParameters(): Array<MetaParameter> {
    return [
      new RangeMetaParameter({
        title: "Num Lines",
        min: 1,
        max: 100,
        value: 30,
        step: 1,
        name: "numLines"
      }),
      new RangeMetaParameter({
        title: "Num Centers",
        min: 1,
        max: 2,
        value: 1,
        step: 1,
        name: "numCenters"
      })
    ];
  }
}
