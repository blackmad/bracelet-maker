import { SimplexNoiseUtils } from "../../utils/simplex-noise-utils";
import {
  MetaParameter,
  OnOffMetaParameter,
  RangeMetaParameter,
  SelectMetaParameter
} from "../../meta-parameter";
import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";
import { AbstractExpandAndSubtractInnerDesign } from './abstract-expand-and-subtract-inner-design'
import { MakerJsUtils } from "../../utils/makerjs-utils";

var makerjs = require("makerjs");

export class InnerDesignGrid extends FastAbstractInnerDesign {
  allowOutline = true;
  requiresSafeConeClamp = false;
  needSubtraction = true;

  dist(x1, y1, x2, y2): number {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  getVector(center, position, maxLength): MakerJs.IPoint {
    var distance = this.dist(center[0], center[1], position[0], position[1]);
    var length = Math.min(distance, maxLength * 1.5); // constrain(distance, 0, maxLength * 1.5);
    var angle = Math.atan2(center[1] - position[1], center[0] - position[0]);
    return [
      center[0] + Math.cos(angle) * length,
      center[1] + Math.sin(angle) * length
    ];
  }

  // getCorners(center, length) {
  //   return [
  //     [center[0], center[1]],
  //     [center[0] + length, center[1]],
  //     [center[0] + length, center[1] + length],
  //     [center[0], center[1] + length]
  //   ];
  // }

  getCorners(center, length) {
    const offset = 0.02;
    center[0] += length / 2;
    center[1] += length / 2;
    return [
      [center[0] + offset, center[1] + offset],
      [center[0] + length - offset, center[1] + offset],
      [center[0] + length - offset, center[1] + length - offset],
      [center[0] + offset, center[1] + length - offset]
    ];
  }

  drawShape(center, lineLength, attractorCenter) {
    var corners = this.getCorners(center, lineLength);
    const self = this;
    var getVectorAtPosition = function(position) {
      return self.getVector(position, attractorCenter, lineLength);
    };
    const newPoints = corners.map(function(corner) {
      return getVectorAtPosition(corner);
    });
    const box = new makerjs.models.ConnectTheDots(true, newPoints);
    return box;
    // return makerjs.model.outline(box, 0.1);
  }

  makeDesign(params) {
    const { height, width } = params;
    const lineLength = Math.min(width, height) / 20;
    const model = { models: {} }
    const attractorCenter = [width/2, height/2];
    for (var x = 0; x < width; x += lineLength) {
      for (var y = 0; y < height*1.25; y += lineLength) {
        model.models[x+ '-' + y] = this.drawShape([x, y], lineLength, attractorCenter);
      }
    }
    return model;
  }

  makePaths(params) {
    const model = this.makeDesign(params);
    makerjs.model.simplify(model);
    const paths = MakerJsUtils.collectPaths(model);
    console.log(paths.length);
    return paths;
  }

  get designMetaParameters(): Array<MetaParameter> {
      return []
  }
}
