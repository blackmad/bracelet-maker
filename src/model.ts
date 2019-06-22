import { MetaParameter } from "./meta-parameter";

export interface ModelMaker {
    subModels?: Array<ModelMaker>;
    readonly metaParameters: Array<MetaParameter>;
    make(params: Map<string, any>): MakerJs.IModel;
}