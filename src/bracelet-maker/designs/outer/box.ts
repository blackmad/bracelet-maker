import { RangeMetaParameter } from '../../meta-parameter';
import * as _ from 'lodash';
import {
  makeEvenlySpacedBolts,
  BeltHoleRadius,
  RivetRadius
} from '../design-utils';

import { PaperModelMaker, CompletedModel, OuterPaperModelMaker } from '../../model-maker';

export class BoxOuter implements OuterPaperModelMaker {

  get metaParameters() {
    return [
      new RangeMetaParameter({
        title: 'Height',
        min: 0.1,
        max: 20,
        value: 3,
        step: 0.01,
        name: 'height'
      }),
      new RangeMetaParameter({
        title: 'Width',
        min: 0.1,
        max: 20,
        value: 3,
        step: 0.01,
        name: 'width'
      }),
      new RangeMetaParameter({
        title: 'Safe Border Width',
        min: -0.25,
        max: 0.25,
        value: 0.1,
        step: 0.01,
        name: 'safeBorderWidth',
        target: '.design-params-row'
      }),
    ]
  }

  constructor(public subModel: any) {}

  public make(paper: paper.PaperScope, options): CompletedModel {
    let { height, width, safeBorderWidth, debug = false } = options[
      this.constructor.name
    ];

    let outerModel = new paper.Path.Rectangle(
      new paper.Rectangle(0, 0, width, height),
    );

    let safeArea = new paper.Path.Rectangle(
      new paper.Rectangle(safeBorderWidth, safeBorderWidth, width-2*safeBorderWidth, height-2*safeBorderWidth),
    );


    const innerOptions = options[this.subModel.constructor.name] || {};
    innerOptions.boundaryModel = safeArea;
    // innerOptions.safeCone = safeCone;
    innerOptions.outerModel = outerModel;

    const innerDesign = this.subModel.make(paper, innerOptions);

    if (innerDesign.outline) {
      const oldCuffOuter = outerModel;

      // @ts-ignore
      outerModel = outerModel.unite(innerDesign.outline);

    }

    return new CompletedModel({
      outer: outerModel, 
      holes: [],
      design: innerDesign.paths
    });
  }
}
