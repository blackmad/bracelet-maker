import {makeSVGData} from '../utils/paperjs-export-utils';

import { OuterPaperModelMaker, PaperModelMaker, CompletedModel, InnerCompletedModel } from '../model-maker';

export async function demoDesign(
  paper: paper.PaperScope, 
  designClass: PaperModelMaker | OuterPaperModelMaker,
  elHydrator: (svg) => any) {
  const params = {};
  designClass.metaParameters.forEach((metaParam) =>
    params[metaParam.name] = metaParam.value
  );

  const outerRect = new paper.Path.Rectangle(
    new paper.Rectangle(0, 0, 3, 3)
  )
  const boundaryRect = outerRect.clone();
  boundaryRect.scale(0.85)
  params['boundaryModel'] = boundaryRect;
  params['outerModel'] = outerRect;
  params[designClass.constructor.name] = params;

  let innerDesign = await designClass.make(paper, params)

  let paths: paper.PathItem[] = []
  if (innerDesign instanceof CompletedModel) {
    const pathItem: paper.PathItem = (<CompletedModel>innerDesign).outer
    paths = [(<CompletedModel>innerDesign).outer];
  } else if (innerDesign instanceof InnerCompletedModel) {
    paths = [outerRect, ...(<InnerCompletedModel>innerDesign).paths];
  }
  console.log(paths);

  // @ts-ignore
  const path = new paper.CompoundPath({
    // @ts-ignore
    children: paths,
    strokeColor: 'red',
    strokeWidth: '0.005',
    fillColor: 'lightgrey',
    fillRule: 'evenodd'
  });

  paper.project.activeLayer.addChild(path);

  return makeSVGData(paper, paper.project, false, elHydrator);
}