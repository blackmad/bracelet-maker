import { AllInnerDesigns } from '../designs/inner/all';
import { AllOuterDesigns } from '../designs/outer/all';

import {makeSVGData} from '../utils/paperjs-export-utils';

import { PaperModelMaker } from '../model-maker';

function demoDesign(paper: paper.PaperScope, designClass: PaperModelMaker) {
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

  designClass.make(paper, params)

  return makeSVGData(paper, false)
}

function demoAllDesigns(paper: paper.PaperScope) {
  const ret = {}
  AllInnerDesigns.forEach((innerDesign) => {
    ret[innerDesign.name] = demoDesign(paper, new innerDesign())
  })
}
