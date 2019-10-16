import * as _ from 'lodash';
import { Delaunay, Voronoi } from 'd3-delaunay';

import { RangeMetaParameter, MetaParameter, OnOffMetaParameter } from '../../meta-parameter';
import { FastAbstractInnerDesign } from './fast-abstract-inner-design';
import { randomPointInPolygon, bufferShape } from '../../utils/paperjs-utils';
import ExtendPaperJs from 'paperjs-offset';

export class InnerDesignVoronoi extends FastAbstractInnerDesign {
  needSubtraction = false;
  allowOutline = true;

  makeDesign(paper: paper.PaperScope, params) {
    ExtendPaperJs(paper);

    const seedPoints = [];
    const { numPoints = 100 } = params;
    const boundaryModel: paper.PathItem = params.boundaryModel;
    for (let i = 0; i < numPoints; i++) {
      const testPoint = randomPointInPolygon(paper, boundaryModel, this.rng);
      seedPoints.push([testPoint.x, testPoint.y]);
    }

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
        polys.push(bufferedShape);
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
      new OnOffMetaParameter({
        title: 'Voronoi',
        value: true,
        name: 'voronoi'
      })
    ];
  }
}
