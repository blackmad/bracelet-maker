import * as _ from 'lodash';
import { Delaunay, Voronoi } from 'd3-delaunay';

import { RangeMetaParameter, MetaParameter, OnOffMetaParameter, SelectMetaParameter } from '../../meta-parameter';
import { FastAbstractInnerDesign } from './fast-abstract-inner-design';
import { randomPointInPolygon, bufferPointstoPathItem, approxShape } from '../../utils/paperjs-utils';
import ExtendPaperJs from 'paperjs-offset';

export class InnerDesignVoronoi extends FastAbstractInnerDesign {
  needSubtraction = true;
  allowOutline = true;
  canRound = true;

  makeRandomPoints({ paper, boundaryModel, rows, cols, numTotalPoints, numBorderPoints, mirror }) {
    const numPoints = numTotalPoints // (rows * cols);

    const colOffset = boundaryModel.bounds.width / cols;
    const rowOffset = boundaryModel.bounds.height / rows;

    const partialRect = new paper.Rectangle(boundaryModel.bounds.topLeft, new paper.Size(colOffset, rowOffset));

    const seedPoints = [];

    const addSeedPoint = (testPoint: paper.Point) => {
      let startR = 0
      let endR = rows
      let startC = 0
      let endC = cols
      if (rows > 1) {
        startR = -2;
        endR = rows + 2;
      }

      if (cols > 1) {
      startC = -2;
      endC = cols + 2;
    }

      for (let r = startR; r < endR; r++) {
        for (let c = startC; c < endC; c++) {
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

    for (let i = 0; i < numPoints; i++) {
      const testPoint = randomPointInPolygon(paper, partialRect, this.rng);
      addSeedPoint(testPoint);
    }

    if (numBorderPoints > 0) {
      console.log(approxShape(paper, boundaryModel, numBorderPoints));
      approxShape(paper, boundaryModel, numBorderPoints).forEach(addSeedPoint);
    }

    return seedPoints;
  }

  makeDesign(paper: paper.PaperScope, params) {
    ExtendPaperJs(paper);

    const { numPoints = 100, rows = 1, cols = 1,
      numBorderPoints = 0,
      smoothingType = 'None',
      smoothingFactor = 0.5,
      mirror = false,
      omitChance = 0.0,
    } = params;


    const boundaryModel: paper.PathItem = params.boundaryModel;

    const seedPoints = this.makeRandomPoints({
      paper,
      boundaryModel,
      rows,
      cols,
      numTotalPoints: numPoints,
      numBorderPoints,
      mirror
    })

    var delaunay = Delaunay.from(seedPoints);
    let cellPolygonIterator = delaunay.trianglePolygons();

    if (params.voronoi) {
      var voronoi = delaunay.voronoi([
        boundaryModel.bounds.x - params.borderSize,
        boundaryModel.bounds.y - params.borderSize,
        boundaryModel.bounds.x + boundaryModel.bounds.width + params.borderSize,
        boundaryModel.bounds.y + boundaryModel.bounds.height + params.borderSize
      ]);
      cellPolygonIterator = voronoi.cellPolygons();
    }

    const polys = [];
    for (const cellPolygon of cellPolygonIterator) {
      const points = cellPolygon.map(p => new paper.Point(p[0], p[1]));
      points.pop();
      const bufferedShape = bufferPointstoPathItem(paper, -params.borderSize, points);
      if (this.rng() > omitChance) {
        polys.push(bufferedShape);
      }
    }

    return Promise.resolve({paths: polys})
  }

  get designMetaParameters() {
    return [
      new RangeMetaParameter({
        title: 'Num Points',
        min: 3,
        max: 100,
        value: 20,
        step: 1,
        name: 'numPoints'
      }),
      new RangeMetaParameter({
        title: 'Border Points',
        min: 0,
        max: 100,
        value: 0,
        step: 1,
        name: 'numBorderPoints'
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
        title: 'Omit Chance',
        min: 0.00,
        max: 1.0,
        value: 0.0,
        step: 0.01,
        name: 'omitChance'
      }),
      new RangeMetaParameter({
        title: 'Border Size',
        min: 0.01,
        max: 0.5,
        value: 0.1,
        step: 0.01,
        name: 'borderSize'
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
