import { makeSVGData } from "../utils/paperjs-export-utils";
import * as _ from 'lodash';

import {
  OuterPaperModelMaker,
  PaperModelMaker,
  CompletedModel,
  InnerCompletedModel,
} from "../model-maker";

export async function demoDesign(
  paper: paper.PaperScope,
  designClass: PaperModelMaker | OuterPaperModelMaker,
  elHydrator: (svg) => any,
  shouldRandomize: boolean,
  bounds: paper.Rectangle = new paper.Rectangle(0, 0, 3, 3),
  initialParams: any = {},
  minimumAreaRatio: number = 0.0,
  numMetaParametersToChange: number = 1000
) {
  const params = {...initialParams};

  _.shuffle(designClass.metaParameters).slice(0, numMetaParametersToChange).forEach(
    (metaParam) => {
      if (shouldRandomize) {
        params[metaParam.name] = metaParam.getRandomValue();
      } else {
        params[metaParam.name] = metaParam.value
      }
  });

  (params as any).breakThePlane = false;

  params['seed'] = shouldRandomize ? params['seed']: 1;

  const inputParams = {...params};

  params[designClass.constructor.name] = params;

  const outerRect = new paper.Path.Rectangle(bounds);
  const boundaryRect = outerRect.clone();
  boundaryRect.scale(0.95);
  params["boundaryModel"] = boundaryRect;
  params["outerModel"] = outerRect;
  params["safeCone"] = boundaryRect;

  let innerDesign = await designClass.make(paper, params);

  let paths: paper.PathItem[] = [];
  if (innerDesign instanceof CompletedModel) {
    const pathItem: paper.PathItem = (<CompletedModel>innerDesign).outer;
    paths = [(<CompletedModel>innerDesign).outer];
  } else {
    const innerPaths = (<InnerCompletedModel>innerDesign).paths;

    paths = [outerRect, ...innerPaths];
  }

  // @ts-ignore
  const path = new paper.CompoundPath({
    // @ts-ignore
    children: paths,
    strokeColor: "red",
    strokeWidth: "0.005",
    fillColor: "lightgrey",
    fillRule: "evenodd",
  });

  const outerArea = outerRect.area;
  const innerArea = path.area;

  console.log({outerArea, innerArea}, innerArea/outerArea);

  let svg;
  if ((innerArea/outerArea) > minimumAreaRatio) {
    paper.project.activeLayer.addChild(path);
    svg = makeSVGData(paper, paper.project, false, elHydrator);
  }

  return {
    svg,
    params: inputParams
  }
}
