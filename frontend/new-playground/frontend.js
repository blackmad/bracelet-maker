import {DavidsPlayground} from './new-playground.js'
import {ConicCuffOuter} from '../designs/conic-cuff-model.mjs'

import {InnerDesignHashmarks} from '../designs/inner-design-hashmarks.mjs';
import {InnerDesignVoronoi} from '../designs/inner-design-voronoi.mjs';
import {InnerDesignCircles} from '../designs/inner-design-circles.mjs';
import {InnerDesignVera} from '../designs/inner-design-vera.mjs'
import {InnerDesignCirclesXVera} from '../designs/inner-design-circles-x-vera.mjs'

let playground = null;

function attachHandlers() {
    const possibleDesigns = [InnerDesignVoronoi, InnerDesignHashmarks, InnerDesignCircles, InnerDesignVera, InnerDesignCirclesXVera];
    const possibleDesignNameMap = {}
    possibleDesigns.forEach(d => { possibleDesignNameMap[d.name] = d })

    function setDesign(designClass) {
        const modelMaker = function(options) {
            return ConicCuffOuter(designClass)(options);
        }

        playground = new DavidsPlayground({modelMaker: modelMaker, subModels: [ConicCuffOuter, designClass]}).rerender();
    }

    possibleDesigns.forEach(d => {
        if (window.location.hash.indexOf(d.name) > 0) {
            setDesign(d);
        }
    });

    $('.designButton').click(function(button) {
        const design = button.target.value;
        var innerDesignClass = null;
        if (possibleDesignNameMap[design]) {
            window.location.hash = '';
            setDesign(possibleDesignNameMap[design]);
        } else {
            throw "can't interpret design: " + design;
        }
    })
}

$(document).ready(attachHandlers);

export default {} 