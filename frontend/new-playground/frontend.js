import {DavidsPlayground} from './new-playground.js'
import {ConicCuffOuter} from '../conic-cuff-model.js'

import {InnerDesignHashmarks} from '../inner-design-hashmarks.js';
import {InnerDesignVoronoi} from '../inner-design-voronoi.js';
import {InnerDesignNoiseWaves} from '../inner-design-noisewaves.js'
import {InnerDesignCircles} from '../inner-design-circles.js';

let playground = null;

function attachHandlers() {
    const possibleDesigns = [InnerDesignVoronoi, InnerDesignHashmarks, InnerDesignCircles]
    const possibleDesignNameMap = {}
    possibleDesigns.forEach(d => { possibleDesignNameMap[d.name] = d })

    function setDesign(designClass) {
        const modelMaker = function(options) {
            return ConicCuffOuter(designClass)(options);
        }

        playground = new DavidsPlayground({modelMaker: modelMaker, subModels: [ConicCuffOuter, designClass]}).rerender();
    }

    possibleDesigns.forEach(d => {
        console.log(d.name);
        console.log(window.location.hash);
        if (window.location.hash.indexOf(d.name) > 0) {
            console.log('setting to ' + d)
            setDesign(d);
        }
    });

    $('.designButton').click(function(button) {
        const design = button.target.value;
        var innerDesignClass = null;
        if (possibleDesignNameMap[design]) {
            setDesign(possibleDesignNameMap[design]);
        } else {
            throw "can't interpret design: " + design;
        }
    })
}

$(document).ready(attachHandlers);

export default {} 