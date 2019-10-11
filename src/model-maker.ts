import { MetaParameter } from "./meta-parameter";

export interface PaperModelMaker {
  subModels?: Array<PaperModelMaker>;
  readonly metaParameters: Array<MetaParameter>;
  make(scope: paper.PaperScope, params: any): paper.PathItem[];
}