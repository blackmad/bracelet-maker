import * as SimplexNoise from 'simplex-noise';
const seedrandom = require('seedrandom');
import ExtendPaperJs from 'paperjs-offset';

import {
  MetaParameter,
  RangeMetaParameter,
  OnOffMetaParameter
} from '../../meta-parameter';
import { PaperModelMaker } from '../../model-maker';

export abstract class FastAbstractInnerDesign implements PaperModelMaker {
  rng: () => number;
  simplex: SimplexNoise;
  needSubtraction: boolean = true;
  allowOutline: boolean = false;
  requiresSafeConeClamp: boolean = false;
  forceContainmentDefault: boolean = true;
  needSeed: boolean = true;

  abstract makeDesign(scope: any, params: any): any;
  abstract get designMetaParameters(): Array<MetaParameter>;

  get metaParameters(): Array<MetaParameter> {
    let metaParams: Array<MetaParameter> = [
      new OnOffMetaParameter({
        title: 'Debug',
        name: 'debug',
        value: false
      })
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
      metaParams.push(
        new OnOffMetaParameter({
          title: 'Force Containment',
          name: 'forceContainment',
          value: true
        })
      );
      metaParams.push(
        new RangeMetaParameter({
          title: 'Outline size (in)',
          min: 0.05,
          max: 0.4,
          value: 0.1,
          step: 0.01,
          name: 'outlineSize'
        })
      );
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
      metaParams.push(
        new OnOffMetaParameter({
          title: 'Smooth Outline',
          name: 'smoothOutline',
          value: false
        })
      );
    }

    return metaParams;
  }

  make(paper: any, params: any): any {
    const self = this;

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
      return {paths};
    } else {
      paths.forEach((p) => p.remove());
    }

    if ((!this.allowOutline && this.requiresSafeConeClamp) || (this.allowOutline && !params.forceContainment)) {
      console.log('clamping cone');
      paths = paths.map(m => m.intersect(params.safeCone));
    }

    if (this.needSubtraction && (!this.allowOutline || params.forceContainment)) {
      console.log('clamping sub');
      // console.log(params.boundaryModel);
      paths = paths.map(m => m.intersect(params.boundaryModel));
    }
    ExtendPaperJs(paper);

    let outline = null;
    if (this.allowOutline && !params.forceContainment) {
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
        console.log('using outlinePaths')
        outline = new paper.CompoundPath(design['outlinePaths'])
        outline = outline.intersect(params.safeCone);
      } else {
        // @ts-ignore
        outline = paper.Path.prototype.offset.call(compoundPath, params.outlineSize, { cap: 'miter' });
        outline.remove();
      }

      outline = outline.unite(outline)
      outline.remove();
      if (params.smoothOutline) {
        outline.smooth({ type: 'geometric', factor: 0.3 });
      }
      console.log(outline);
    }

    return {
      paths,
      outline
    }
  }
}
