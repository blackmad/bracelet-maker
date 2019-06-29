import { SimplexNoiseUtils } from "../../utils/simplex-noise-utils";
import { MetaParameter, RangeMetaParameter } from "../../meta-parameter";
import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";

var makerjs = require("makerjs");

export class InnerDesignCirclesXVera extends FastAbstractInnerDesign {
  useFastRound = false;

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
      rowOffset,
      centerXNoiseDenom1,
      centerXNoiseDenom2,
      centerYNoiseDenom1,
      centerYNoiseDenom2
    } = params;

    const rowCellSize = width / cols;
    const widthCellSize = height / rows;

    const paths = [];

    const boundaryExtents = makerjs.measure.modelExtents(boundaryModel);
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        const center = [
          (r % 2) * rowOffset * rowCellSize +
            c * rowCellSize +
            SimplexNoiseUtils.noise2DInRange(
              this.simplex,
              c / centerXNoiseDenom1,
              c / centerXNoiseDenom2,
              -rowCellSize * 2,
              rowCellSize * 2
            ),
          yOffset +
            (r * widthCellSize +
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
      { paths: paths },
      borderSize
    );
    if (true) {
      return makerjs.model.combineSubtraction(
        makerjs.model.clone(boundaryModel),
        expandedModel
      );
    } else {
      // const intersectedModel = makerjs.model.combineIntersection(
      //   makerjs.model.clone(safeCone),
      //   expandedModel
      // );
      // this.models = {};
      // // this.models.intersectedModels = intersectedModels;
      // this.models.oo = makerjs.model.outline(expandedModel, 0.01);
    }
  }
  
  get designMetaParameters(): Array<MetaParameter> {
    return [
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
        title: "Border Size",
        min: 0.1,
        max: 0.25,
        value: 0.1,
        step: 0.01,
        name: "borderSize"
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
        min: 0.1,
        max: 3.0,
        value: 0.5,
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
      })
    ];
  }
}
