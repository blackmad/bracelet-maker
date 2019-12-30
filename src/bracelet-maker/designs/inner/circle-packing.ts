import {
  RangeMetaParameter,
  OnOffMetaParameter,
  MetaParameter
} from "../../meta-parameter";
import * as _ from "lodash";
import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";
import {
  SimpleCircle,
  randomLineOnRectangle,
  checkCircleCircleIntersection
} from "../../utils/paperjs-utils";

export class InnerDesignCirclePacking extends FastAbstractInnerDesign {
  allowOutline = true;
  requiresSafeConeClamp = true;
  needSubtraction = true;
  smoothOutline = false;

  circleDoesntTouchLines(
    testCircle: paper.Path.Circle,
    lines: paper.Path.Line[]
  ): boolean {
    return _.every(lines, l => !testCircle.intersects(l));
  }

  circleDoesntTouchCircles(
    testCircle: SimpleCircle,
    circles: SimpleCircle[],
    borderSize: number
  ): boolean {
    return _.every(
      circles,
      c => !checkCircleCircleIntersection(c, testCircle, borderSize)
    );
  }

  circleInsideModel(
    testCircle: paper.Path.Circle,
    boundaryRect: paper.Rectangle
  ): boolean {
    return testCircle.isInside(boundaryRect);
  }

  makeDesign(paper, params) {
    let {
      height = 2,
      width = 10,
      boundaryModel,
      minCircleSize,
      maxCircleSize,
      borderSize,
      numLines
    } = params;

    const goingOutside =
      params.boundaryModel.bounds.height > params.outerModel.bounds.height;

    let boundaryRect = boundaryModel.bounds;
    if (goingOutside) {
      // doesn't work without whole circles
      params.constrainCircles = true;

      // looks dumb if circles at the left/right edges have a sharp edge with the outside
      // so fix it such that they can always have a full outline
      const offsetPoint = new paper.Point(params.outlineSize, 0);
      boundaryRect = new paper.Rectangle(
        boundaryRect.topLeft.add(offsetPoint),
        boundaryRect.bottomRight.subtract(offsetPoint)
      );
      console.log(boundaryRect);
    }

    const circles: paper.Path.Circle[] = [];
    const simpleCircles: SimpleCircle[] = [];
    const outline: paper.Path.Circle[] = [];

    var radius = maxCircleSize;

    const lines = _.times(numLines, () => {
      return randomLineOnRectangle(paper, boundaryRect, this.rng);
    });

    const triesPerRadius = 50;
    while (radius > minCircleSize) {
      for (let i = 0; i < triesPerRadius; i++) {
        const center = new paper.Point(this.rng() * width, this.rng() * height);
        const testCircle = new paper.Path.Circle(center, radius);
        const simpleTestCircle = new SimpleCircle(center.x, center.y, radius);
        if (
          // this checks that we're at least inside the bounding box around the boundary
          // testCircle.bounds.intersects(boundaryRect) &&
          // if we are constraining circles, make sure everything is inside
          (!params.constrainCircles ||
            this.circleInsideModel(testCircle, boundaryRect)) &&
          this.circleDoesntTouchCircles(
            simpleTestCircle,
            simpleCircles,
            borderSize
          ) &&
          this.circleDoesntTouchLines(testCircle, lines)
        ) {
          circles.push(testCircle);
          simpleCircles.push(simpleTestCircle);

          const outlineCircle = new paper.Path.Circle(
            center,
            radius + params.outlineSize
          );
          outline.push(outlineCircle);
        }
      }
      radius *= 0.99;
    }

    return Promise.resolve({
      paths: circles,
      outlinePaths: outline
    });
  }

  get designMetaParameters() {
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
        title: "Outline size (in)",
        min: 0.05,
        max: 0.4,
        value: 0.1,
        step: 0.01,
        name: "outlineSize"
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
