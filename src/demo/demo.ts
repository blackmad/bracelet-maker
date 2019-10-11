import {makeSVGData} from '../utils/paperjs-export-utils';

import { PaperModelMaker } from '../model-maker';

export function demoDesign(
  paper: paper.PaperScope, 
  designClass: PaperModelMaker,
  elHydrator: (svg) => any) {
  const params = {};
  designClass.metaParameters.forEach((metaParam) =>
    params[metaParam.name] = metaParam.value
  );

  params['boundaryModel'] = new paper.Path.Rectangle(
    new paper.Rectangle(0, 0, 3, 3)
  )
  params['outerModel'] = new paper.Path.Rectangle(
    new paper.Rectangle(0, 0, 3, 3)
  )
  params[designClass.constructor.name] = params;
  console.log(params);

  const innerDesign = designClass.make(paper, params)
  // @ts-ignore
  let paths = [innerDesign]
  if (innerDesign['paths']) {
    // @ts-ignore
    paths = innerDesign.paths;
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

  return makeSVGData(paper, false, elHydrator);
}