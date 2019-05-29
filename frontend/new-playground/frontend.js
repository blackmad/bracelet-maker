import {DavidsPlayground} from './new-playground.js'
import {ConicCuffOuter} from '../conic-cuff-model.js'

import {InnerDesignHashmarks} from '../inner-design-hashmarks.js';
import {InnerDesignVoronoi} from '../inner-design-voronoi.js';
import {InnerDesignNoiseWaves} from '../inner-design-noisewaves.js'
import {InnerDesignCircles} from '../inner-design-circles.js';
import {InnerDesignVera} from '../inner-design-vera.js'

let playground = null;

function attachHandlers() {
    const possibleDesigns = [InnerDesignVoronoi, InnerDesignHashmarks, InnerDesignCircles, InnerDesignVera]
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