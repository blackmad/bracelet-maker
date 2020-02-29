import { RangeMetaParameter } from "../../meta-parameter";
import * as _ from "lodash";

import { CompletedModel, OuterPaperModelMaker } from "../../model-maker";
import { roundCorners } from "../../utils/round-corners";

import { bufferPath } from "@/bracelet-maker/utils/paperjs-utils";

export class BoxOuter implements OuterPaperModelMaker {
  get metaParameters() {
    return [
      new RangeMetaParameter({
        title: "Height",
        min: 0.1,
        max: 20,
        value: 3,
        step: 0.01,
        name: "height"
      }),
      new RangeMetaParameter({
        title: "TopWidth",
        min: 0.1,
        max: 20,
        value: 3,
        step: 0.01,
        name: "topWidth"
      }),
      new RangeMetaParameter({
        title: "Bottom Width",
        min: 0.1,
        max: 20,
        value: 3,
        step: 0.01,
        name: "bottomWidth"
      }),
      new RangeMetaParameter({
        title: "Safe Border Width",
        min: -0.25,
        max: 0.25,
        value: 0.1,
        step: 0.01,
        name: "safeBorderWidth",
        target: ".design-params-row"
      }),
      new RangeMetaParameter({
        title: "Smoothing Factor",
        min: 0.01,
        max: 1.0,
        value: 0.8,
        step: 0.01,
        name: "smoothingFactor"
      })
    ];
  }

  constructor(public subModel: any) {}

  public controlInfo = "It's a box";

  public async make(paper: paper.PaperScope, options): Promise<CompletedModel> {
    let { height, topWidth, bottomWidth, safeBorderWidth, debug = false, smoothingFactor } = options[
      this.constructor.name
    ];

    let outerModel: paper.Path = new paper.Path();

    if (topWidth >= bottomWidth) {
      outerModel.add(new paper.Point(0, 0));
      outerModel.add(new paper.Point((topWidth - bottomWidth) / 2, height));
      outerModel.add(new paper.Point((topWidth - bottomWidth) / 2 + bottomWidth, height));
      outerModel.add(new paper.Point(topWidth, 0));
      outerModel.closePath();
    } else {
      outerModel.add(new paper.Point((bottomWidth - topWidth) / 2, 0));
      outerModel.add(new paper.Point(0, height));
      outerModel.add(new paper.Point(bottomWidth, height));
      outerModel.add(new paper.Point((bottomWidth - topWidth) / 2 + topWidth, 0));
      outerModel.closePath();
    }

    outerModel = roundCorners({ paper, path: outerModel, radius: smoothingFactor })


    let safeArea = bufferPath(paper, -safeBorderWidth, outerModel);

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
