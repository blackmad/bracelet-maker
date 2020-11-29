import { RangeMetaParameter, MetaParameter, OnOffMetaParameter } from "../../meta-parameter";
import { bufferPath, flattenArrayOfPathItems, randomLineEndpointsOnRectangle } from "../../utils/paperjs-utils";
import * as _ from "lodash";
import { SimplexNoiseUtils } from "../../utils/simplex-noise-utils";

import { FastAbstractInnerDesign } from "./fast-abstract-inner-design";
import {MazePatternMaker1} from './mazeMaker1';
import { addToDebugLayer } from '@/bracelet-maker/utils/debug-layers';
import { cascadedUnion } from '@/bracelet-maker/utils/cascaded-union';

export class InnerDesignMaze1 extends FastAbstractInnerDesign {
    canRound = true;

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
            mirrorCols,
            mirrorRows,
            omitTileChance
          } = params;


        const labelsToSquares = new MazePatternMaker1({
            rows,
            cols,
            rowRepeat,
            colRepeat,
            rng: this.rng,
            mirrorCols,
            mirrorRows,
            maxChainSize,
            idealMinChainSize,
        }).makeDesign();

        let allPaths: paper.PathItem[] = [];
        _.mapValues(labelsToSquares, (squares) => {
            if (this.rng() < omitTileChance) {
                return [];
            }
            const pathSquares = squares.map((points) => {
                const paperPoints = points.map(p => 
                    new paper.Point(p)                
                    .multiply(new paper.Point(boundaryModel.bounds.width, boundaryModel.bounds.height))
                    .add(boundaryModel.bounds.topLeft)
                );
                
                const scaledPath = new paper.Path(paperPoints)
                scaledPath.closePath();
                addToDebugLayer(paper, "squares", scaledPath.clone());
                return scaledPath;
            });
            const unionedPaths = cascadedUnion(pathSquares);
            const explodedUnionedPaths = flattenArrayOfPathItems(paper, unionedPaths);
            const bufferedPaths = explodedUnionedPaths.map(path => bufferPath(paper, -borderSize, path));
            bufferedPaths.forEach(p => {
                addToDebugLayer(paper, "bufferedPaths", p);
            })

            allPaths = [...allPaths, ...bufferedPaths]
            return bufferedPaths;
        });

        return Promise.resolve({ paths: allPaths });
    }

  get designMetaParameters() {
    return [
      new RangeMetaParameter({
        title: "Num Rows",
        min: 1,
        max: 100,
        value: 5,
        step: 1,
        name: "rows",
      }),
      new RangeMetaParameter({
        title: "Num Cols",
        min: 1,
        max: 100,
        value: 8,
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
        value: 0.1,
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