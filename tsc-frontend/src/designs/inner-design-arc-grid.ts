import * as SimplexNoise from "simplex-noise";
import { SimplexNoiseUtils } from "../simplex-noise-utils";
import { ModelMaker } from "../model";
import { MetaParameter, RangeMetaParameter } from "../meta-parameter";
import Angle from "./angle";
import * as _ from 'lodash';
import { start } from "repl";

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
      sides,
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

    const boundaryArcs = [];
    var walkOptions = {
      onPath: function(wp) {
        if (wp.pathContext.type === "arc") {
          boundaryArcs.push(wp.pathContext);
        }
      }
    };

    makerjs.model.walk(boundaryModel, walkOptions);
    console.log(boundaryArcs);

    const outerArcs = [];
    var walkOptions = {
      onPath: function(wp) {
        if (wp.pathContext.type === "arc") {
          outerArcs.push(wp.pathContext);
        }
      }
    };

    makerjs.model.walk(outerModel, walkOptions);
    console.log(boundaryArcs);

    const startArc = boundaryArcs[0];
    const endArc = boundaryArcs[1];

    const outerStartArc = outerArcs[0];
    const outerEndArc = outerArcs[1];
    
    const hexSizeOrig = ((outerEndArc.radius - outerStartArc.radius) / numRows) * 0.5;

    const arcLengthOrig = Math.abs(Angle.fromDegrees(startArc.startAngle).radians - Angle.fromDegrees(startArc.endAngle).radians) * startArc.radius;
    const numHexes = Math.round(arcLengthOrig / (hexSizeOrig * 2));

    const models = {}
    var outlineModel = {}
    for (let r = 0; r <= numRows; r++) {
      const hexSize = hexSizeOrig;

      console.log(startArc.startAngle)
      const radius = outerStartArc.radius + (Math.abs(outerStartArc.radius - outerEndArc.radius) * (r / numRows))
      const extraArcLengthInDegrees = r % 2 ? Angle.fromRadians(hexSize/radius).degrees : 0;

      const offset = r % 2 ? 1 : 0;

      const startAngle = startArc.startAngle + extraArcLengthInDegrees
      const endAngle = startArc.endAngle - extraArcLengthInDegrees
      const arc = new makerjs.paths.Arc(startArc.origin, radius, startAngle, endAngle);

      var hex = new makerjs.models.Polygon(6, hexSize, 30);
      // var hex = {paths: [new makerjs.paths.Circle(hexSize) ]}

      var row = makerjs.layout.cloneToRow(hex, numHexes - offset, 0);
      makerjs.layout.childrenOnPath(row, arc, 0);

      models[r.toString()] = row;

      if (r == 0 || r == numRows) {
        _.each(row.models, (model) => {
          outlineModel = makerjs.model.combineUnion(makerjs.model.scale(makerjs.model.clone(model), 1.7), outlineModel)
        });
      }
    }

    const tmpModel = { models: {
      shapes: {models: models},
    }}

    this.models = {
      design: tmpModel,
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
        min: 3,
        max: 10,
        value: 5,
        step: 1,
        name: "_numRows"
      })
    ];
  }

  public make(params: Map<string, any>): MakerJs.IModel {
    return new InnerDesignArcGridImpl(params);
  }
}
