import * as SimplexNoise from "simplex-noise";
import { SimplexNoiseUtils } from "../simplex-noise-utils";
import { ModelMaker } from "../model";
import { MetaParameter, RangeMetaParameter } from "../meta-parameter";
import Angle from "./angle";

var makerjs = require("makerjs");

export class InnerDesignArcGridImpl implements MakerJs.IModel {
  public units = makerjs.unitType.Inch;
  public paths: MakerJs.IPathMap = {};
  public models: MakerJs.IModelMap = {};

  constructor(params) {
    const {
      height = 2,
      width = 10,
      boundaryModel,
      outerModel
    } = params;
    console.log(boundaryModel);

    const arcs = [];
    var walkOptions = {
      onPath: function(wp) {
        if (wp.pathContext.type === "arc") {
          arcs.push(wp.pathContext);
        }
      }
    };

    makerjs.model.walk(outerModel, walkOptions);
    console.log(arcs);


    const startArc = arcs[0];
    const endArc = arcs[1];
    
    const numRows = 4;
    console.log((startArc.radius - endArc.radius))
    const hexSizeOrig = ((endArc.radius - startArc.radius) / numRows) * 0.5;

    const arcLengthOrig = Math.abs(Angle.fromDegrees(arcs[0].startAngle).radians - Angle.fromDegrees(arcs[0].endAngle).radians) * arcs[0].radius;
    const numHexesOrig = Math.round(arcLengthOrig / (hexSizeOrig * 2));

    const models = {}
    for (let r = 0; r <= numRows; r++) {

      const radius = startArc.radius + (Math.abs(startArc.radius - endArc.radius) * (r / numRows))
      // TODO: fix this to be correcter
      // const extraArcLengthInRadians = r % 2 ? hexSize / (2*Math.PI*radius): 0;
      const extraArcLengthInRadians = r % 2 ? 2: 0;

      const numHexes = r %2 ? numHexesOrig + 2: numHexesOrig;

      const startAngle = startArc.startAngle + (Math.abs(startArc.startAngle - endArc.startAngle) * (r / numRows)) - extraArcLengthInRadians
      const endAngle = startArc.endAngle + (Math.abs(startArc.endAngle - endArc.endAngle) * (r / numRows)) + extraArcLengthInRadians
      const arc = new makerjs.paths.Arc(arcs[0].origin, radius, startAngle, endAngle);

      const dilation = 1 + ((Math.abs(startArc.radius - endArc.radius) / startArc.radius) * (r/numRows));
      const hexSize = hexSizeOrig * dilation;

      var hex = new makerjs.models.Polygon(6, hexSize, 30);

      const offset = r % 2

      var row = makerjs.layout.cloneToRow(hex, numHexes - offset, 0);
      makerjs.layout.childrenOnPath(row, arc, 0);

      models[r.toString()] = row;
    }

    this.models = {
      shapes: {models: models},
    }

    // this.models = makerjs.model.expandPaths({models: models}, 0.1).models;
    console.log(this.models);

    // const rowCellSize = width/cols;
    // const widthCellSize = height/rows;

    // const paths = [];

    // const boundaryExtents = makerjs.measure.modelExtents(boundaryModel);
    // for (var r = 0; r < rows; r++) {
    //     for (var c = 0; c < cols; c++) {
    //         const center = [
    //             ((r%2) * rowOffset*rowCellSize) + c*rowCellSize + SimplexNoiseUtils.noise2DInRange(simplex, c/centerXNoiseDenom1, c/centerXNoiseDenom2, -rowCellSize*2, rowCellSize*2),
    //              yOffset + (r*widthCellSize + SimplexNoiseUtils.noise2DInRange(simplex, r/centerYNoiseDenom1, r/centerYNoiseDenom2, -widthCellSize*2, widthCellSize*2))
    //         ];

    //         const circleSize = SimplexNoiseUtils.noise2DInRange(simplex, r/10, c/10, minCircleSize, maxCircleSize);

    //         const possibleCircle = new makerjs.paths.Circle(center, circleSize);
    //         const shouldUseCircle = makerjs.measure.isMeasurementOverlapping(boundaryExtents, makerjs.measure.modelExtents({paths: [possibleCircle]}));
    //         // if (true) {
    //         if (shouldUseCircle) {
    //             paths.push(possibleCircle);
    //         }
    //     }
    // }

    // const expandedModels = makerjs.model.expandPaths({paths: paths}, borderSize);
    // this.models = expandedModels.models;
    // this.models = makerjs.model.combineSubtraction(
    //     makerjs.model.clone(boundaryModel),
    //     expandedModels
    // ).models;

    this.units = makerjs.unitType.Inch;
  }
}

export class InnerDesignArcGrid implements ModelMaker {
  get metaParameters(): Array<MetaParameter> {
    return [
      new RangeMetaParameter({
        title: "Seed",
        min: 1,
        max: 10000,
        value: 1,
        step: 1,
        name: "seed"
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

  public make(params: Map<string, any>): MakerJs.IModel {
    return new InnerDesignArcGridImpl(params);
  }
}
