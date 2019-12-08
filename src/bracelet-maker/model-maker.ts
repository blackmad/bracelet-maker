import { MetaParameter } from "./meta-parameter";

export interface HasMetaParameters { 
  readonly metaParameters: Array<MetaParameter>;

}

export interface PaperModelMaker extends HasMetaParameters {
  make(scope: paper.PaperScope, params: any): paper.PathItem[];
  controlInfo: string;
}

export class CompletedModel {
  outer: paper.PathItem;
  holes: paper.PathItem[];
  design: paper.PathItem[];

  constructor({outer, holes, design}: {
    outer: paper.PathItem,
    holes: paper.PathItem[],
    design: paper.PathItem[]
  }) {
    this.outer = outer;
    this.holes = holes;
    this.design = design;
  }
}

export interface OuterPaperModelMaker extends HasMetaParameters {
  subModel: PaperModelMaker;
  make(scope: paper.PaperScope, params: any): CompletedModel;
  controlInfo: string;
}