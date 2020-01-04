import { RangeMetaParameter } from '../../meta-parameter';
import * as _ from 'lodash';

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

  public controlInfo = "It's a box"

  public async make(paper: paper.PaperScope, options): Promise<CompletedModel> {
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
    // TODO(blackmad): real safeCone here
    innerOptions.safeCone = safeArea;
    innerOptions.outerModel = outerModel;

    const innerDesign = await this.subModel.make(paper, innerOptions);

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
