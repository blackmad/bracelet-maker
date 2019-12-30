import { MetaParameter } from '../../meta-parameter'

import { FastAbstractInnerDesign } from './fast-abstract-inner-design';

export class InnerDesignEmpty extends FastAbstractInnerDesign {
  makeDesign(scope, params) {
    return Promise.resolve({paths: params.boundaryModel});
  }

  get designMetaParameters() {
    return [];
  }
}
