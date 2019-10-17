import { makeSVGData } from '../utils/paperjs-export-utils';
export function demoDesign(paper, designClass, elHydrator) {
    const params = {};
    designClass.metaParameters.forEach((metaParam) => params[metaParam.name] = metaParam.value);
    const outerRect = new paper.Path.Rectangle(new paper.Rectangle(0, 0, 3, 3));
    params['boundaryModel'] = outerRect;
    params['outerModel'] = outerRect;
    params[designClass.constructor.name] = params;
    const innerDesign = designClass.make(paper, params);
    // @ts-ignore
    let paths = [innerDesign];
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
//# sourceMappingURL=demo.js.map