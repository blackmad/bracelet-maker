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
  public rng: () => number;
  // @ts-ignore
  public simplex: SimplexNoise;
  public needSubtraction: boolean = true;
  public allowOutline: boolean = false;
  public smoothOutline: boolean = true;
  public requiresSafeConeClamp: boolean = true;
  public forceContainmentDefault: boolean = true;
  public needSeed: boolean = true;

  public controlInfo = '';

  public abstract makeDesign(scope: any, params: any): any;
  abstract get designMetaParameters(): MetaParameter[];

  get metaParameters(): MetaParameter[] {
    let metaParams: MetaParameter[] = [
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
      metaParams.push(
        new RangeMetaParameter({
          title: 'Outline Concavity',
          min: 0.1,
          max: 3,
          value: 1.5,
          step: 0.01,
          name: 'concavity'
        })
      );
      metaParams.push(
        new RangeMetaParameter({
          title: 'Outline Length Threshold',
          min: 0.01,
          max: 3,
          value: 0.2,
          step: 0.01,
          name: 'lengthThreshold'
        })
      );
      metaParams.push(
        new RangeMetaParameter({
          title: 'Outline Size (inches)',
          min: 0.01,
          max: 3,
          value: 0.1,
          step: 0.01,
          name: 'outlineSize'
        })
      );
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

  public make(paper: any, params: any): any {
    const self = this;

    params.debug = false;

    if (params.seed) {
      this.rng = seedrandom(params.seed.toString());
      // @ts-ignore
      if (SimplexNoise.default) {
        // @ts-ignore
        this.simplex = new SimplexNoise.default(params.seed.toString());
      } else {
        // @ts-ignore
        this.simplex = new SimplexNoise(params.seed.toString());
      }
    }

    const design = self.makeDesign(paper, params);
    let paths = design;
    if (design.paths) {
      paths = design.paths;
    }

    paths = paths.filter((p) => !!p);

    if (params.debug) {
      return { paths };
    } else {
      paths.forEach((p) => p.remove());
    }

    const shouldMakeOutline =
      params.boundaryModel.bounds.height > params.outerModel.bounds.height;

    if (this.needSubtraction && (!this.allowOutline || !shouldMakeOutline)) {
      // console.log('clamping sub');
      paths = paths.map((m) => m.intersect(params.boundaryModel));
    }
    ExtendPaperJs(paper);

    let outline = null;
    if (this.allowOutline && shouldMakeOutline) {
      if (this.requiresSafeConeClamp) {
        // console.log('clamping cone');

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

        paths = paths.map((m) => {
          if (m.intersects(params.outerModel)) {
            // return null;
          }
          return m.intersect(params.boundaryModel);
        });
        paths = paths.filter((p) => !!p);
      }

      // console.log('making outline');
      paths = paths.filter(
        (m) =>
          params.outerModel.contains(m.bounds) ||
          m.intersects(params.outerModel)
      );

      if (design.outlinePaths) {
        outline = new paper.CompoundPath(design.outlinePaths);
        // outline = outline.intersect(params.safeCone);
      } else {
        // @ts-ignore
        outline = params.outerModel;
        // TODO: this is wrong
        const hasCurves = !_.some(paths, (p) => _.some(p.curves, (c) => !!c.handle1));

        // console.log('hasCurves', hasCurves);
        // params.debug = true;
        if (!hasCurves) {
          const allPoints = [];
          paths.forEach((path: paper.Path) => {
            path.segments.forEach((s) =>
              allPoints.push([s.point.x, s.point.y])
            );
            for (let offset = 0; offset < 1; offset += 0.01) {
              const point = path.getPointAt(path.length * offset);
              allPoints.push([point.x, point.y]);
            }
          });
          const concaveHull = concaveman(allPoints, params.concavity, params.lengthThreshold);
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

          if (params.debug) {
            outline.strokeColor = 'pink';
            outline.strokeWidth = 0.05;
            outline.fillColor = 'blue';
          }
          outline.closePath();
          //  outline = outline.children[0];

        } else {
          paths.map((p) => {
            const exploded = paper.Path.prototype.offset.call(
              p,
              params.outlineSize,
              { cap: 'miter' });
            outline = outline.unite(exploded);
            exploded.remove();
          });
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

      // outline.simplify({tolerance: 0.01});
    }

    return {
      paths,
      outline
    };
  }
}
