import { RangeMetaParameter } from "../../meta-parameter";
import { randomLineEndpointsOnRectangle } from "../../utils/paperjs-utils";
import { AbstractExpandInnerDesign } from "./abstract-expand-and-subtract-inner-design";
export class InnerDesignLines extends AbstractExpandInnerDesign {
    constructor() {
        super(...arguments);
        this.allowOutline = true;
    }
    makePaths(paper, params) {
        const { boundaryModel, outerModel, numLines } = params;
        const lines = [];
        for (let c = 0; c < numLines; c++) {
            const line = randomLineEndpointsOnRectangle(paper, outerModel.bounds, this.rng);
            lines.push(line);
        }
        return lines;
    }
    get pathDesignMetaParameters() {
        return [
            new RangeMetaParameter({
                title: "Num Lines",
                min: 1,
                max: 100,
                value: 20,
                step: 1,
                name: "numLines"
            })
        ];
    }
}
//# sourceMappingURL=lines.js.map