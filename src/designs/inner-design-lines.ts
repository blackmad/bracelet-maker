import * as _ from "lodash";

const makerjs = require("makerjs");

import {
  RangeMetaParameter,
  MetaParameter
} from "../meta-parameter";
import { ModelMaker } from "../model";
import { MakerJsUtils } from "../makerjs-utils";

import { AbstractExpandAndSubtractInnerDesign } from './abstract-expand-and-subtract-inner-design'

export class InnerDesignLinesImpl extends AbstractExpandAndSubtractInnerDesign {
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
}

export class InnerDesignLines implements ModelMaker {
  get metaParameters(): Array<MetaParameter> {
    return [
      ...AbstractExpandAndSubtractInnerDesign.prototype.metaParameters,
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

  public make(params: Map<string, any>): MakerJs.IModel {
    return new InnerDesignLinesImpl(params);
  }
}
