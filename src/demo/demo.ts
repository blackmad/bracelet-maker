import { AllInnerDesigns } from '../designs/inner/all';
import { AllOuterDesigns } from '../designs/outer/all';

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
  console.log(params);

  const innerDesign = designClass.make(paper, params)
  // @ts-ignore
  console.log(innerDesign.paths)
// @ts-ignore
  const path = new paper.CompoundPath({
    // @ts-ignore
    children: [...innerDesign.paths],
    strokeColor: 'red',
    strokeWidth: '0.005',
    fillColor: 'lightgrey',
    fillRule: 'evenodd'
  });

  return makeSVGData(paper, false, elHydrator);
}

export function demoAllDesigns(paper: paper.PaperScope, elHydrator: (svg) => any) {
  const ret = {}
  AllInnerDesigns.forEach((innerDesign) => {
    console.log(innerDesign.name)
    ret[innerDesign.name] = demoDesign(paper, new innerDesign(), elHydrator)
  })
  return ret;
}
