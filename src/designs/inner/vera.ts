
// why so broken: https://127.0.0.1:4501/static/#StraightCuffOuter.debug=false&StraightCuffOuter.height=2&StraightCuffOuter.wristCircumference=7&StraightCuffOuter.safeBorderWidth=0.22&StraightCuffOuter.forearmCircumference=7.4&InnerDesignVera.debug=false&InnerDesignVera.seed=8148&InnerDesignVera.shapeSize1=0.26&InnerDesignVera.shapeSize2=0.26&InnerDesignVera.bufferWidth=0.1&InnerDesignVera.xNoiseCoefficient=0.01&InnerDesignVera.yNoiseCoefficient=0.01&InnerDesignVera.xScaleNoiseCoefficient=0.01&InnerDesignVera.yScaleNoiseCoefficient=0.01&InnerDesignVera.minScale=0.5&InnerDesignVera.maxScale=1.25&InnerDesignVera.shapeName=Rectangle&InnerDesignVera.constrainShapes=false&InnerDesignVera.forceContainment=false&InnerDesignVera.outlineSize=0.1&InnerDesignVera.boundaryDilation=0.22

import { ShapeMaker } from '../shape-maker';

import { SimplexNoiseUtils } from '../../utils/simplex-noise-utils';
import {
  MetaParameter,
  OnOffMetaParameter,
  RangeMetaParameter,
  SelectMetaParameter
} from '../../meta-parameter';
import { FastAbstractInnerDesign } from './fast-abstract-inner-design';
import * as _ from 'lodash';

export class InnerDesignVera extends FastAbstractInnerDesign {
  allowOutline = true;
  requiresSafeConeClamp = false;
  needSubtraction = true;

  makeDesign(paper: paper.PaperScope, params) {
    const {
      height,
      width,
      shapeSize1,
      shapeSize2,
      bufferWidth,
      xNoiseCoefficient,
      yNoiseCoefficient,
      xScaleNoiseCoefficient,
      yScaleNoiseCoefficient,
      minScale,
      maxScale,
      shapeName,
      constrainShapes,
      boundaryModel
    } = params;

    let models = [];

    const gridCellSizeX = shapeSize1 + bufferWidth * 2;
    const gridCellSizeY = shapeSize2 + bufferWidth * 2;
    const rows = width / gridCellSizeX;
    const cols = height / gridCellSizeY;

    function makeRow(c) {
      const rowModels = [];
      for (var r = -1; r <= rows; r++) {
        // .$(ShapeMaker.makeShape(shapeName, shapeSize1, shapeSize2))
  
        var point = new paper.Point(0, 0);
        var size = new paper.Size(shapeSize1, shapeSize2);
        var path = new paper.Path.Rectangle(point, size);
  
        path.rotate(
          SimplexNoiseUtils.noise2DInRange(
            this.simplex,
            r * xNoiseCoefficient,
            c * yNoiseCoefficient,
            0,
            180
          ),
          new paper.Point(shapeSize1 / 2, shapeSize2 / 2)
        );
  
        path.scale(
          SimplexNoiseUtils.noise2DInRange(
            this.simplex,
            r * xScaleNoiseCoefficient,
            c * yScaleNoiseCoefficient,
            minScale,
            maxScale
          )
        );
  
        path.translate(
          new paper.Point(
            r * gridCellSizeX +
              SimplexNoiseUtils.noise2DInRange(
                this.simplex,
                r * xNoiseCoefficient,
                c * yNoiseCoefficient,
                -bufferWidth / 2,
                bufferWidth / 2
              ),
            c * gridCellSizeY +
              SimplexNoiseUtils.noise2DInRange(
                this.simplex,
                r * xNoiseCoefficient,
                c * yNoiseCoefficient,
                -bufferWidth / 2,
                bufferWidth / 2
              )
          )
        );
        rowModels.push(path);
      }
      return rowModels
    }

    for (var c = -1; c <= cols; c++) {
      const rowModels = _.bind(makeRow, this)(c);
      models = models.concat(rowModels);
    }

    return models;
  }

  get designMetaParameters(): Array<MetaParameter> {
    return [
      new RangeMetaParameter({
        title: 'Shape Size 1 (Width?)',
        min: 0.02,
        max: 2.0,
        value: 0.2,
        step: 0.01,
        name: 'shapeSize1'
      }),
      new RangeMetaParameter({
        title: 'Shape Size 2 (Height?)',
        min: 0.02,
        max: 2.0,
        value: 0.2,
        step: 0.01,
        name: 'shapeSize2'
      }),

      new RangeMetaParameter({
        title: 'Border Size (in)',
        min: 0.1,
        max: 0.75,
        value: 0.1,
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
        title: 'X Scale Noise Coefficient',
        min: 0.0,
        max: 0.2,
        step: 0.001,
        value: 0.01,
        name: 'xScaleNoiseCoefficient'
      }),
      new RangeMetaParameter({
        title: 'Y Scale Noise Coefficient',
        min: 0.0,
        max: 0.2,
        step: 0.001,
        value: 0.01,
        name: 'yScaleNoiseCoefficient'
      }),

      new RangeMetaParameter({
        title: 'Min scaling',
        min: 0.1,
        max: 1.0,
        value: 0.5,
        step: 0.01,
        name: 'minScale'
      }),
      new RangeMetaParameter({
        title: 'Max scaling',
        min: 1.0,
        max: 1.5,
        value: 1.25,
        step: 0.01,
        name: 'maxScale'
      }),

      new SelectMetaParameter({
        title: 'Shape',
        options: ShapeMaker.modelNames,
        name: 'shapeName',
        value: 'Rectangle'
      }),
      new OnOffMetaParameter({
        title: 'constrainShapes',
        name: 'constrainShapes',
        value: false
      })
    ];
  }
}
