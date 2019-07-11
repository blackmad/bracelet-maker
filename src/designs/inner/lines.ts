const makerjs = require("makerjs");
import * as paper from "paper";

import { RangeMetaParameter, MetaParameter } from "../../meta-parameter";
import { MakerJsUtils } from "../../utils/makerjs-utils";

import { AbstractExpandAndSubtractInnerDesign } from "./abstract-expand-and-subtract-inner-design";

export class InnerDesignLines extends AbstractExpandAndSubtractInnerDesign {
  makeRandomPointOnRectangle(rectangle: paper.Rectangle) {
    const randomPoint = new paper.Point(
      Math.random() * rectangle.width,
      Math.random() * rectangle.height
    );
    if (Math.random() <= 0.5) {
      if (randomPoint.x / rectangle.width <= 0.5) {
        randomPoint.x = 0;
      } else {
        randomPoint.x = rectangle.width;
      }
    } else {
      if (randomPoint.y / rectangle.height <= 0.5) {
        randomPoint.y = 0;
      } else {
        randomPoint.y = rectangle.height;
      }
    }
    return randomPoint;
  }

  makePaths(scope, params): paper.CompoundPath {
    const { boundaryModel, numLines } = params;

    const paths = [];

    for (let c = 0; c <= numLines; c++) {
      const line = new paper.Path();
      line.add(this.makeRandomPointOnRectangle(boundaryModel));
      line.add(this.makeRandomPointOnRectangle(boundaryModel));
      line.strokeColor = "red";
      console.log(line);

      paths.push(line);
    }
    console.log(paths);

    return paths;
  }

  get designMetaParameters(): Array<MetaParameter> {
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
