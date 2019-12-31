import * as _ from 'lodash';
import Jimp from 'jimp';
import potrace from 'potrace';
import * as $ from 'jquery';

import { SimplexNoiseUtils } from '../../utils/simplex-noise-utils';
import {
  OnOffMetaParameter,
  RangeMetaParameter,
  SelectMetaParameter
} from '../../meta-parameter';
import { FastAbstractInnerDesign } from './fast-abstract-inner-design';

import { addToDebugLayer } from '../../utils/debug-layers';
import { flattenArrayOfPathItems } from '../../utils/paperjs-utils';


export class InnerDesignPerlinBlobs extends FastAbstractInnerDesign {
  allowOutline = false;
  requiresSafeConeClamp = false;
  needSubtraction = true;

  async makeDesign(paper: paper.PaperScope, params: any) {
    const {
      xNoiseDivisor,
      yNoiseDivisor,
      boundaryModel,
      scale,
      chanceProbability,
      useNoiseInBitmap,
      smooth,
      simplificationTolerance
    } = params;

    const imageSizeX = boundaryModel.bounds.width * scale;
    const imageSizeY = boundaryModel.bounds.height * scale;
  
    let image = new Jimp(imageSizeX, imageSizeY, 'black', (err, image) => {
      if (err) throw err
    });

    console.log(image.bitmap.data.length);

    const self = this;
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const chance = SimplexNoiseUtils.noise2DInRange(
        self.simplex,
        x / (xNoiseDivisor / (scale / 10)),
        y / (yNoiseDivisor / (scale / 10)),
        0,
        1
      );

      if (chance < chanceProbability) {
          // rgba values run from 0 - 255
          if (useNoiseInBitmap) {
            this.bitmap.data[idx + 0] = (1-chance)*255;
            this.bitmap.data[idx + 1] = (1-chance)*255;
            this.bitmap.data[idx + 2] = (1-chance)*255;
          } else {
            this.bitmap.data[idx + 0] = 255;
            this.bitmap.data[idx + 1] = 255;
            this.bitmap.data[idx + 2] = 255;
          }
        // this.bitmap.data[idx + 1] = (1-chance)*255;
        // this.bitmap.data[idx + 2] = (1-chance)*255;
        // this.bitmap.data[idx + 3] = 0;
      }
    });

    console.log(image.bitmap.data.length)
    const buffer = await image.getBufferAsync('image/bmp');

    if (params.debug) {
      image.getBase64(Jimp.MIME_JPEG, function (err, src) {
        let img = $('#designScratchArea img');
        console.log(img)
        if (img.length == 0) {
          console.log(img)
          img = $('<img style="width:100%"/>')
          console.log(img)
          $('#designScratchArea').append(img[0]);
        }
        img[0].src = src;
      })
    }

    var trace = new potrace.Potrace();
    return await new Promise<{paths: paper.Path[]}>((resolve, reject) => {
      trace.loadImage(buffer, function(err) {
        if (err) {
          console.log('error', err);
          reject({paths:[]});
        }
        const svg = trace.getSVG();
        const item = paper.project.importSVG(svg, {expandShapes:true});
        const paths: paper.Path[] = flattenArrayOfPathItems(paper, item.children);
        item.remove();
        item.translate(new paper.Point(
          -item.bounds.width/2,
          -item.bounds.height/2));
        item.scale(1/scale, boundaryModel.bounds.center);

        paths.forEach((path) => {
          path.closePath();
  
          if (smooth) {
            path.smooth({type: 'continuous'})
          }

          if (simplificationTolerance > 0) {
            path.simplify(simplificationTolerance/50000)
          }
        });

        resolve({paths});
      });
    })

  }

  get designMetaParameters() {
    return [
      new OnOffMetaParameter({
        title: 'Grayscale Algorithm',
        value: true,
        name: 'useNoiseInBitmap'
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
        title: 'Inch to Noise Space Scale',
        min: 10.0,
        max: 250,
        step: 1,
        value: 70,
        name: 'scale'
      }),
      new RangeMetaParameter({
        title: 'X Noise Divisor',
        min: 1.0,
        max: 5000.0,
        step: 1,
        value: 150,
        name: 'xNoiseDivisor'
      }),
      new RangeMetaParameter({
        title: 'Y Noise Divisor',
        min: 1.0,
        max: 5000.0,
        step: 1,
        value: 150,
        name: 'yNoiseDivisor'
      }),
      new RangeMetaParameter({
        title: 'Chance inclusion',
        min: 0.01,
        max: 1.0,
        value: 0.7,
        step: 0.01,
        name: 'chanceProbability'
      }),
      new OnOffMetaParameter({
        title: 'Smooth blobs',
        value: false,
        name: 'smooth'
      }),
      new RangeMetaParameter({
        title: 'Simplification Tolerance',
        min: 0,
        max: 1000,
        value: 0.0,
        step: 1,
        name: 'simplificationTolerance'
      }),
    ];
  }
}
