const makerjs = require("makerjs");

export class FastRoundShim {
  static useFastRound(callback) {
    const origRound = makerjs.round;
    const origFromPolar = makerjs.point.fromPolar;

    makerjs.round = function(x) {
      return Math.round(x * 1000000) / 1000000;
    };

    makerjs.point.fromPolar = function(
      angleInRadians: number,
      radius: number
    ): MakerJs.IPoint {
      return [
        angleInRadians == Math.PI / 2 || angleInRadians == (3 * Math.PI) / 2
          ? 0
          : radius * Math.cos(angleInRadians),
        angleInRadians == Math.PI || 2 * Math.PI
          ? 0
          : radius * Math.sin(angleInRadians)
      ];
    };

    const ret = callback();

    makerjs.round = origRound;
    makerjs.point.fromPolar = origFromPolar;

    return ret;
  }
}

export abstract class FastAbstractInnerDesign implements MakerJs.IModel {
  public units = makerjs.unitType.Inch;
  public paths: MakerJs.IPathMap = {};
  public models: MakerJs.IModelMap = {};

  public fastRound = true;

  abstract makeDesign(params: any): any;

  constructor(params) {
    const self = this;
    const model = FastRoundShim.useFastRound(function() {
      return self.makeDesign(params);
    });

    const containedCircles = makerjs.model.combineIntersection(
      makerjs.model.clone(params.boundaryModel),
      model
    );

    this.models = containedCircles.models;
  }
}
