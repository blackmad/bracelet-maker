import * as SimplexNoise from "simplex-noise";
import { SimplexNoiseUtils } from "../simplex-noise-utils";
import { ModelMaker } from "../model";
import { MetaParameter, RangeMetaParameter } from "../meta-parameter";
import Angle from "./angle";
import * as _ from 'lodash';
import { start } from "repl";
import { MakerJsUtils } from "../makerjs-utils";

var makerjs = require("makerjs");

export class InnerDesignHexesImpl implements MakerJs.IModel {
  public units = makerjs.unitType.Inch;
  public paths: MakerJs.IPathMap = {};
  public models: MakerJs.IModelMap = {};

  constructor(params) {
    const {
      height = 2,
      width = 10,
      boundaryModel,
      safeCone,
      outerModel,
      _numRows,
      stretchWidth
    } = params;

    const numRows = _numRows - 1;

    const boundaryArcs = [];
    var walkOptions = {
      onPath: function(wp) {
        if (wp.pathContext.type === "arc") {
          boundaryArcs.push(wp.pathContext);
        }
      }
    };

    makerjs.model.walk(boundaryModel, walkOptions);

    const outerArcs = [];
    var walkOptions = {
      onPath: function(wp) {
        if (wp.pathContext.type === "arc") {
          outerArcs.push(wp.pathContext);
        }
      }
    };

    makerjs.model.walk(outerModel, walkOptions);

    const startArc = boundaryArcs[0];
    const endArc = boundaryArcs[1];

    const outerStartArc = outerArcs[0];
    const outerEndArc = outerArcs[1];
    
    const rowHeight = (outerEndArc.radius - outerStartArc.radius) / numRows
    const hexSize = rowHeight * 0.5;

    const startLength = MakerJsUtils.arcLength(startArc)
    const numHexes = Math.round(startLength / (hexSize * 2 * stretchWidth));

    const endLength = MakerJsUtils.arcLength(endArc)

    const models = {}
    var outlineModel = {}
    for (let r = 0; r <= numRows; r++) {
      const dilation = 1 + ((r/numRows) * ((endLength / startLength) - 1))

      const radius = outerStartArc.radius + (Math.abs(outerStartArc.radius - outerEndArc.radius) * (r / numRows))
      const extraArcLengthInDegrees = r % 2 ? Angle.fromRadians(hexSize*stretchWidth/radius).degrees : 0;

      const offset = r % 2 ? 1 : 0;

      const startAngle = startArc.startAngle + extraArcLengthInDegrees
      const endAngle = startArc.endAngle - extraArcLengthInDegrees
      const arc = new makerjs.paths.Arc(startArc.origin, radius, startAngle, endAngle);

      var hex = new makerjs.models.Polygon(6, hexSize, 30);
      if (stretchWidth != 1) {
        hex = makerjs.model.distort(hex, stretchWidth*dilation, 1)
      }
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
      outline: outlineModel
    }    

    this.units = makerjs.unitType.Inch;
  }
}

export class InnerDesignHexes implements ModelMaker {
  get metaParameters(): Array<MetaParameter> {
    return [
      new RangeMetaParameter({
        title: "Rows",
        min: 3,
        max: 10,
        value: 5,
        step: 1,
        name: "_numRows"
      }),
      new RangeMetaParameter({
        title: "stretchWidth",
        min: 0.5,
        max: 3,
        value: 1,
        step: 0.01,
        name: "stretchWidth"
      })
    ];
  }

  public make(params: Map<string, any>): MakerJs.IModel {
    return new InnerDesignHexesImpl(params);
  }
}
