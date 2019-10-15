import * as _ from "lodash";

import { RangeMetaParameter, MetaParameter, OnOffMetaParameter } from "../../meta-parameter";
import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";

function slope(a, b) {
  if (a.x == b.x) {
      return null;
  }

  return (b.y - a.y) / (b.x - a.x);
}

function yIntercept(point, slope) {
  if (slope === null) {
      // vertical line
      return point.x;
  }

  return point.y - slope * point.x;
}

export abstract class AbstractExpandInnerDesign
  extends FastAbstractInnerDesign {

  abstract makePaths(scope: paper.PaperScope, params): paper.Point[][];
  abstract pathDesignMetaParameters: MetaParameter[]
  
  makeDesign(paper: paper.PaperScope, params): paper.PathItem[] {
    const { boundaryModel, borderSize, seed, debug } = params;

    const lines = this.makePaths(paper, params);

    let totalPath = boundaryModel.clone();

    lines.map((line: paper.Point[]) => {
      const p1 = line[0];
      const p2 = line[1]
      const m = slope(p1, p2);
      const y = yIntercept(p1, m);
      
      const bufferDistance = 0.2
      var angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const h = params.lineWidth*0.5 / Math.cos(angleRadians);

      const path = new paper.Path([
        new paper.Point(p1.x, p1.y + h),
        new paper.Point(p2.x, y + h + p2.x*m),
        new paper.Point(p2.x, y - h + p2.x*m),
        new paper.Point(p1.x, p1.y-h),
        new paper.Point(p1.x, p1.y + h)
      ])


      path.closePath();
      path.strokeColor = "red";
      if (!params.debug) {
        path.remove();
      }
 
      totalPath = totalPath.subtract(path, {insert: false});

    })

    return [totalPath]
  }

  get designMetaParameters(): MetaParameter[] {
    return [
      new RangeMetaParameter({
        title: "Line Width",
        min: 0.02,
        max: 0.5,
        value: 0.1,
        step: 0.001,
        name: "lineWidth"
      }),
      ...this.pathDesignMetaParameters
    ];
  }
}
