const makerjs = require("makerjs");
import { MetaParameter } from '../../meta-parameter'

import { FastAbstractInnerDesign } from './fast-abstract-inner-design';

export class InnerDesignEmpty extends FastAbstractInnerDesign {
  makeDesign(params) {
    return {}
  }

  get designMetaParameters(): Array<MetaParameter> {
    return [];
  }
}
