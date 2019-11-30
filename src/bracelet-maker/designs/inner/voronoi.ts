import * as _ from 'lodash';
import { Delaunay, Voronoi } from 'd3-delaunay';

import { RangeMetaParameter, MetaParameter, OnOffMetaParameter, SelectMetaParameter } from '../../meta-parameter';
import { FastAbstractInnerDesign } from './fast-abstract-inner-design';
import { randomPointInPolygon, bufferShape, bufferShapeToPoints, roundCorners, approxShape } from '../../utils/paperjs-utils';
import ExtendPaperJs from 'paperjs-offset';

export class InnerDesignVoronoi extends FastAbstractInnerDesign {
  needSubtraction = true;
  allowOutline = true;

  makeRandomPoints({ paper, boundaryModel, rows, cols, numTotalPoints, mirror }) {
    const numPoints = numTotalPoints / (rows * cols);

    const colOffset = boundaryModel.bounds.width / cols;
    const rowOffset = boundaryModel.bounds.height / rows;

    const partialRect = new paper.Rectangle(boundaryModel.bounds.topLeft, new paper.Size(colOffset, rowOffset));

    const seedPoints = [];

    for (let i = 0; i < numPoints; i++) {
      const testPoint = randomPointInPolygon(paper, partialRect, this.rng);

      for (let r = 0; r < rows + 1; r++) {
        for (let c = 0; c < cols + 1; c++) {
          let x = testPoint.x + colOffset * c;
          let y = testPoint.y + rowOffset * r;

          if (mirror && (c % 2 == 1)) {
            x = (colOffset - testPoint.x) + colOffset * c;
          }

          if (mirror && (r % 2 == 1)) {
            y = (rowOffset - testPoint.y) + rowOffset * r;
          }

          seedPoints.push([x, y]);
        }
      }
    }

    return seedPoints;
  }

  makeDesign(paper: paper.PaperScope, params) {
    ExtendPaperJs(paper);

    const { numPoints = 100, rows = 1, cols = 1,
      smoothingType = 'None',
      smoothingFactor = 0.5,
      mirror = false
    } = params;


    const boundaryModel: paper.PathItem = params.boundaryModel;

    const seedPoints = this.makeRandomPoints({
      paper,
      boundaryModel,
      rows,
      cols,
      numTotalPoints: numPoints,
      mirror
    })

    var delaunay = Delaunay.from(seedPoints);
    let cellPolygonIterator = delaunay.trianglePolygons();

    if (params.voronoi) {
      var voronoi = delaunay.voronoi([
        boundaryModel.bounds.x,
        boundaryModel.bounds.y,
        boundaryModel.bounds.x + boundaryModel.bounds.width,
        boundaryModel.bounds.y + boundaryModel.bounds.height
      ]);
      cellPolygonIterator = voronoi.cellPolygons();
    }

    const polys = [];
    for (const cellPolygon of cellPolygonIterator) {
      const points = cellPolygon.map(p => new paper.Point(p[0], p[1]));
      points.pop();
      const bufferedShape = bufferShape(paper, -params.borderSize, points)
      if (bufferedShape) {
        if (smoothingType != 'None') {
          if (smoothingType == 'Homegrown') {
            polys.push(roundCorners({ paper, path: bufferedShape, radius: smoothingFactor }))
          } else {
            bufferedShape.smooth({ type: smoothingType.toLowerCase(), factor: smoothingFactor })
            polys.push(bufferedShape);
          }
        } else {
          bufferedShape.strokeJoin = 'round';
          polys.push(bufferedShape);
        }
      }
    }

    return polys;
  }

  get designMetaParameters(): Array<MetaParameter> {
    return [
      new RangeMetaParameter({
        title: 'Num Points',
        min: 3,
        max: 100,
        value: 20,
        step: 1,
        name: 'numPoints'
      }),
      // new RangeMetaParameter({
      //   title: 'Min Cell Size',
      //   min: 0.05,
      //   max: 1,
      //   value: 0.55,
      //   step: 0.01,
      //   name: 'minPathLength'
      // }),
      new RangeMetaParameter({
        title: 'Border Size',
        min: 0.01,
        max: 0.5,
        value: 0.1,
        step: 0.01,
        name: 'borderSize'
      }),
      new SelectMetaParameter({
        title: 'Smoothing Type',
        value: 'None',
        options: ['None', 'Homegrown', 'Catmull-Rom', 'Geometric'],
        name: 'smoothingType'
      }),
      new RangeMetaParameter({
        title: 'Smoothing Factor',
        min: 0.001,
        max: 0.2,
        value: 0.01,
        step: 0.001,
        name: 'smoothingFactor'
      }),
      new RangeMetaParameter({
        title: 'Rows',
        min: 1,
        max: 20,
        value: 1,
        step: 1,
        name: 'rows'
      }),
      new RangeMetaParameter({
        title: 'Cols',
        min: 1,
        max: 20,
        value: 1,
        step: 1,
        name: 'cols'
      }),
      new OnOffMetaParameter({
        title: 'Mirror',
        value: true,
        name: 'mirror'
      }),
      new OnOffMetaParameter({
        title: 'Voronoi',
        value: true,
        name: 'voronoi'
      })
    ];
  }
}
