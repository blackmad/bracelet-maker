import { MetaParameter, RangeMetaParameter } from "../../meta-parameter";
import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";

import Tactile from "../../tactile/tactile";

// http://isohedral.ca/other/Spirals/

export class InnerDesignTactile extends FastAbstractInnerDesign {
  makeDesign(paper: paper.PaperScope, params: any) {
    const { boundaryModel, outerModel, tilingType } = params;

    const height = outerModel.bounds.height;
    const width = outerModel.bounds.width;

    const paths: Array<paper.Path> = [];

    const zoom = 1.0;

    const tp = Tactile.tiling_types[tilingType];
    const tiling = new Tactile.IsohedralTiling(tp);

    const tilingParams = [];
    for (let i = 0; i < tiling.numEdgeShapes(); i++) {
      tilingParams.push(params[`tilingParam${i}`]);
    }
    tiling.setParameters( tilingParams );

    // setTilingType
    const edges = [];
    for (let idx = 0; idx < tiling.numEdgeShapes(); ++idx) {
      const ej = [
        { x: 0, y: 0 },
        { x: 1, y: 0 }
      ];
      edges.push(ej);
    }

    // cacheTileShape

    const tile_shape = [];

    for (let i of tiling.parts()) {
      const ej = edges[i.id];
      let cur = i.rev ? ej.length - 2 : 1;
      const inc = i.rev ? -1 : 1;

      for (let idx = 0; idx < ej.length - 1; ++idx) {
        tile_shape.push(Tactile.mul(i.T, ej[cur]));
        cur += inc;
      }
    }

    const asp = width / height;
    const h = 6.0 * zoom;
    const w = asp * h * zoom;
    const sc = height / (2 * h);
    const M = Tactile.mul(
      [1, 0, width / 2.0, 0, 1, height / 2.0],
      [sc, 0, 0, 0, -sc, 0]
    );

    for (let i of tiling.fillRegionBounds(
      -w - 2.0,
      -h - 2.0,
      w + 2.0,
      h + 2.0
    )) {
      const TT = i.T;
      const T = Tactile.mul(M, TT);

      //     const col = COLS[ tiling.getColour( i.t1, i.t2, i.aspect ) + 1 ];
      //     fill( col[0], col[1], col[2] );

      //     beginShape();
      const points = [];
      for (let v of tile_shape) {
        const P = Tactile.mul(T, v);
        points.push(new paper.Point(P.x, P.y));
      }
      paths.push(new paper.Path(points));
    }

    return paths;
  }

  get designMetaParameters(): Array<MetaParameter> {
    const makeTilingParam = (index) => {
      return new RangeMetaParameter({
        title: `Tiling Param ${index+1}`,
        min: 0,
        max: 2,
        value: 0,
        step: 0.001,
        name: `tilingParam${index}`,
        // showIf: (params) => {
        //   const tiling = new Tactile.IsohedralTiling(params.titleType);
        //   return tiling.numParameters() > index;
        // }
      })
    };

    return [
      new RangeMetaParameter({
        title: "Tiling Type",
        min: 0,
        max: Tactile.tiling_types.length - 1,
        value: 0,
        step: 1,
        name: "tilingType"
      }),
      makeTilingParam(0),
      makeTilingParam(1),
      makeTilingParam(2),
      makeTilingParam(3),
      makeTilingParam(4),
      makeTilingParam(5),
    ];
    //   new RangeMetaParameter({
    //     title: "Hash Width",
    //     min: 0.075,
    //     max: 0.75,
    //     value: 0.25,
    //     step: 0.05,
    //     name: "hashWidth"
    //   }),
    //   new RangeMetaParameter({
    //     title: "Start Noise Coeff 1",
    //     min: 0,
    //     max: 20,
    //     step: 0.1,
    //     value: 10,
    //     name: "initialNoiseRange1"
    //   }),
    //   new RangeMetaParameter({
    //     title: "Start Noise Coeff 2",
    //     min: 0,
    //     max: 20,
    //     step: 0.1,
    //     value: 10,
    //     name: "initialNoiseRange2"
    //   }),
    //   new RangeMetaParameter({
    //     title: "Noise Offset 1",
    //     min: 0.01,
    //     max: 1,
    //     step: 0.1,
    //     value: 0.5,
    //     name: "noiseOffset1"
    //   }),
    //   new RangeMetaParameter({
    //     title: "Noise Offset 2",
    //     min: 0.01,
    //     max: 1,
    //     step: 0.1,
    //     value: 0.75,
    //     name: "noiseOffset2"
    //   }),
    //   new RangeMetaParameter({
    //     title: "Noise Influence",
    //     min: 0,
    //     max: 1,
    //     step: 0.01,
    //     value: 0.5,
    //     name: "noiseInfluence"
    //   })
    // ];
  }
}
