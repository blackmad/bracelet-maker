import { FastAbstractInnerDesign } from './fast-abstract-inner-design';
export class InnerDesignEmpty extends FastAbstractInnerDesign {
    makeDesign(scope, params) {
        return [params.boundaryModel];
    }
    get designMetaParameters() {
        return [];
    }
}
//# sourceMappingURL=empty.js.map