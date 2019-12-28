import * as _ from "lodash";
import * as SimplexNoise from "simplex-noise";
const seedrandom = require("seedrandom");
import ExtendPaperJs from "paperjs-offset";
import * as simplify from "simplify-js";

import {
  MetaParameter,
  RangeMetaParameter,
  SelectMetaParameter
} from "../../meta-parameter";
import { PaperModelMaker, InnerCompletedModel } from "../../model-maker";

import concaveman from "concaveman";
import { roundCorners, cascadedUnion } from "../../utils/paperjs-utils";

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
      // new OnOffMetaParameter({
      //   title: 'Debug',
      //   name: 'debug',
      //   value: false
      // })
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
        new SelectMetaParameter({
          title: "Smoothing Type",
          value: "Homegrown",
          options: [
            "None",
            "Homegrown",
            "continuous",
            "Catmull-Rom",
            "Geometric"
          ],
          name: "smoothingType"
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
          value: 1.5,
          step: 0.01,
          name: "concavity"
        })
      );
      metaParams.push(
        new RangeMetaParameter({
          title: "Outline Length Threshold",
          min: 0.01,
          max: 3,
          value: 0.2,
          step: 0.01,
          name: "lengthThreshold"
        })
      );
      metaParams.push(
        new RangeMetaParameter({
          title: "Outline Size (inches)",
          min: 0.01,
          max: 3,
          value: 0.1,
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

    const design = await self.makeDesign(paper, params);

    let paths = design;
    if (design.paths) {
      paths = design.paths;
    }

    paths = paths.filter(p => !!p);

    console.log(cascadedUnion);
    paths = cascadedUnion(paths);

    if (this.canRound) {
      if (params.smoothingType != "None") {
        if (params.smoothingType == "Homegrown") {
          paths = paths.map(path =>
            roundCorners({ paper, path: path, radius: params.smoothingFactor })
          );
        } else {
          try {
            paths.forEach(path =>
              path.smooth({
                type: params.smoothingType.toLowerCase(),
                from: -1,
                to: 0
              })
            );
          } catch (e) {
            // console.error(e);
          }
        }
      }
    }

    const shouldMakeOutline =
      params.boundaryModel.bounds.height > params.outerModel.bounds.height;

    if (this.needSubtraction && (!this.allowOutline || !shouldMakeOutline)) {
      // console.log('clamping sub');
      paths = paths.map(m => {
        return m.intersect(params.boundaryModel);
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
        // outline = outline.intersect(params.safeCone);
      } else {
        // @ts-ignore
        outline = params.outerModel;
        // TODO: this is wrong
        const hasCurves = !_.some(paths, p =>
          _.some(p.curves, c => !!c.handle1)
        );

        // params.debug = true;
        if (!hasCurves) {
          const allPoints = [];
          paths.forEach((path: paper.Path) => {
            path.segments.forEach(s => allPoints.push([s.point.x, s.point.y]));
            for (let offset = 0; offset < 1; offset += 0.01) {
              const point = path.getPointAt(path.length * offset);
              allPoints.push([point.x, point.y]);
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
          // outline.simplify(0.0001);
          if (params.debug) {
            outline.strokeColor = "green";
            outline.strokeWidth = 0.05;
          }

          outline = paper.Path.prototype.offset.call(
            outline,
            params.outlineSize,
            { cap: "miter" }
          );

          if (outline instanceof paper.CompoundPath) {
            outline = _.sortBy(outline.children, (c) => -c.area)[0];
          }

          if (params.debug) {
            outline.strokeColor = "pink";
            outline.strokeWidth = 0.05;
            outline.fillColor = "blue";
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

      // console.log(outline);
      // const points = outline.segments.map(s => {
      //   return {
      //     x: s.point.x,
      //     y: s.point.y
      //   };
      // });
      // const simplifiedPoints = simplify(points, 0.03);
      // console.log(points.map((p) => [p.x, p.y]));
      // const newOutlinePoints = simplifiedPoints.map((p) => new paper.Point(p.x, p.y));
      // console.log(newOutlinePoints)
      // outline = new paper.Path(newOutlinePoints);
      // outline.closePath();
      // console.log(points);
      // console.log(simplify);
      // console.log(simplify(points, 0.01));

      // outline.strokeColor = "green";
      // outline.strokeWidth = 0.05;
      // outline.fillColor = 'green';

      if (params.debug) {
        outline.strokeColor = "green";
        outline.strokeWidth = 0.05;
        // need to insert also
      }

      // outline.simplify({ tolerance: 0.2 });
// 
      // if (this.smoothOutline) {
        outline = roundCorners({ paper, path: outline, radius: 0.9 })
        


        // outline.smooth({ type: 'catmull-rom', factor: 0.1 });
      // }

    }

    return new InnerCompletedModel({
      paths,
      outline
    });
  }
}
