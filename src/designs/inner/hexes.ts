import {
  MetaParameter,
  RangeMetaParameter,
} from "../../meta-parameter";
import * as _ from "lodash";

import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";

export class InnerDesignHexes extends FastAbstractInnerDesign {
  allowOutline = true;
  needSubtraction = false;
  requiresSafeConeClamp = false;
  forceContainmentDefault = true;
  needSeed = false;

  makeDesign(paper: paper.PaperScope, params) {
    const {
      boundaryModel,
      outerModel,
      numRows,
      stretchWidth,
      forceContainment
    } = params;


    let rowHeight = boundaryModel.bounds.height / (numRows-1);
    if (!forceContainment) {
      rowHeight = outerModel.bounds.height / (numRows-0.5);
    }
    const hexSize = rowHeight * 0.5;
    const hexWidth = rowHeight * stretchWidth;

    const numHexes = Math.round(boundaryModel.bounds.width / (hexSize * 2 * stretchWidth));

    const paths = [];

    let startRow = 0;
    let endRow = numRows;

    let startX = boundaryModel.bounds.x;
    let startY = boundaryModel.bounds.y;

    if (!forceContainment) {
      // startRow = -1;
      // endRow -= 1;
      startY -= rowHeight/4;
    }

    for (let r = startRow; r < endRow; r++) {
      const offset = r % 2 ? -0.5 : -1;

      let startColumn = 0;
      let columnsForThisRow = numHexes - offset;

      console.log('row', r);
      console.log('expected width', hexWidth*(columnsForThisRow - offset))
      console.log(boundaryModel.bounds.width)
      // if (hexWidth*(columnsForThisRow + offset) > boundaryModel.bounds.width) {
      //   startColumn = 1;
      //   columnsForThisRow -= 1;
      // }

      
      
      for (let c = 0; c < columnsForThisRow; c += 1) {
        console.log('placing at ', startX + (c + offset) * hexWidth);
        const centerX = startX + (c + offset) * hexWidth;
        console.log(centerX + hexSize/2);
        console.log((startX + boundaryModel.bounds.width));
        if (centerX - hexSize/2 < startX || (centerX + hexSize/2) > (startX + boundaryModel.bounds.width - 0.02)) {
          continue;
        }
        let hex = new paper.Path.RegularPolygon(
          new paper.Point(
             centerX,
             startY + r * rowHeight,
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
        value: 1.5,
        step: 0.01,
        name: "stretchWidth"
      })
    ];
  }
}
