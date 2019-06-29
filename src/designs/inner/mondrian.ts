const makerjs = require("makerjs");

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

  splitRect(lo, hi, depth = 0) {
    const self = this;
    function makeThisRect() {
      const rect = makerjs.model.move(
        new makerjs.models.Rectangle(
          hi[0] - lo[0] - self.borderSize,
          hi[1] - lo[1] - self.borderSize
        ),
        [lo[0] + self.borderSize / 2, lo[1] + self.borderSize / 2]
      );
      self.rects.push(rect);
    }

    if (depth > this.maxDepth || this.rng() > this.splitChance) {
      makeThisRect();
      return;
    }

    const splitX = this.rng() < this.xyBias;
    const splitPercent = this.rng() * 0.6 + 0.2;

    if (splitX) {
      const splitSize = splitPercent * (hi[0] - lo[0]);

      console.log(splitSize, this.minCellSize)
      if ((splitSize - this.borderSize*2) < this.minCellSize) {
        makeThisRect();
        return;
      }

      this.splitRect([lo[0] + splitSize, lo[1]], hi, depth + 1);
      this.splitRect(lo, [lo[0] + splitSize, hi[1]], depth + 1);
    } else {
      const splitSize = splitPercent * (hi[1] - lo[1]);

      console.log(splitSize, this.minCellSize)
      if ((splitSize - this.borderSize*2) < this.minCellSize) {
        makeThisRect();
        return;
      }

      this.splitRect([lo[0], lo[1] + splitSize], hi, depth + 1);
      this.splitRect(lo, [hi[0], lo[1] + splitSize], depth + 1);
    }
  }

  makeDesign(params) {
    const {
      boundaryModel,
      borderSize,
      maxDepth,
      splitChance,
      xyBias,
      minCellSize
    } = params;

    this.rects = [];

    this.maxDepth = maxDepth;
    this.splitChance = splitChance;
    this.borderSize = borderSize;
    this.xyBias = xyBias;
    this.minCellSize = minCellSize;

    const boundaryMeasure = makerjs.measure.modelExtents(boundaryModel);
    console.log(boundaryMeasure);

    this.splitRect(boundaryMeasure.low, boundaryMeasure.high, 0);

    const gridModel = { models: {} };
    _(this.rects).each((rect, i) => (gridModel.models[i.toString()] = rect));

    return gridModel;
  }

  get designMetaParameters(): Array<MetaParameter> {
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
        value: 0.7,
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
        value: 0.25,
        step: 0.01,
        name: "minCellSize"
      })
    ];
  }
}
