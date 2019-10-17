import { MetaParameter } from "./meta-parameter";

export interface PaperModelMaker {
  readonly metaParameters: Array<MetaParameter>;
  make(scope: paper.PaperScope, params: any): paper.PathItem[];
  controlInfo: string;
}

export interface OuterPaperModelMaker extends PaperModelMaker {
  subModel: PaperModelMaker;
}