import { ShapeMaker } from './utils/shape-maker';

import { SimplexNoiseUtils } from '../../utils/simplex-noise-utils';
import {
  MetaParameter,
  OnOffMetaParameter,
  RangeMetaParameter,
  SelectMetaParameter
} from '../../meta-parameter';
import { FastAbstractInnerDesign } from './fast-abstract-inner-design';
import * as _ from 'lodash';

export class InnerDesignPerlinDots extends FastAbstractInnerDesign {
  allowOutline = false;
  requiresSafeConeClamp = false;
  needSubtraction = true;

  makeDesign(paper: paper.PaperScope, params) {
    const {
      shapeSize,
      bufferWidth,
      xNoiseCoefficient,
      yNoiseCoefficient,
      shapeName,
      boundaryModel,
      chanceProbability
    } = params;

    let models = [];

    const gridCellSizeX = shapeSize + bufferWidth * 2;
    const gridCellSizeY = shapeSize + bufferWidth * 2;
    let rows = boundaryModel.bounds.width / gridCellSizeX;
    let cols = boundaryModel.bounds.height / gridCellSizeY;
   
    if (shapeName == 'AlternatingTriangles') {
      rows*=3;
      cols*=3;
    }

    function makeRow(c) {
      const rowModels = [];
      for (var r = -1; r <= rows + 1; r++) {
        const chance = SimplexNoiseUtils.noise2DInRange(
          this.simplex,
          r * xNoiseCoefficient,
          c * yNoiseCoefficient,
          0,
          1
        );
        if (chance > chanceProbability) {
          continue;
        }

        let path = null;

        if (shapeName == 'AlternatingTriangles') {
          if (r % 2 == 0) {
            path = new paper.Path([
              new paper.Point(0, 0),
              new paper.Point(0, shapeSize),
              new paper.Point(shapeSize, 0),
              new paper.Point(0, 0)
            ]);
          } else {
            path = new paper.Path([
              new paper.Point(shapeSize, 0),
              new paper.Point(shapeSize, shapeSize),
              new paper.Point(0, shapeSize),
              new paper.Point(shapeSize, 0)
            ]);
            path.translate(new paper.Point(bufferWidth/2, bufferWidth/2))
          }

          const fakeRow = r % 2 == 1 ? r -1 : r;

          path.translate(
            new paper.Point(
              boundaryModel.bounds.x + fakeRow * (bufferWidth/2 + shapeSize/2),
              boundaryModel.bounds.y + c * (bufferWidth + shapeSize)
            )
          );
        } else {
          path = ShapeMaker.makeShape(paper, shapeName, shapeSize, shapeSize);
          path.translate(
            new paper.Point(
              boundaryModel.bounds.x + r * gridCellSizeX,
              boundaryModel.bounds.y + c * gridCellSizeY
            )
          );
        }
        rowModels.push(path);
      }

      return rowModels;
    }

    for (var c = -1; c <= cols; c++) {
      const rowModels = _.bind(makeRow, this)(c);
      models = models.concat(rowModels);
    }
    return models;
  }

  get designMetaParameters(): Array<MetaParameter> {
    return [
      new SelectMetaParameter({
        title: 'Shape',
        options: ['AlternatingTriangles', ...ShapeMaker.modelNames],
        name: 'shapeName',
        value: 'Rectangle'
      }),
      new RangeMetaParameter({
        title: 'Shape Size',
        min: 0.01,
        max: 2.0,
        value: 0.04,
        step: 0.01,
        name: 'shapeSize'
      }),
      new RangeMetaParameter({
        title: 'Border Size (in)',
        min: 0.02,
        max: 0.75,
        value: 0.04,
        step: 0.01,
        name: 'bufferWidth'
      }),
      new RangeMetaParameter({
        title: 'X Noise Coefficient',
        min: 0.0,
        max: 0.2,
        step: 0.001,
        value: 0.01,
        name: 'xNoiseCoefficient'
      }),
      new RangeMetaParameter({
        title: 'Y Noise Coefficient',
        min: 0.0,
        max: 0.2,
        step: 0.001,
        value: 0.01,
        name: 'yNoiseCoefficient'
      }),
      new RangeMetaParameter({
        title: 'Chance inclusion',
        min: 0.01,
        max: 1.0,
        value: 0.5,
        step: 0.01,
        name: 'chanceProbability'
      })
    ];
  }
}
