import { SimplexNoiseUtils } from "../../utils/simplex-noise-utils";
import {
  MetaParameter,
  RangeMetaParameter,
  OnOffMetaParameter
} from "../../meta-parameter";
import Angle from "../../utils/angle";
import * as _ from "lodash";

import { PaperModelMaker } from '../../model-maker';
import * as paper from 'paper';
import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";

var makerjs = require("makerjs");

export class InnerDesignHexes extends FastAbstractInnerDesign {
  allowOutline = true;
  needSubtraction = false;
  requiresSafeConeClamp = false;

  makeDesign(scope, params) {
    const {
      boundaryModel,
      outerModel,
      numRows,
      stretchWidth,
      filletOutlineRadius,
      forceContainment
    } = params;


    let rowHeight = boundaryModel.bounds.height / (numRows-1);
    if (!forceContainment) {
      rowHeight = outerModel.bounds.height / (numRows-1);
    }
    const hexSize = rowHeight * 0.5;
    const hexWidth = rowHeight * stretchWidth;

    const numHexes = Math.round(boundaryModel.bounds.width / (hexSize * 2 * stretchWidth));

    const paths = [];
    let outlinePaths = [];

    let startRow = 0;
    let endRow = numRows;
    if (!forceContainment) {
      startRow = -1;
    }

    for (let r = startRow; r < endRow; r++) {
      const offset = r % 2 ? 0.5 : 1;

      const columnsForThisRow = numHexes - offset;
      
      for (let c = 0; c < columnsForThisRow; c += 1) {
        let hex = new paper.Path.RegularPolygon(
          new paper.Point(
            boundaryModel.bounds.x + (c + offset) * hexWidth,
            boundaryModel.bounds.y + r * rowHeight,
          ), 6, hexSize);
          paths.push(hex);
            
          if (stretchWidth != 1) {
            hex.scale(stretchWidth, 1);
          }
      }
    }
    return paths;
  }

  get designMetaParameters(): Array<MetaParameter> {
    return [
      new RangeMetaParameter({
        title: "Rows",
        min: 3,
        max: 10,
        value: 5,
        step: 1,
        name: "numRows"
      }),
      new RangeMetaParameter({
        title: "stretchWidth",
        min: 0.5,
        max: 3,
        value: 1,
        step: 0.01,
        name: "stretchWidth"
      })
    ];
  }
}
