import * as paper from "paper";

import {RangeMetaParameter, MetaParameter } from "../../meta-parameter";
import { randomLineEndpointsOnRectangle } from "../../utils/paperjs-utils"

import { AbstractExpandInnerDesign } from "./abstract-expand-and-subtract-inner-design";

export class InnerDesignLines extends AbstractExpandInnerDesign {
  makePaths(scope: paper.PaperScope, params: any): paper.Point[][] {
    const {
      boundaryModel,
      outerModel,
      numLines
    } = params;

    const lines: paper.Point[][] = [];

    for (let c = 0; c < numLines; c++) {
      const line = randomLineEndpointsOnRectangle(outerModel.bounds, this.rng);
      lines.push(line);
    }

    return lines;
  }

  get pathDesignMetaParameters(): Array<MetaParameter> {
    return [
      new RangeMetaParameter({
        title: "Num Lines",
        min: 1,
        max: 100,
        value: 20,
        step: 1,
        name: "numLines"
      })
    ];
  }
}
