import * as SimplexNoise from "simplex-noise";
import { SimplexNoiseUtils } from "../simplex-noise-utils";
import { ModelMaker } from "../model";
import { MetaParameter, RangeMetaParameter } from "../meta-parameter";
import Angle from "./angle";
import * as _ from 'lodash';

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
      outerModel,
      _numRows,
      initialRotation
    } = params;

    const numRows = _numRows - 1;
    console.log(boundaryModel);

                /***** START SAFE CONE *****/
                console.log(boundaryModel.models.c.models.cuff.origin);

                const safeCone = new makerjs.models.ConnectTheDots(true, [boundaryModel.models.c.models.cuff.paths.p1.origin, 
                  [
                      20 * Math.cos(Angle.fromDegrees(boundaryModel.models.c.models.cuff.paths.p1.startAngle).radians) + boundaryModel.models.c.models.cuff.paths.p1.origin[0] ,
                      20 * Math.sin(Angle.fromDegrees(boundaryModel.models.c.models.cuff.paths.p1.startAngle).radians) + boundaryModel.models.c.models.cuff.paths.p1.origin[1] ,
                  ], 
                  [
                      20 * Math.cos(Angle.fromDegrees(boundaryModel.models.c.models.cuff.paths.p1.endAngle).radians)  + boundaryModel.models.c.models.cuff.paths.p1.origin[0] ,
                      20 * Math.sin(Angle.fromDegrees(boundaryModel.models.c.models.cuff.paths.p1.endAngle).radians) + boundaryModel.models.c.models.cuff.paths.p1.origin[1]
                  ]
              ])
              
              /***** END SAFE CONE *****/

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
    
    console.log((startArc.radius - endArc.radius))
    const hexSizeOrig = ((endArc.radius - startArc.radius) / numRows) * 0.5;

    const arcLengthOrig = Math.abs(Angle.fromDegrees(arcs[0].startAngle).radians - Angle.fromDegrees(arcs[0].endAngle).radians) * arcs[0].radius;
    const numHexesOrig = Math.round(arcLengthOrig / (hexSizeOrig * 2));

    const models = {}
    var outlineModel = {}
    for (let r = 0; r <= numRows; r++) {
      const dilation = 1 + ((Math.abs(startArc.radius - endArc.radius) / startArc.radius) * (r/numRows));
      const hexSize = hexSizeOrig //* dilation;

      const radius = startArc.radius + (Math.abs(startArc.radius - endArc.radius) * (r / numRows))
      const extraArcLengthInRadians = r % 2 ? (hexSize*2*(r+1)) / (radius - startArc.radius): 0;
      console.log('hexSize', hexSize);
      console.log('radius', radius);
      console.log('extraArc', extraArcLengthInRadians);

      const numHexes = r %2 ? numHexesOrig + 2: numHexesOrig;

      const startAngle = startArc.startAngle + (Math.abs(startArc.startAngle - endArc.startAngle) * (r / numRows)) - extraArcLengthInRadians
      const endAngle = startArc.endAngle + (Math.abs(startArc.endAngle - endArc.endAngle) * (r / numRows)) + extraArcLengthInRadians
      const arc = new makerjs.paths.Arc(arcs[0].origin, radius, startAngle, endAngle);

      var hex = new makerjs.models.Polygon(6, hexSize, initialRotation);

      const offset = r % 2

      var row = makerjs.layout.cloneToRow(hex, numHexes - offset, 0);
      makerjs.layout.childrenOnPath(row, arc, 0);

      models[r.toString()] = row;

      if (r == 0 || r == numRows) {
        _.each(row.models, (model) => {
          outlineModel = makerjs.model.combineUnion(makerjs.model.scale(makerjs.model.clone(model), 1.6), outlineModel)
        });
      }
    }

    const tmpModel = { models: {
      shapes: {models: models},
    }}

    this.models = {
      design: tmpModel
     // design: makerjs.model.combineIntersection(tmpModel, safeCone),
      outline: outlineModel
    }
    
    console.log(this.models);

    this.units = makerjs.unitType.Inch;
  }
}

export class InnerDesignArcGrid implements ModelMaker {
  get metaParameters(): Array<MetaParameter> {
    return [
      // new RangeMetaParameter({
      //   title: "Seed",
      //   min: 1,
      //   max: 10000,
      //   value: 1,
      //   step: 1,
      //   name: "seed"
      // }),
      // new RangeMetaParameter({
      //   title: "Cols",
      //   min: 1,
      //   max: 10,
      //   value: 5,
      //   step: 1,
      //   name: "cols"
      // }),
      new RangeMetaParameter({
        title: "Rows",
        min: 1,
        max: 10,
        value: 5,
        step: 1,
        name: "_numRows"
      }),
      new RangeMetaParameter({
        title: "initialRotation",
        min: 0,
        max: 180,
        value: 30,
        step: 1,
        name: "initialRotation"
      })
    ];
  }

  public make(params: Map<string, any>): MakerJs.IModel {
    return new InnerDesignArcGridImpl(params);
  }
}
