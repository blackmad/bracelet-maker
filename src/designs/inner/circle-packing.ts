import { MakerJsUtils } from "../../utils/makerjs-utils";

const makerjs = require("makerjs");

import {
  RangeMetaParameter,
  OnOffMetaParameter,
  MetaParameter
} from "../../meta-parameter";
import * as _ from "lodash";
import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";

export class InnerDesignCirclePacking extends FastAbstractInnerDesign {
  allowOutline = true;
  requiresSafeConeClamp = true;
  needSubtraction = true;
  useFastRound = true;

  circleDoesntTouchLines(
    testCircle: MakerJs.paths.Circle,
    lines: MakerJs.paths.Line[]
  ): boolean {
    return _.every(
      lines,
      l => !MakerJsUtils.checkCircleLineIntersection(testCircle, l)
    );
  }

  circleDoesntTouchCircles(
    testCircle: MakerJs.paths.Circle,
    circles: MakerJs.paths.Circle[],
    borderSize: number
  ): boolean {
    return _.every(
      circles,
      c =>
        !MakerJsUtils.checkCircleCircleIntersection(c, testCircle, borderSize)
    );
  }

  circleInsideModel(
    testCircle: MakerJs.paths.Circle,
    boundaryModel: MakerJs.IModel
  ): boolean {
    return !MakerJsUtils.checkPathIntersectsModel(testCircle, boundaryModel);
  }

  makeDesign(params) {
    let {
      height = 2,
      width = 10,
      boundaryModel,
      minCircleSize,
      maxCircleSize,
      borderSize,
      numLines,
    } = params;
    const constrainCircles = params.constrainCircles || !params.forceContainment;

    console.log(JSON.stringify(boundaryModel));
    const boundaryMeasure = makerjs.measure.modelExtents(boundaryModel);

    const circles: MakerJs.paths.Circle[] = [];

    var radius = maxCircleSize;
    console.log(boundaryMeasure);

    const boundaryRect = new makerjs.models.Rectangle(boundaryModel);

    const lines = _.times(numLines, () => {
      return MakerJsUtils.randomLineInRectangle(boundaryRect, this.rng);
    });

    const pathMap = {}
    const triesPerRadius = 200;
    while (radius > minCircleSize) {
      for (let i = 0; i < triesPerRadius; i++) {
        const center = [this.rng() * width, this.rng() * height];
        const testCircle = new makerjs.paths.Circle(center, radius);
        if (
          // this checks that we're at least inside the bounding box around the boundary
          MakerJsUtils.checkPathMeasureOverlap(testCircle, boundaryMeasure) &&
          // if we are constraining circles, make sure everything is inside
          (!constrainCircles ||
            this.circleInsideModel(testCircle, boundaryModel)) &&
          this.circleDoesntTouchCircles(testCircle, circles, borderSize) &&
          this.circleDoesntTouchLines(testCircle, lines)
        ) {
          circles.push(testCircle);
          pathMap[circles.length.toString()] = testCircle;
        }
      }
      radius *= 0.99;
    }

    return {
      models: {
        // boundaryModel: boundaryModel
      },
      paths: pathMap
    };
  }

  get designMetaParameters(): Array<MetaParameter> {
    return [
      new RangeMetaParameter({
        title: "Border Size",
        min: 0.1,
        max: 0.25,
        value: 0.1,
        step: 0.01,
        name: "borderSize"
      }),
      new RangeMetaParameter({
        title: "Min Circle Size",
        min: 0.02,
        max: 2.0,
        value: 0.02,
        step: 0.01,
        name: "minCircleSize"
      }),
      new RangeMetaParameter({
        title: "Max Circle Size",
        min: 0.05,
        max: 3.0,
        value: 0.75,
        step: 0.01,
        name: "maxCircleSize"
      }),
      new RangeMetaParameter({
        title: "Num Invisible Lines",
        min: 0,
        max: 10,
        value: 1,
        step: 1,
        name: "numLines"
      }),
      new OnOffMetaParameter({
        title: "ConstrainCircles",
        value: false,
        name: "constrainCircles"
      })
    ];
  }
}
