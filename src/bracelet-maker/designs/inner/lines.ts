import { RangeMetaParameter, MetaParameter } from '../../meta-parameter';
import { randomLineEndpointsOnRectangle } from '../../utils/paperjs-utils';

import { AbstractExpandInnerDesign } from './abstract-expand-and-subtract-inner-design';

export class InnerDesignLines extends AbstractExpandInnerDesign {
  public allowOutline = false;

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

  public makePaths(paper: paper.PaperScope, params: any): paper.Point[][] {
    const { boundaryModel, outerModel, numLines } = params;

    const numRows = 1;
    const numCols = 2;

    const initialLines: paper.Point[][] = this.makeInitialPaths({
      paper,
      numLines,
      bounds: outerModel.bounds,
      numRows,
      numCols
    });
    const lines = [];

    const colOffset = outerModel.bounds.width / numCols;
    const rowOffset = outerModel.bounds.height / numRows;

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const startOfCellY = colOffset*col;
        const startOfCellX = rowOffset*row;

        const mirrorX = (point) => {
          // say cell size = 50
          // we have x = 110
          // we would want x to move to 140
          // x = 140, move to 110
          // get x within cell ()
          const np =  new paper.Point(
            startOfCellX + (colOffset - (point.x - colOffset*col)),
            point.y);
          // console.log(point.x, point.y, np.x, np.y);
          return np;
        };

        const mirrorY = (point) => {
          const np = new paper.Point(
            point.x,
            startOfCellY + (rowOffset - (point.y - rowOffset*row)));
            // console.log(point.x, point.y, np.x, np.y)
            //           return np;
        };

        const offsetPoint = (point) => {
          return new paper.Point(point.x + colOffset*col, point.y + rowOffset*row);
        };

        const transformPoint = (point) => {
          let newPoint = point;
          if (row % 2 === 0) {
            newPoint = mirrorX(newPoint);
          }
          if (col % 2 === 0) {
            newPoint = mirrorY(newPoint);
          }
          return offsetPoint(newPoint);
        };

        initialLines.forEach((line) => lines.push(
          line.map(transformPoint)
        ));
      }
    }
    console.log(initialLines);
    console.log(lines);

    return lines;
  }

  get pathDesignMetaParameters(): MetaParameter[] {
    return [
      new RangeMetaParameter({
        title: 'Num Lines',
        min: 1,
        max: 100,
        value: 20,
        step: 1,
        name: 'numLines'
      })
    ];
  }
}
