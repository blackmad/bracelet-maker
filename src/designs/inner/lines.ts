const makerjs = require("makerjs");

import {
  RangeMetaParameter,
  MetaParameter
} from "../../meta-parameter";
import { MakerJsUtils } from "../../utils/makerjs-utils";

import { AbstractExpandAndSubtractInnerDesign } from './abstract-expand-and-subtract-inner-design'

export class InnerDesignLines extends AbstractExpandAndSubtractInnerDesign {
  makePaths(params): MakerJs.IPath[] {
    const { boundaryModel, numLines } = params;

    const boundaryRect = new makerjs.models.Rectangle(boundaryModel);
    makerjs.model.originate(boundaryRect);

    const paths = [];

    for (let c = 0; c <= numLines; c++) {
      const line = MakerJsUtils.randomLineInRectangle(boundaryRect, this.rng);
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
        value: 20,
        step: 1,
        name: "numLines"
      })
    ];
  }
}
