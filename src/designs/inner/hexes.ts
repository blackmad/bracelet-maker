import { SimplexNoiseUtils } from "../../utils/simplex-noise-utils";
import {
  MetaParameter,
  RangeMetaParameter,
  OnOffMetaParameter
} from "../../meta-parameter";
import Angle from "../../utils/angle";
import * as _ from "lodash";
import { MakerJsUtils } from "../../utils/makerjs-utils";
import { ModelMaker } from "../../model-maker"
import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";

var makerjs = require("makerjs");

export class InnerDesignHexes implements ModelMaker {
  make(params) {
    const {
      boundaryModel,
      outerModel,
      _numRows,
      stretchWidth,
      filletOutlineRadius,
      forceContainment
    } = params;

    const numRows = _numRows - 1;

    const boundaryArcs = [];
    const boundaryWalkOptions = {
      onPath: function(wp) {
        if (wp.pathContext.type === "arc") {
          boundaryArcs.push(wp.pathContext);
        }
      }
    };

    makerjs.model.walk(boundaryModel, boundaryWalkOptions);

    const outerArcs = [];
    const outerWalkOptions = {
      onPath: function(wp) {
        if (wp.pathContext.type === "arc") {
          outerArcs.push(wp.pathContext);
        }
      }
    };

    makerjs.model.walk(outerModel, outerWalkOptions);

    const startArc = boundaryArcs[0];
    const endArc = boundaryArcs[1];

    const outerStartArc = outerArcs[0];
    const outerEndArc = outerArcs[1];

    let numVirtualRows = numRows;
    if (forceContainment) {
      numVirtualRows += 2;
    }
    const rowHeight =
      (outerEndArc.radius - outerStartArc.radius) / numVirtualRows;
    console;
    const hexSize = rowHeight * 0.5;

    const startLength = MakerJsUtils.arcLength(startArc);
    const numHexes = Math.round(startLength / (hexSize * 2 * stretchWidth));

    const endLength = MakerJsUtils.arcLength(endArc);

    const models = {};
    let outlineModel = {};
    for (let r = 0; r <= numRows; r++) {
      const dilation = 1 + (r / numRows) * (endLength / startLength - 1);

      let virtualRow = r;
      if (forceContainment) {
        virtualRow += 1;
      }
      const radius =
        outerStartArc.radius +
        Math.abs(outerStartArc.radius - outerEndArc.radius) *
          (virtualRow / numVirtualRows);
      const extraArcLengthInDegrees =
        r % 2
          ? Angle.fromRadians((hexSize * stretchWidth) / radius).degrees
          : 0;

      const offset = r % 2 ? 1 : 0;

      const startAngle = startArc.startAngle + extraArcLengthInDegrees;
      const endAngle = startArc.endAngle - extraArcLengthInDegrees;
      const arc = new makerjs.paths.Arc(
        startArc.origin,
        radius,
        startAngle,
        endAngle
      );

      let hex = new makerjs.models.Polygon(6, hexSize, 30);
      if (stretchWidth != 1) {
        hex = makerjs.model.distort(hex, stretchWidth * dilation, 1);
      }
      console.log(hex);
      console.log(numHexes - offset);

      const row = makerjs.layout.cloneToRow(hex, numHexes - offset, 0);
      makerjs.layout.childrenOnPath(row, arc, 0);
      console.log(row);

      models[r.toString()] = row;

      if (r == 0 || r == numRows) {
        _.each(row.models, model => {
          outlineModel = makerjs.model.combineUnion(
            makerjs.model.scale(makerjs.model.clone(model), 1.7),
            outlineModel
          );
        });
      }
    }
    console.log(models);
    const tmpModel = { models: models };
    console.log(tmpModel);

    if (filletOutlineRadius > 0) {
      makerjs.model.originate(outlineModel);

      makerjs.model.findChains(outlineModel).forEach((outlineChain, index) => {
        outlineModel["models"]["fillets" + index] = makerjs.chain.fillet(
          outlineChain,
          filletOutlineRadius
        );
      });

      console.log(outlineModel);
    }

    return {
      models: {
        design: tmpModel,
        outline: outlineModel
      }
    };
  }

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
      }),
      new RangeMetaParameter({
        title: "filletOutlineRadius",
        min: 0.0,
        max: 0.2,
        value: 0.1,
        step: 0.01,
        name: "filletOutlineRadius"
      }),
      new OnOffMetaParameter({
        title: "Force Containment",
        name: "forceContainment",
        value: false
      })
    ];
  }
}
