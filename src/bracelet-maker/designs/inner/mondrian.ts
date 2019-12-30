import {
  RangeMetaParameter,
  MetaParameter
} from "../../meta-parameter";
import * as _ from "lodash";

import { FastAbstractInnerDesign } from './fast-abstract-inner-design';

export class InnerDesignMondrian extends FastAbstractInnerDesign {
  rects: any[] = [];
  maxDepth: number;
  splitChance: number;
  xyBias: number;
  minCellSize: number;
  borderSize: number;
  paper: paper.PaperScope;

  needSubtraction = false;
  canRound = true;

  allowOutline = true;

  splitRect(lo, hi, depth = 0) {
    const self = this;
    function makeThisRect() {
      const rect = 
        new self.paper.Path.Rectangle(
            new self.paper.Rectangle(
              lo[0] + self.borderSize / 2, 
              lo[1] + self.borderSize / 2,
              hi[0] - lo[0] - self.borderSize,
              hi[1] - lo[1] - self.borderSize
          )
        )
        
      self.rects.push(rect);
    }

    const randNum = this.rng()
    if (depth > this.maxDepth || randNum > this.splitChance) {
      makeThisRect();
      return;
    }

    const splitX = this.rng() < this.xyBias;
    const splitPercent = this.rng() * 0.6 + 0.2;

    if (splitX) {
      const splitSize = (hi[0] - lo[0]) * splitPercent

      let smallX = (hi[0] - lo[0]) * splitPercent

      if (splitPercent > 0.5) {
        smallX = (hi[0] - lo[0]) * (1.0 - splitPercent)
      }
     

      if ((smallX - this.borderSize*2) < this.minCellSize) {
        makeThisRect();
        return;
      }

      this.splitRect([lo[0] + splitSize, lo[1]], hi, depth + 1);
      this.splitRect(lo, [lo[0] + splitSize, hi[1]], depth + 1);
    } else {
      const splitSize = splitPercent * (hi[1] - lo[1]);

      let smallY = (hi[1] - lo[1]) * splitPercent
      if (splitPercent > 0.5) {
        smallY = (hi[1] - lo[1]) * (1.0 - splitPercent)
      }

      if ((smallY - this.borderSize*2) < this.minCellSize) {
        makeThisRect();
        return;
      }

      this.splitRect([lo[0], lo[1] + splitSize], hi, depth + 1);
      this.splitRect(lo, [hi[0], lo[1] + splitSize], depth + 1);
    }
  }

  makeDesign(paper, params) {
    const {
      boundaryModel,
      borderSize,
      maxDepth,
      splitChance,
      xyBias,
      minCellSize
    } = params;

    this.paper = paper;

    this.rects = [];

    this.maxDepth = maxDepth;
    this.splitChance = splitChance;
    this.borderSize = borderSize;
    this.xyBias = xyBias;
    this.minCellSize = minCellSize;

    this.splitRect(
      [boundaryModel.bounds.topLeft.x - borderSize/2, boundaryModel.bounds.topLeft.y  - borderSize/2],
      [boundaryModel.bounds.bottomRight.x  + borderSize/2, boundaryModel.bounds.bottomRight.y + borderSize/2],
      0
    )

    return this.rects;
  }

  get designMetaParameters() {
    return [
      new RangeMetaParameter({
        title: "Border Size",
        min: 0.05,
        max: 0.5,
        value: 0.15,
        step: 0.01,
        name: "borderSize"
      }),
      new RangeMetaParameter({
        title: "Max Depth",
        min: 1,
        max: 10,
        value: 4,
        step: 1,
        name: "maxDepth"
      }),
      new RangeMetaParameter({
        title: "Split Chance",
        min: 0.1,
        max: 1.0,
        value: 0.99,
        step: 0.01,
        name: "splitChance"
      }),
      new RangeMetaParameter({
        title: "X/Y Bias",
        min: 0.0,
        max: 1.0,
        value: 0.5,
        step: 0.01,
        name: "xyBias"
      }),
      new RangeMetaParameter({
        title: "Min Cell Size",
        min: 0.1,
        max: 1,
        value: 0.1,
        step: 0.01,
        name: "minCellSize"
      })
    ];
  }
}
