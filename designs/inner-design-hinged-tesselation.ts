import * as SimplexNoise from "simplex-noise";
import { MakerJsUtils } from "../makerjs-utils";

const makerjs = require("makerjs");

import {
  RangeMetaParameter,
  OnOffMetaParameter,
  MetaParameter
} from "../meta-parameter";
import { ModelMaker } from "../model";
import * as _ from "lodash";
import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";
const seedrandom = require("seedrandom");

export class InnerDesignHingedTesselationImpl extends FastAbstractInnerDesign {
  calculateCyclicTile(points, trapezoid, theta) {
    const tile1 = trapezoid;
    console.log(tile1);
    makerjs.model.originate(tile1);
    const boundaryMeasure = makerjs.measure.modelExtents(tile1);

    const tile2 = makerjs.model.rotate(makerjs.model.clone(trapezoid), 180, points[3])
    // makerjs.model.moveRelative(tile2, 
    //   [
    //     (boundaryMeasure.high[0] - boundaryMeasure.low[0]),
    //     -(boundaryMeasure.high[1] - boundaryMeasure.low[1])
    //   ]
    // )

    return { models: {
      tile1: tile1,
      tile2: tile2,
      // tile3: tile3
    }}
  }

  makeCyclicTrapezoid(radius) {
    const radians = _.times(4, () => this.rng() * Math.PI * 2)
    radians.sort()
    
    const points = radians.map((rads) => {
      const x = Math.cos(rads)*radius;
      const y = Math.sin(rads)*radius;
      return [x, y];
    });
    return [points, new makerjs.models.ConnectTheDots(true, points)];
  }

  makeDesign(params) {
    const {
      height = 2,
      width = 10,
      boundaryModel,
      shapeSize,
    } = params;
    const boundaryMeasure = makerjs.measure.modelExtents(boundaryModel);

    const [points, trapezoid] = this.makeCyclicTrapezoid(shapeSize/2);
    const tile = this.calculateCyclicTile(points, trapezoid, 0);
    return {
      models: [tile]
    };
  }
}

export class InnerDesignHingedTesselation implements ModelMaker {
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
        title: "Border Size",
        min: 0.1,
        max: 0.25,
        value: 0.1,
        step: 0.01,
        name: "borderSize"
      }),
      new RangeMetaParameter({
        title: "Shape Size",
        min: 0.2,
        max: 2,
        value: 0.4,
        step: 0.1,
        name: "shapeSize"
      })
    ];
  }

  public make(params: Map<string, any>): MakerJs.IModel {
    return new InnerDesignHingedTesselationImpl(params);
  }
}
