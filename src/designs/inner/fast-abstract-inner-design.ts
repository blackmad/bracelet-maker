import * as _ from 'lodash';
import * as SimplexNoise from 'simplex-noise';
const seedrandom = require('seedrandom');
import ExtendPaperJs from 'paperjs-offset';

import {
  MetaParameter,
  RangeMetaParameter,
} from '../../meta-parameter';
import { PaperModelMaker } from '../../model-maker';

import concaveman from 'concaveman';

export abstract class FastAbstractInnerDesign implements PaperModelMaker {
  rng: () => number;
  simplex: SimplexNoise;
  needSubtraction: boolean = true;
  allowOutline: boolean = false;
  smoothOutline: boolean = true;
  requiresSafeConeClamp: boolean = true;
  forceContainmentDefault: boolean = true;
  needSeed: boolean = true;

  controlInfo = '';

  abstract makeDesign(scope: any, params: any): any;
  abstract get designMetaParameters(): Array<MetaParameter>;

  get metaParameters(): Array<MetaParameter> {
    let metaParams: Array<MetaParameter> = [
      // new OnOffMetaParameter({
      //   title: 'Debug',
      //   name: 'debug',
      //   value: false
      // })
    ];

    if (this.needSeed) {
      metaParams.push(
        new RangeMetaParameter({
          title: 'Seed',
          min: 1,
          max: 10000,
          value: 1,
          step: 1,
          name: 'seed'
        })
      );
    }

    metaParams = metaParams.concat(this.designMetaParameters);

    if (this.allowOutline) {
      // metaParams.push(
      //   new OnOffMetaParameter({
      //     title: 'Force Containment',
      //     name: 'forceContainment',
      //     value: true
      //   })
      // );
      // metaParams.push(
      //   new RangeMetaParameter({
      //     title: 'Boundary Dilation (forceContainment false only)',
      //     min: 0.05,
      //     max: 2.5,
      //     value: 0.22,
      //     step: 0.01,
      //     name: 'boundaryDilation'
      //   })
      // );
      // metaParams.push(
      //   new OnOffMetaParameter({
      //     title: 'Smooth Outline',
      //     name: 'smoothOutline',
      //     value: false
      //   })
      // );
    }

    return metaParams;
  }

  make(paper: any, params: any): any {
    const self = this;

    params.outlineSize = 0.1;
    params.debug = false;

    if (params.seed) {
      this.rng = seedrandom(params.seed.toString());
      // @ts-ignore
      if (SimplexNoise.default) {
        // @ts-ignore
        this.simplex = new SimplexNoise.default(params.seed.toString());
      } else {
        this.simplex = new SimplexNoise(params.seed.toString());
      }
    }

    const design = self.makeDesign(paper, params);
    let paths = design;
    if (design['paths']) {
      paths = design['paths'];
    }

    paths = paths.filter(p => !!p);

    if (params.debug) {
      return { paths };
    } else {
      paths.forEach(p => p.remove());
    }

    let shouldMakeOutline =
      params.boundaryModel.bounds.height > params.outerModel.bounds.height;

    if (this.needSubtraction && (!this.allowOutline || !shouldMakeOutline)) {
      console.log('clamping sub');
      paths = paths.map(m => m.intersect(params.boundaryModel));
    }
    ExtendPaperJs(paper);

    console.log(shouldMakeOutline);
    let outline = null;
    if (this.allowOutline && shouldMakeOutline) {
      if (this.requiresSafeConeClamp) {
        console.log('clamping cone');

        const handles = params.outerModel.subtract(params.safeCone, {
          insert: false
        });
        // paths = paths.map(m => {
        //   if (m.intersects(handles)) {
        //     return null;
        //   } else {
        //     return m;
        //   }
        // });
        // paths = paths.filter((p) => !!p);

        paths = paths.map(m => {
          if (m.intersects(params.outerModel)) {
            // return null;
          }
          return m.intersect(params.boundaryModel);
        });
        paths = paths.filter(p => !!p);
      }

      console.log('making outline');
      paths = paths.filter(
        m =>
          params.outerModel.contains(m.bounds) ||
          m.intersects(params.outerModel)
      );

      const compoundPath = new paper.CompoundPath({
        strokeColor: 'pink',
        children: paths
      });

      if (design['outlinePaths']) {
        console.log('using outlinePaths');
        outline = new paper.CompoundPath(design['outlinePaths']);
        // outline = outline.intersect(params.safeCone);
      } else {
        // @ts-ignore
        outline = params.outerModel;
        // TODO: this is wrong
        const hasCurves = !_.some(paths, (p) => _.some(p.curves, (c) => !!c.handle1))
        
        console.log('hasCurves', hasCurves)
        if (!hasCurves) { 
          const allPoints = []
          paths.forEach((path: paper.Path) => {
            path.segments.forEach(s =>
              allPoints.push([s.point.x, s.point.y])
            )
            for (let offset = 0; offset < 1; offset += 0.01) {
              const point = path.getPointAt(path.length * offset)
              allPoints.push([point.x, point.y])
            }
          })
          const concaveHull = concaveman(allPoints, 1.5, 0.2);
          outline = new paper.Path(concaveHull.map((p) => new paper.Point(p[0], p[1])));
          // outline.simplify(0.0001);
          if (params.debug) {
            outline.strokeColor = 'green';
            outline.strokeWidth = 0.05;
          }

          outline = paper.Path.prototype.offset.call(
            outline,
            params.outlineSize,
            { cap: 'miter' });
          //  outline = outline.children[0];
          //  outline.closePath();
        } else {
          paths.map((p) => {
            const exploded = paper.Path.prototype.offset.call(
              p,
              params.outlineSize,
              { cap: 'miter' });
             outline = outline.unite(exploded);
             exploded.remove();
          })
        }
      }

      if (params.debug) {
        outline.strokeColor = 'green';
        outline.strokeWidth = 0.05;
      } else {
        outline.remove();
      }

      if (this.smoothOutline) {
        // outline.smooth({ type: 'geometric', factor: 0.5 });
      }
    }

    return {
      paths,
      outline
    };
  }
}
