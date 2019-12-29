import * as _ from "lodash";
import * as SimplexNoise from "simplex-noise";
const seedrandom = require("seedrandom");
import ExtendPaperJs from "paperjs-offset";

import {
  MetaParameter,
  RangeMetaParameter,
  OnOffMetaParameter
} from "../../meta-parameter";
import { PaperModelMaker, InnerCompletedModel } from "../../model-maker";

import concaveman from "concaveman";
import { addToDebugLayer } from "../../utils/debug-layers";
import { roundCorners } from '../../utils/round-corners';

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
  public canRound: boolean = false;

  public controlInfo = "";

  public abstract makeDesign(scope: any, params: any): any;
  abstract get designMetaParameters(): MetaParameter[];

  get metaParameters(): MetaParameter[] {
    let metaParams: MetaParameter[] = [
      new OnOffMetaParameter({
        title: 'Debug',
        name: 'debug',
        value: false
      })
    ];

    if (this.needSeed) {
      metaParams.push(
        new RangeMetaParameter({
          title: "Seed",
          min: 1,
          max: 10000,
          value: 1,
          step: 1,
          name: "seed"
        })
      );
    }

    metaParams = metaParams.concat(this.designMetaParameters);

    if (this.canRound) {
      metaParams.push(
        new OnOffMetaParameter({
          title: "Round paths",
          value: "true",
          name: "shouldSmooth"
        })
      );
      metaParams.push(
        new RangeMetaParameter({
          title: "Smoothing Factor",
          min: 0.01,
          max: 1.0,
          value: 0.8,
          step: 0.01,
          name: "smoothingFactor"
        })
      );
    }

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
          title: "Outline Concavity",
          min: 0.1,
          max: 3,
          value: 0.4,
          step: 0.01,
          name: "concavity"
        })
      );
      metaParams.push(
        new RangeMetaParameter({
          title: "Outline Length Threshold",
          min: 0.01,
          max: 3,
          value: 0.01,
          step: 0.01,
          name: "lengthThreshold"
        })
      );
      metaParams.push(
        new RangeMetaParameter({
          title: "Outline Size (inches)",
          min: 0.01,
          max: 3,
          value: 0.15,
          step: 0.01,
          name: "outlineSize"
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

  public async make(paper: any, params: any): Promise<InnerCompletedModel> {
    const self = this;

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

    const design = await self.makeDesign(paper, params);

    let paths = design;
    if (design.paths) {
      paths = design.paths;
    }

    paths = paths.filter(p => !!p);

    if (params.shouldSmooth) {
      paths = paths.map(path =>
        roundCorners({ paper, path: path, radius: params.smoothingFactor })
      );
    }

    const shouldMakeOutline =
      params.boundaryModel.bounds.height > params.outerModel.bounds.height;

    if (this.needSubtraction && (!this.allowOutline || !shouldMakeOutline)) {
      // console.log('clamping sub');
      paths = paths.map(m => {
        return m.intersect(params.boundaryModel, {insert: false});
      });
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

        paths = paths.map(m => {
          if (m.intersects(params.outerModel)) {
            // return null;
          }
          return m.intersect(params.boundaryModel);
        });
        paths = paths.filter(p => !!p);
      }

      // console.log('making outline');
      paths = paths.filter(
        m =>
          params.outerModel.contains(m.bounds) ||
          m.intersects(params.outerModel)
      );

      if (design.outlinePaths) {
        outline = new paper.CompoundPath(design.outlinePaths);
      } else {
        console.log('need to make outline')
        // @ts-ignore
        outline = params.outerModel;
        // TODO: this is wrong
        const hasCurves = !_.some(paths, p =>
          _.some(p.curves, c => !!c.handle1)
        );
        console.log(hasCurves)
        console.log(params.debug)

        if (!hasCurves) {
          const allPoints = [];
          paths.forEach((path: paper.Path) => {
            path.segments.forEach(s => allPoints.push([s.point.x, s.point.y]));
            for (let offset = 0; offset < 1; offset += 0.01) {
              const point = path.getPointAt(path.length * offset);
              allPoints.push([point.x, point.y]);
              // addToDebugLayer(paper, "points", new paper.Path.Rectangle(point, 0.01));
            }
          });
          const concaveHull = concaveman(
            allPoints,
            params.concavity,
            params.lengthThreshold
          );
          outline = new paper.Path(
            concaveHull.map(p => new paper.Point(p[0], p[1]))
          );

          if (params.debug) {
            addToDebugLayer(paper, 'outlinePoints', outline);
          }

          outline = paper.Path.prototype.offset.call(
            outline,
            params.outlineSize,
            { cap: "miter" }
          );

          if (outline instanceof paper.CompoundPath) {
            outline = _.sortBy(outline.children, (c) => -c.area)[0];
          }

          outline.closePath();
          //  outline = outline.children[0];
        } else {
          paths.map(p => {
            const exploded = paper.Path.prototype.offset.call(
              p,
              params.outlineSize,
              { cap: "miter" }
            );
            outline = outline.unite(exploded);
          });
        }
      }

        outline = roundCorners({ paper, path: outline, radius: 0.9 })
    }

    return new InnerCompletedModel({
      paths,
      outline
    });
  }
}
