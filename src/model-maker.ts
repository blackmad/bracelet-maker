import * as paper from "paper";

import { MetaParameter } from "./meta-parameter";

export interface ModelMaker {
    subModels?: Array<ModelMaker>;
    readonly metaParameters: Array<MetaParameter>;
    make(params: any): MakerJs.IModel;
}

export interface PaperModelMaker {
  subModels?: Array<PaperModelMaker>;
  readonly metaParameters: Array<MetaParameter>;
  make(scope: any, params: any): paper.PathItem[];
}