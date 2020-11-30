// still some joinign issues:
// http://localhost:8080/#/newPlayground/StraightCuffOuter/InnerDesignMaze1?StraightCuffOuter.debug=false&StraightCuffOuter.height=2&StraightCuffOuter.wristCircumference=6.9&StraightCuffOuter.forearmCircumference=7.2&InnerDesignMaze1.debug=false&InnerDesignMaze1.safeBorderWidth=0.25&InnerDesignMaze1.seed=10&InnerDesignMaze1.rows=2&InnerDesignMaze1.cols=3&InnerDesignMaze1.rowRepeat=1&InnerDesignMaze1.colRepeat=2&InnerDesignMaze1.borderSize=0.06&InnerDesignMaze1.maxChainSize=8&InnerDesignMaze1.idealMinChainSize=3&InnerDesignMaze1.mirrorRows=false&InnerDesignMaze1.mirrorCols=true&InnerDesignMaze1.omitTileChance=0&InnerDesignMaze1.shouldSmooth=false&InnerDesignMaze1.smoothingFactor=0.8

import { RangeMetaParameter, OnOffMetaParameter } from "../../meta-parameter";
import {
  bufferPath,
  simplifyPathToPoints,
} from "../../utils/paperjs-utils";
import * as _ from "lodash";
import randomColor from "randomcolor";

import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";
import { MazePatternMaker1 } from "./mazeMaker1";
import { addToDebugLayer } from "../../utils/debug-layers";

export class InnerDesignMaze1 extends FastAbstractInnerDesign {
  canRound = true;
  allowOutline = true;

  makeDesign(paper: paper.PaperScope, params) {
    const {
      rows = 1,
      cols = 1,
      borderSize = 0,
      boundaryModel,
      colRepeat,
      rowRepeat,
      maxChainSize,
      idealMinChainSize,
      minChainSize,
      mirrorCols,
      mirrorRows,
      omitTileChance,
      rowTileBoundary,
      colTileBoundary,
    } = params;

    const mazeMaker = new MazePatternMaker1({
      rows,
      cols,
      rowRepeat,
      colRepeat,
      rng: this.rng,
      mirrorCols,
      mirrorRows,
      maxChainSize,
      idealMinChainSize,
      triangleChance: this.rng(),
      leftRightTriangleChance: this.rng(),
      minChainSize,
      omitTileChance,
      rowTileBoundary,
      colTileBoundary,
    });
    const labelsToSquares = mazeMaker.makeDesign();

    let allPaths: paper.PathItem[] = [];
    _.mapValues(labelsToSquares, (squares) => {
      const color = new paper.Color(randomColor());

      let unionedPath: paper.Path | undefined;
      const pathSquares = squares.map((points) => {
        const paperPoints = points.map((p) => new paper.Point(p));

        const path = new paper.Path(paperPoints);
        path.closePath();
        path.style.fillColor = color;
        if (!unionedPath) {
          unionedPath = path;
        } else {
          unionedPath = unionedPath.unite(path) as paper.Path;
        }

        addToDebugLayer(paper, "paths", path.clone());
        return path;
      });

      addToDebugLayer(paper, "unionedPaths", unionedPath.clone());
      // console.log(getPointsFromPath(unionedPath));
      const simplifiedPathPoints = simplifyPathToPoints(unionedPath);
      // console.log(simplifiedPathPoints);
      const simplifiedPath = new paper.Path(simplifiedPathPoints);

      simplifiedPath.scale(
        boundaryModel.bounds.width / mazeMaker.finalCols,
        boundaryModel.bounds.height / mazeMaker.finalRows,
        new paper.Point(0, 0)
      );
      simplifiedPath.translate(boundaryModel.bounds.topLeft);
      addToDebugLayer(paper, "fixedPath", simplifiedPath);
      const bufferedPath = bufferPath(paper, -borderSize, simplifiedPath);

      addToDebugLayer(paper, "bufferedPaths", bufferedPath.clone());

      allPaths = [...allPaths, bufferedPath];
      // return bufferedPaths;
    });

    return Promise.resolve({ paths: allPaths });
  }

  get designMetaParameters() {
    return [
      new RangeMetaParameter({
        title: "Num Rows",
        min: 1,
        max: 10,
        value: 2,
        step: 1,
        name: "rows",
      }),
      new RangeMetaParameter({
        title: "Num Cols",
        min: 1,
        max: 10,
        value: 4,
        step: 1,
        name: "cols",
      }),
      new RangeMetaParameter({
        title: "Row Repeats",
        min: 1,
        max: 10,
        value: 2,
        step: 1,
        name: "rowRepeat",
      }),
      new RangeMetaParameter({
        title: "Col Repeats",
        min: 1,
        max: 10,
        value: 2,
        step: 1,
        name: "colRepeat",
      }),
      new RangeMetaParameter({
        title: "Border Size",
        min: 0.01,
        max: 0.5,
        value: 0.06,
        step: 0.01,
        name: "borderSize",
      }),
      new RangeMetaParameter({
        title: "Max chain size",
        min: 1,
        max: 10,
        value: 5,
        step: 1,
        name: "maxChainSize",
      }),
      new RangeMetaParameter({
        title: "Ideal min chain size",
        min: 1,
        max: 10,
        value: 3,
        step: 1,
        name: "idealMinChainSize",
      }),
      new RangeMetaParameter({
        title: "Min chain size",
        min: 0,
        max: 10,
        value: 0,
        step: 1,
        name: "minChainSize",
      }),
      new OnOffMetaParameter({
        title: "mirrorRows",
        value: true,
        name: "mirrorRows",
      }),
      new OnOffMetaParameter({
        title: "mirrorCols",
        value: true,
        name: "mirrorCols",
      }),
      new OnOffMetaParameter({
        title: "rowTileBoundary",
        value: true,
        name: "rowTileBoundary",
      }),
      new OnOffMetaParameter({
        title: "colTileBoundary",
        value: false,
        name: "colTileBoundary",
      }),
      new RangeMetaParameter({
        title: "Omit Tile Chance",
        min: 0.0,
        max: 1.0,
        value: 0.0,
        step: 0.001,
        name: "omitTileChance",
      }),
    ];
  }
}
