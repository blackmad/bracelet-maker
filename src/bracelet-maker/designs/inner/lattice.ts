import {
  OnOffMetaParameter,
  MetaParameter,
  RangeMetaParameter
} from "../../meta-parameter";
import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";

export class InnerDesignLattice extends FastAbstractInnerDesign {
  allowOutline = false;
  needSubtraction = true;
  needSeed = false;

  makeDesign(paper: paper.PaperScope, params) {
    const {
      boundaryModel,
      shapeHeight,
      shapeWidth,
      borderSize,
      yOffset,
      colOffset,
      rowOffset
    } = params;

    const cols = boundaryModel.bounds.width / shapeWidth;
    const rows = boundaryModel.bounds.height / shapeHeight + 1;

    let paths: paper.PathItem[] = [];
    let totalPath = null;

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c <= cols; c++) {
        const center = new paper.Point(
          (r % 2) * rowOffset * shapeWidth +
            boundaryModel.bounds.x +
            c * shapeWidth,
          yOffset +
            boundaryModel.bounds.y +
            (c % 2) * colOffset +
            r * shapeHeight
        );

        const possibleCircle = new paper.Path.Circle(center, shapeWidth);
        possibleCircle.scale(1, shapeWidth / shapeHeight);

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

          const innerCircle = new paper.Path.Circle(
            center,
            shapeWidth - borderSize
          );
          innerCircle.scale(1, shapeWidth / shapeHeight);

          const finalCircle = possibleCircle.subtract(innerCircle, {
            insert: false
          });
          if (totalPath == null) {
            totalPath = finalCircle;
          } else {
            totalPath = totalPath.unite(finalCircle, { insert: false });
          }
        }
      }
    }

    // if (params.invert) {
    //   return [totalPath]
    // } else {
    return Promise.resolve({
      paths: [boundaryModel.subtract(totalPath, { insert: false })]
    });
    // }
  }

  get designMetaParameters() {
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
        title: "Shape Width",
        min: 0.1,
        max: 2.0,
        value: 0.5,
        step: 0.01,
        name: "shapeWidth"
      }),
      new RangeMetaParameter({
        title: "Shape Height",
        min: 0.1,
        max: 3.0,
        value: 0.5,
        step: 0.01,
        name: "shapeHeight"
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
        value: 0.5,
        step: 0.01,
        name: "rowOffset"
      }),
      new RangeMetaParameter({
        title: "Col Offset",
        min: 0.0,
        max: 1.0,
        value: 0.0,
        step: 0.01,
        name: "colOffset"
      })
      // new OnOffMetaParameter({
      //   title: "Invert",
      //   value: false,
      //   name: "invert"
      // }),
    ];
  }
}
