import * as _ from "lodash";
import * as paper from 'paper';

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
  
  makeDesign(scope: paper.PaperScope, params): paper.PathItem[] {
    const { boundaryModel, borderSize, seed, debug } = params;

    const lines = this.makePaths(scope, params);

    let totalPath = boundaryModel.clone();

    lines.map((line: paper.Point[]) => {
      console.log(line)
      console.log(line[0])
      console.log(line[0].x)
    

      const p1 = line[0];
      const p2 = line[1]
      const m = slope(p1, p2);
      const y = yIntercept(p1, m);
      console.log(m);
      console.log(y);
      
      const bufferDistance = 0.2
      var angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      console.log(angleRadians)
      const h = params.lineWidth*0.5 / Math.cos(angleRadians);
      console.log(h);

      const path = new paper.Path([
        new paper.Point(p1.x, p1.y + h),
        new paper.Point(p2.x, y + h + p2.x*m),
        new paper.Point(p2.x, y - h + p2.x*m),
        new paper.Point(p1.x, p1.y-h),
        new paper.Point(p1.x, p1.y + h)
      ])

      console.log(path);

      path.closePath();
      console.log(path.bounds)
      path.strokeColor = "red";
      if (!params.debug) {
        path.remove();
      }
 
      totalPath = totalPath.subtract(path, {insert: false});

    })
    // console.log(paths);

    // return paths;
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
