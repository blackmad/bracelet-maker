import { MetaParameter, RangeMetaParameter, SelectMetaParameter } from '../../meta-parameter';
import { FastAbstractInnerDesign } from './fast-abstract-inner-design';
import * as paper from 'paper';
import * as _ from 'lodash';

import { bufferShape } from '../../utils/paperjs-utils';

import { makeTesselationFromName, getAllTesselationNames } from '../../tessagon/demo';
import { ALL } from 'src/tessagon/tessagon.core.tessagon_discovery';

export class InnerDesignTessagon extends FastAbstractInnerDesign {
  allowOutline = false;
  needSubtraction = true;
  needSeed = false;

  makeDesign(scope, params) {
    const { boundaryModel, tesselation, x_num, y_num, borderSize} = params;

    // u_range: a list with two items indicating the minimum and maximum values for u (the first argument to the function passed);
    // v_range: a list with two items indicating the minimum and maximum values for v (the second argument to the function passed);
    // u_num: the number of tiles to be created in the u-direction;
    // v_num: the number of tiles to be created in the v-direction;
    //     adaptor ListAdaptor from the module tessagon.adaptors.list_adaptor. The output from the adaptor's get_mesh method is a dict with keys 
    // vert_list, face_list and color_list, which point to lists of
    //  vertices, faces (as indices into the vertex list), and color indices for each face.

    const bmesh = makeTesselationFromName(
      tesselation,
      0,
      boundaryModel.bounds.width,
      0,
      boundaryModel.bounds.height,
      x_num,
      y_num
    );

    const vertices = bmesh['vert_list']
    const faces = bmesh['face_list']
    console.log(bmesh);
    console.log(faces);

    const paths = faces.map(face => {
      const points = face.map(vertIndex => {
        return new paper.Point(
          boundaryModel.bounds.x + vertices[vertIndex][0],
          boundaryModel.bounds.y + vertices[vertIndex][1]
        )
      })
      const bufferedShape = bufferShape(-borderSize, points)
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
        value: _.sample(getAllTesselationNames()),
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
        value: 5,
        step: 1,
        name: 'y_num'
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
