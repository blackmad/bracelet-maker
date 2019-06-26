import * as _ from "lodash";
import { RangeMetaParameter } from "../meta-parameter";

const makerjs = require("makerjs");

const seedrandom = require("seedrandom");

export abstract class AbstractExpandAndSubtractInnerDesign
  implements MakerJs.IModel {
  public units = makerjs.unitType.Inch;
  public paths: MakerJs.IPathMap = {};
  public models: MakerJs.IModelMap = {};

  rng: () => number;

  abstract makePaths(params): MakerJs.IPath[];

  constructor(params) {
    const { boundaryModel, borderSize, seed } = params;

    const boundaryRect = new makerjs.models.Rectangle(boundaryModel);
    makerjs.model.originate(boundaryRect);

    this.rng = seedrandom(seed.toString());

    const lines = { paths: this.makePaths(params) };

    const expandedModel = makerjs.model.expandPaths(
      {
        models: {
          lines
        }
      },
      borderSize,
      1
    );

    this.models.design = makerjs.model.combineSubtraction(
      makerjs.model.clone(boundaryModel),
      expandedModel
    );
  }

  get metaParameters() {
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
        min: 0.04,
        max: 0.25,
        value: 0.04,
        step: 0.01,
        name: "borderSize"
      })
    ];
  }
}
