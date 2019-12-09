import { RangeMetaParameter, MetaParameter } from '../../meta-parameter';
import { randomLineEndpointsOnRectangle } from '../../utils/paperjs-utils';
import * as jsts from 'jsts';
import * as _ from 'lodash';

import { AbstractExpandInnerDesign } from './abstract-expand-and-subtract-inner-design';

// jsts fast? https://gist.github.com/rclark/6168912
// jsts slow? https://gist.github.com/rclark/6123614

function paperPointsToLineString(points: paper.Point[]) {
  return {
    "type": "LineString",
    "coordinates": 
      points.map((point) => [point.y, point.x])
  }
}

function paperPointsToPolygon(points: paper.Point[]) {
  return {
    "type": "Polygon",
    "coordinates": 
      [points.map((point) => [point.y, point.x])]
  }
}

export class InnerDesignLines extends AbstractExpandInnerDesign {
  public allowOutline = false;

  makeDesign(paper: paper.PaperScope, params): paper.PathItem[] {
    const lines = this.makePaths(paper, params);
    // @ts-ignore
    const polygonizer = new jsts.operation.polygonize.Polygonizer();
    const reader = new jsts.io.GeoJSONReader();

    const geojsonLineStrings = lines.map(paperPointsToLineString);
    const geojsonBBox = paperPointsToLineString([
      params.boundaryModel.bounds.topLeft,
      params.boundaryModel.bounds.bottomLeft,
      params.boundaryModel.bounds.bottomRight,
      params.boundaryModel.bounds.topRight,
      params.boundaryModel.bounds.topLeft
    ]);

    const geoms = geojsonLineStrings.map((l) => reader.read(l));


    let  cleaned = null;
    geoms.forEach(function (geom, i, array) {
      if (i === 0) { cleaned = geom; }
      else { cleaned = cleaned.union(geom); }
  });

    cleaned = cleaned.union(reader.read(geojsonBBox));

    polygonizer.add(cleaned);
    var polygons = polygonizer.getPolygons().array_;
    
    const paperPolys = polygons.map((_polygon: jsts.geom.Polygon) => {
      const polygon = _polygon.buffer(-params.lineWidth/2, null, null);
      if (polygon) {
        const coords = polygon.getCoordinates();
        const points = coords.map((c) => new paper.Point(c.y, c.x))
        return new paper.Path(points);
      } else {
        return null;
      }
    });
    return _.filter(paperPolys, (p) => !!p);
  }

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
    const numCols = 1;

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
        const startOfCellY = colOffset * col;
        const startOfCellX = rowOffset * row;

        const mirrorX = (point) => {
          // say cell size = 50
          // we have x = 110
          // we would want x to move to 140
          // x = 140, move to 110
          // get x within cell ()
          const np = new paper.Point(
            startOfCellX + (colOffset - (point.x - colOffset * col)),
            point.y);
          // console.log(point.x, point.y, np.x, np.y);
          return np;
        };

        const mirrorY = (point) => {
          const np = new paper.Point(
            point.x,
            startOfCellY + (rowOffset - (point.y - rowOffset * row)));
          // console.log(point.x, point.y, np.x, np.y)
          return np;
        };

        const offsetPoint = (point) => {
          return new paper.Point(point.x + colOffset * col, point.y + rowOffset * row);
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

        initialLines.forEach((line) => {
          lines.push(
            line.map(transformPoint)
          )
        });
      }
    }

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
