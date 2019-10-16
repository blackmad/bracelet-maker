import { MetaParameter } from "./meta-parameter";

export interface PaperModelMaker {
  subModel?: PaperModelMaker;
  readonly metaParameters: Array<MetaParameter>;
  make(scope: paper.PaperScope, params: any): paper.PathItem[];
  controlInfo: string;

}