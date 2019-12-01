import { MetaParameter, RangeMetaParameter, SelectMetaParameter, OnOffMetaParameter } from '../../meta-parameter';
import { FastAbstractInnerDesign } from './fast-abstract-inner-design';
import * as _ from 'lodash';

import { bufferShape } from '../../utils/paperjs-utils';

import { makeTesselationFromName, makeTesselationFromNameAndOptions, getAllTesselationNames } from '../../tessagon/js-entry';
import { plane } from '../..//tessagon/tessagon.misc.shapes';
import { ListAdaptor } from '../..//tessagon/tessagon.adaptors.list_adaptor';


export class InnerDesignTessagon extends FastAbstractInnerDesign {
  allowOutline = true;
  needSubtraction = true;
  needSeed = false;
  canRound = true;

  makeDesign(paper: paper.PaperScope, params) {
    const { outerModel, boundaryModel, tesselation, x_num, y_num, borderSize, x_cyclic, y_cyclic, rot_factor} = params;

    // u_range: a list with two items indicating the minimum and maximum values for u (the first argument to the function passed);
    // v_range: a list with two items indicating the minimum and maximum values for v (the second argument to the function passed);
    // u_num: the number of tiles to be created in the u-direction;
    // v_num: the number of tiles to be created in the v-direction;
    //     adaptor ListAdaptor from the module tessagon.adaptors.list_adaptor. The output from the adaptor's get_mesh method is a dict with keys 
    // vert_list, face_list and color_list, which point to lists of
    //  vertices, faces (as indices into the vertex list), and color indices for each face.

    let u_range = [boundaryModel.bounds.x, boundaryModel.bounds.x + boundaryModel.bounds.width]
    let v_range = [boundaryModel.bounds.y, boundaryModel.bounds.y + boundaryModel.bounds.height]

    const options = {
        'function': plane,
        'u_range': u_range,
        'v_range': v_range,
        'u_num': x_num,
        'v_num': y_num,
        'u_cyclic': false,
        'v_cyclic': false,
        'adaptor_class' : ListAdaptor,
      }
     if (rot_factor != 0) {
       options['rot_factor'] = rot_factor;
     }

    const bmesh = makeTesselationFromNameAndOptions(tesselation, options);
    // const bmesh = makeTesselationFromName(tesselation,
    //   0, boundaryModel.bounds.width, 0, boundaryModel.bounds.height,
    //   x_num, y_num, rot_factor);

    const vertices = bmesh['vert_list']
    const faces = bmesh['face_list']

    const paths = faces.map(face => {
      const points = face.map(vertIndex => {
        return new paper.Point(
          vertices[vertIndex][0],
          vertices[vertIndex][1]
        )
      })
      const bufferedShape = bufferShape(paper, -borderSize, points)
      return bufferedShape
      // return new paper.Path(points);
    });

    return {
      paths
    }
  }

  get designMetaParameters(): Array<MetaParameter> {
    return [
      // new RangeMetaParameter({
      //   title: "Circle Size",
      //   min: 0.04,
      //   max: 0.5,
      //   value: 0.04,
      //   step: 0.01,
      //   name: "circleSize"
      // }),
      new SelectMetaParameter({
        title: 'tesselation',
        options: getAllTesselationNames(),
        // value: _.sample(getAllTesselationNames()),
        value: 'HexSquareTriTessagon',
        name: 'tesselation'
      }),
      new RangeMetaParameter({
        title: 'x cells',
        min: 1,
        max: 100,
        value: 5,
        step: 1,
        name: 'x_num'
      }),
      new RangeMetaParameter({
        title: 'y cells',
        min: 1,
        max: 100,
        value: 2,
        step: 1,
        name: 'y_num'
      }),
      // new OnOffMetaParameter({
      //   title: 'whole tiles only',
      //   value: false,
      //   name: 'whole_tiles_only'
      // }),
      // new OnOffMetaParameter({
      //   title: 'y cyclic',
      //   value: false,
      //   name: 'y_cyclic'
      // }),
      new RangeMetaParameter({
        title: 'rot factor',
        min: 0,
        max: 100,
        value: 0,
        step: 1,
        name: 'rot_factor'
      }),
      new RangeMetaParameter({
        title: 'borderSize',
        min: 0.02,
        max: 0.5,
        value: 0.04,
        step: 0.01,
        name: 'borderSize'
      })
    ];
  }
}
