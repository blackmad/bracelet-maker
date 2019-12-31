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

import { addToDebugLayer } from "../../utils/debug-layers";
import { makeConcaveOutline } from "../../utils/outline";
import { roundCorners } from "../../utils/round-corners";
import { containsOrIntersects } from "../../utils/paperjs-utils";

export interface InnerDesignModel {
  paths: paper.PathItem[];
  outlinePaths?: paper.PathItem[];
}

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

  public abstract makeDesign(
    scope: any,
    params: any
  ): Promise<InnerDesignModel>;
  abstract get designMetaParameters(): MetaParameter<any>[];

  get metaParameters() {
    let metaParams: MetaParameter<any>[] = [
      new OnOffMetaParameter({
        title: "Debug",
        name: "debug",
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
          value: true,
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
          value: 0.25,
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

  private initRNGs(params: any) {
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
  }

  private maybeSmooth(
    paper: paper.PaperScope,
    params: any,
    paths: paper.PathItem[]
  ) {
    if (params.shouldSmooth) {
      return paths.map(path =>
        roundCorners({ paper, path: path, radius: params.smoothingFactor })
      );
    }
    return paths;
  }

  private clampPathsToBoundary(
    paths: paper.PathItem[],
    boundary: paper.Path,
  ) {
    return paths.map(m => {
      return m.intersect(boundary, { insert: false });
    });
  }

  private makeOutline(
    paper: paper.PaperScope,
    params: any,
    paths: paper.PathItem[],
  ) {
    console.log("need to make outline");
    // Make the outline
    let outline = makeConcaveOutline({
      paper,
      paths,
      concavity: params.concavity,
      lengthThreshold: params.lengthThreshold
    });

    // Expand it to our outline border
    outline = paper.Path.prototype.offset.call(outline, params.outlineSize, {
      cap: "miter"
    });

    // If we ended up with an outline that's a compound path,
    // just take the child path that's the biggest
    if (outline instanceof paper.CompoundPath) {
      outline = _.sortBy(
        outline.children,
        (c: paper.Path) => -c.area
      )[0] as paper.Path;
    }

    outline.closePath();
    outline = roundCorners({ paper, path: outline, radius: 0.9 });

    return outline;

    // This logic is supposed to be for if we have a design that feeds us circles or curves
    // point sampling concave outline isn't going to give us nice curves
    // but I don't have a great way right now to detect if I want that logic - like
    // I probably don't want to do this version for rounded shapes?
    // } else {
    //   paths.map(p => {
    //     const exploded = paper.Path.prototype.offset.call(
    //       p,
    //       params.outlineSize,
    //       { cap: "miter" }
    //     );
    //     outline = outline.unite(exploded);
    //   });
    // }
  }

  private maybeMakeOutline(
    paper: paper.PaperScope,
    params: any,
    _paths: paper.PathItem[],
    design: InnerDesignModel
  ) {
    let outline: paper.PathItem = null;
    let paths: paper.PathItem[] = _paths;

    const shouldMakeOutline =
      params.boundaryModel.bounds.height > params.outerModel.bounds.height;

    if (this.allowOutline && shouldMakeOutline) {
      addToDebugLayer(paper, 'safeCone', params.safeCone);

      if (design.outlinePaths) {
        console.log('but using outline paths')
        // if an inner design has been nice to us by making its own outline, just use that
        let outlinePaths = design.outlinePaths;
        if (this.requiresSafeConeClamp) {
          outlinePaths = this.clampPathsToBoundary(outlinePaths, params.safeCone);
        }
        outline = new paper.CompoundPath(outlinePaths);
      } else {
        ExtendPaperJs(paper);
  
        // only look at paths that are inside the model to make into the outline
        // NOTE(blackmad): why?????
        paths = paths.filter(p =>
          p.intersects(params.outerModel)
          // containsOrIntersects({ needle: p, haystack: params.outerModel })
        );

        outline = this.makeOutline(paper, params, paths);
      }
    }
    return {outline, paths};
  }

  public async make(paper: any, params: any): Promise<InnerCompletedModel> {
    const self = this;

    this.initRNGs(params);

    const design = await self.makeDesign(paper, params);

    // filter out possibly null paths for ease of designs
    let paths = design.paths.filter(p => !!p);

    // maybe smooth paths
    paths = this.maybeSmooth(paper, params, paths);

    const shouldMakeOutline =
      params.boundaryModel.bounds.height > params.outerModel.bounds.height;
    if (this.needSubtraction && !shouldMakeOutline) {
      paths = this.clampPathsToBoundary(paths, params.boundaryModel);
    }

    if (this.requiresSafeConeClamp) {
      console.log('clamping to cone')
      paths = this.clampPathsToBoundary(paths, params.safeCone);
    }

    const maybeOutline = this.maybeMakeOutline(paper, params, paths, design);
    paths = maybeOutline.paths;
    const outline = maybeOutline.outline;

    return new InnerCompletedModel({
      paths,
      outline
    });
  }
}
