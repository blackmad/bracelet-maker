import { RangeMetaParameter, MetaParameter } from "../../meta-parameter";
import {
  randomLineEndpointsOnRectangle,
} from "../../utils/paperjs-utils";
import * as _ from "lodash";
import { SimplexNoiseUtils } from '../../utils/simplex-noise-utils';


import { AbstractExpandInnerDesign } from "./abstract-expand-and-subtract-inner-design";

// jsts faster? https://gist.github.com/rclark/6168912
// jsts this https://gist.github.com/rclark/6123614

export class InnerDesignGrid extends AbstractExpandInnerDesign {
  public allowOutline = false;
  public needSubtraction = true;

  public makeInitialPaths({
    paper,
    numLines,
    bounds,
    numCols,
    numRows
  }: {
    paper: paper.PaperScope;
    numLines: number;
    bounds: paper.Rectangle;
    numRows: number;
    numCols: number;
  }): paper.Point[][] {
    const lines: paper.Point[][] = [];

    const newBounds = new paper.Rectangle(
      bounds.topLeft,
      new paper.Size(bounds.width / numCols, bounds.height / numRows)
    );

    for (let c = 0; c < numLines; c++) {
      const line = randomLineEndpointsOnRectangle(paper, newBounds, this.rng);
      lines.push(line);
    }

    return lines;
  }

  public async makePaths(paper: paper.PaperScope, params: any): Promise<paper.Point[][]> {
    const { boundaryModel, numRows, numCols } = params;

    const lines: paper.Point[][] = [];

    const cellSizeX = boundaryModel.bounds.width / numCols;
    const cellSizeY = boundaryModel.bounds.height / numRows;

    for (let r = -1; r <= numRows + 1; r++) {
      const noise = 
        SimplexNoiseUtils.noise2DInRange(
          this.simplex, r * 1, r * 1, -cellSizeY/2, cellSizeY/2
        )

      lines.push([
        new paper.Point(0, cellSizeY * r + noise),
        new paper.Point(boundaryModel.bounds.width, cellSizeY * r)
      ])
    }

    for (let c = -1; c <= numCols + 1; c++) {
      const noise = 
        SimplexNoiseUtils.noise2DInRange(
          this.simplex, c * 1, c * 1, -cellSizeX/2, cellSizeX/2
        )

      const otherNoise = 
        SimplexNoiseUtils.noise2DInRange(
          this.simplex, c * 1, c * 1, -boundaryModel.bounds.height, boundaryModel.bounds.height
        )
      lines.push([
        new paper.Point(cellSizeX * c + noise , 0),
        new paper.Point(cellSizeX * c, boundaryModel.bounds.height + otherNoise)
      ])
    }

    return lines.map(shape => shape.map(p => p.add(boundaryModel.bounds.topLeft)));
  }

  get pathDesignMetaParameters() {
    return [
      new RangeMetaParameter({
        title: "Num Rows",
        min: 1,
        max: 100,
        value: 5,
        step: 1,
        name: "numRows"
      }),
      new RangeMetaParameter({
        title: "Num Cols",
        min: 1,
        max: 100,
        value: 8,
        step: 1,
        name: "numCols"
      }),

    ];
  }
}
