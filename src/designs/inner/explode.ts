import * as _ from "lodash";

import {
  RangeMetaParameter,
  MetaParameter
} from "../../meta-parameter";

import { AbstractExpandInnerDesign } from './abstract-expand-and-subtract-inner-design'
import { pickPointOnRectEdge } from "../../utils/paperjs-utils";

export class InnerDesignExplode extends AbstractExpandInnerDesign {
  makePaths(paper, params): paper.Point[][] {
    const { outerModel, numLines, numCenters } = params;

    const paths = [];
    const boundaryRect = outerModel.bounds;

    let centers = _.times(numCenters, i => new paper.Point(
      boundaryRect.x + (boundaryRect.width * ((i + 1) / (numCenters + 1))),
      boundaryRect.y + (boundaryRect.height * ((i + 1) / (numCenters + 1)))
    ));

    // if (numCenters == 1) {
    //   centers = [
    //     [
    //       boundaryRect.center
    //       boundaryExtents.low[0] +
    //         (boundaryExtents.high[0] - boundaryExtents.low[0]) * this.rng(),
    //       boundaryExtents.low[1] +
    //         (boundaryExtents.high[1] + boundaryExtents.low[1]) * this.rng()
    //     ]
    //   ];
    // }

    for (let c = 1; c <= numLines; c++) {
      const p1 = pickPointOnRectEdge(paper, boundaryRect, this.rng);
      const center = centers[Math.floor(this.rng() * centers.length)];
      
      const line = [center, p1];
      console.log(center)
      console.log(p1)
      console.log(line)
      paths.push(line);
    }

    return paths;
  }

  get pathDesignMetaParameters(): Array<MetaParameter> {
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
        max: 3,
        value: 1,
        step: 1,
        name: "numCenters"
      })
    ];
  }
}
