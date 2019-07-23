import { SimplexNoiseUtils } from "../../utils/simplex-noise-utils";
import { MetaParameter, RangeMetaParameter } from "../../meta-parameter";
import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";
import { MakerJsUtils } from "../../utils/makerjs-utils";
// import { AbstractExpandAndSubtractInnerDesign } from "./abstract-expand-and-subtract-inner-design";

var makerjs = require("makerjs");

export class InnerDesignCirclesXVera extends FastAbstractInnerDesign {
  useFastRound = false;
  allowOutline = true;

  makeDesign(params): MakerJs.IModel {
    const {
      height = 2,
      width = 10,
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

    const rowCellSize = width / cols;
    const widthCellSize = height / rows;

    let paths: MakerJs.IPath[] = [];

    const boundaryExtents = makerjs.measure.modelExtents(boundaryModel);
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        const center = [
          (r % 2) * rowOffset * rowCellSize +
            c * rowCellSize +
            patternNoiseInfluence *
              SimplexNoiseUtils.noise2DInRange(
                this.simplex,
                c / centerXNoiseDenom1,
                c / centerXNoiseDenom2,
                -rowCellSize * 2,
                rowCellSize * 2
              ),
          yOffset +
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
        ];

        const circleSize = SimplexNoiseUtils.noise2DInRange(
          this.simplex,
          r / 10,
          c / 10,
          minCircleSize,
          maxCircleSize
        );

        const possibleCircle = new makerjs.paths.Circle(center, circleSize);
        const shouldUseCircle = makerjs.measure.isMeasurementOverlapping(
          boundaryExtents,
          makerjs.measure.modelExtents({ paths: [possibleCircle] })
        );

        if (shouldUseCircle) {
          paths.push(possibleCircle);
        }
      }
    }

    const expandedModel = makerjs.model.expandPaths(
      MakerJsUtils.pathArrayToModel(paths),
      borderSize,
      1
    );
    console.log(expandedModel);
    return {
      models: {
        expanded: expandedModel
        // circles: MakerJsUtils.pathArrayToModel(paths)}}
      }
    };
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
      })
    ];
  }
}
