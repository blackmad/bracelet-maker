import { SimplexNoiseUtils } from "../../utils/simplex-noise-utils";
import { OnOffMetaParameter, MetaParameter, RangeMetaParameter } from "../../meta-parameter";
import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";

export class InnerDesignCirclesXVera extends FastAbstractInnerDesign {
  allowOutline = false;
  needSubtraction = true;

  makeDesign(paper, params): paper.PathItem[] {
    const {
      boundaryModel,
      cols,
      rows,
      minCircleSize,
      maxCircleSize,
      borderSize,
      yOffset,
      colOffset,
      rowOffset,
      centerXNoiseDenom1,
      centerXNoiseDenom2,
      centerYNoiseDenom1,
      centerYNoiseDenom2,
      patternNoiseInfluence
    } = params;


    const rowCellSize = boundaryModel.bounds.width / cols;
    const widthCellSize = boundaryModel.bounds.height / rows;

    let paths: paper.PathItem[] = [];
    let totalPath = null;

    for (var r = 0; r <= rows; r++) {
      for (var c = 0; c <= cols; c++) {
        const center = new paper.Point(
          (r % 2) * rowOffset * rowCellSize + boundaryModel.bounds.x +
            c * rowCellSize +
            patternNoiseInfluence *
              SimplexNoiseUtils.noise2DInRange(
                this.simplex,
                c / centerXNoiseDenom1,
                c / centerXNoiseDenom2,
                -rowCellSize * 2,
                rowCellSize * 2
              ),
          yOffset + boundaryModel.bounds.y +
            (c % 2) * colOffset +
            (r * widthCellSize +
              patternNoiseInfluence *
                SimplexNoiseUtils.noise2DInRange(
                  this.simplex,
                  r / centerYNoiseDenom1,
                  r / centerYNoiseDenom2,
                  -widthCellSize * 2,
                  widthCellSize * 2
                ))
        );

        const circleSize = SimplexNoiseUtils.noise2DInRange(
          this.simplex,
          r / 10,
          c / 10,
          minCircleSize,
          maxCircleSize
        );

        const possibleCircle = new paper.Path.Circle(center, circleSize);
        const shouldUseCircle =
          possibleCircle.isInside(boundaryModel.bounds) ||
          possibleCircle.intersects(boundaryModel);
        if (shouldUseCircle) {
          // this makes a nice layered look
          // if (totalPath == null) {
          //   totalPath = possibleCircle;
          // } else {
          //   totalPath = totalPath.unite(possibleCircle);
          // }
          // totalPath = totalPath.subtract(new paper.Path.Circle(center, circleSize - borderSize))

          const innerCircle = new paper.Path.Circle(center, circleSize - borderSize);
          const finalCircle = possibleCircle.subtract(innerCircle, {insert: false});
          if (totalPath == null) {
            totalPath = finalCircle
          } else {
            totalPath = totalPath.unite(finalCircle, {insert: false});
          }
        }
      }
    }

    if (params.invert) {
      return [totalPath]
    } else {
      return [boundaryModel.subtract(totalPath, {insert: false})];
    }
  }

  get designMetaParameters(): Array<MetaParameter> {
    return [
      new RangeMetaParameter({
        title: "Border Size",
        min: 0.04,
        max: 0.25,
        value: 0.04,
        step: 0.01,
        name: "borderSize"
      }),
      new RangeMetaParameter({
        title: "Cols",
        min: 1,
        max: 10,
        value: 5,
        step: 1,
        name: "cols"
      }),
      new RangeMetaParameter({
        title: "Rows",
        min: 1,
        max: 10,
        value: 5,
        step: 1,
        name: "rows"
      }),
      new RangeMetaParameter({
        title: "Min Circle Size",
        min: 0.1,
        max: 2.0,
        value: 0.5,
        step: 0.01,
        name: "minCircleSize"
      }),
      new RangeMetaParameter({
        title: "Max Circle Size",
        min: 0.1,
        max: 3.0,
        value: 1.5,
        step: 0.01,
        name: "maxCircleSize"
      }),
      new RangeMetaParameter({
        title: "Pattern Noise Influence",
        min: 0.0,
        max: 2.0,
        value: 1.0,
        step: 0.01,
        name: "patternNoiseInfluence"
      }),
      new RangeMetaParameter({
        title: "Center X Noise Demon 1",
        min: 1,
        max: 400,
        value: 20,
        step: 1,
        name: "centerXNoiseDenom1"
      }),
      new RangeMetaParameter({
        title: "Center X Noise Demon 2",
        min: 1,
        max: 400,
        value: 20,
        step: 1,
        name: "centerXNoiseDenom2"
      }),
      new RangeMetaParameter({
        title: "Center Y Noise Demon 1",
        min: 1,
        max: 400,
        value: 20,
        step: 1,
        name: "centerYNoiseDenom1"
      }),
      new RangeMetaParameter({
        title: "Center Y Noise Demon 2",
        min: 1,
        max: 400,
        value: 10,
        step: 1,
        name: "centerYNoiseDenom2"
      }),
      new RangeMetaParameter({
        title: "Y Offset",
        min: 0.0,
        max: 3.0,
        value: 0.0,
        step: 0.01,
        name: "yOffset"
      }),
      new RangeMetaParameter({
        title: "Row Offset",
        min: 0.0,
        max: 1.0,
        value: 0.2,
        step: 0.01,
        name: "rowOffset"
      }),
      new RangeMetaParameter({
        title: "Col Offset",
        min: 0.0,
        max: 1.0,
        value: 0.2,
        step: 0.01,
        name: "colOffset"
      }),
      new OnOffMetaParameter({
        title: "Invert",
        value: false,
        name: "invert"
      }),
    ];
  }
}
