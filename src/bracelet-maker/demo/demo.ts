import {makeSVGData} from '../utils/paperjs-export-utils';

import { OuterPaperModelMaker, PaperModelMaker, CompletedModel } from '../model-maker';

export function demoDesign(
  paper: paper.PaperScope, 
  designClass: PaperModelMaker| OuterPaperModelMaker,
  elHydrator: (svg) => any) {
  const params = {};
  designClass.metaParameters.forEach((metaParam) =>
    params[metaParam.name] = metaParam.value
  );

  const outerRect = new paper.Path.Rectangle(
    new paper.Rectangle(0, 0, 3, 3)
  )
  params['boundaryModel'] = outerRect;
  params['outerModel'] = outerRect;
  params[designClass.constructor.name] = params;

  const innerDesign = designClass.make(paper, params)
  let paths: paper.PathItem[] = []
  if (innerDesign instanceof CompletedModel) {
    const pathItem: paper.PathItem = (<CompletedModel>innerDesign).outer
    paths = [(<CompletedModel>innerDesign).outer];
  } else if (innerDesign instanceof paper.PathItem) {
    paths = [innerDesign]
  }

  // @ts-ignore
  const path = new paper.CompoundPath({
    // @ts-ignore
    children: paths,
    strokeColor: 'red',
    strokeWidth: '0.005',
    fillColor: 'lightgrey',
    fillRule: 'evenodd'
  });

  return makeSVGData(paper, paper.project, false, elHydrator);
}