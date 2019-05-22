import {DavidsPlayground} from './new-playground.js'
import {ConicCuffOuter} from '../conic-cuff-model.js'

import {InnerDesignHashmarks} from '../inner-design-hashmarks.js';
import {InnerDesignVoronoi} from '../inner-design-voronoi.js';
import {InnerDesignNoiseWaves} from '../inner-design-noisewaves.js'

let playground = null;

function attachHandlers() {
    $('.designButton').click(function(button) {
        const design = button.target.value;
        var innerDesignClass = null;
        if (design == 'InnerDesignVoronoi') {
            innerDesignClass = InnerDesignVoronoi;
        } else if (design == 'InnerDesignHashmarks') {
            innerDesignClass = InnerDesignHashmarks;
        } else {
            throw "can't interpret design: " + design;
        }

        const modelMaker = function(options) {
            return ConicCuffOuter(innerDesignClass)(options);
        }

        playground = new DavidsPlayground({modelMaker: modelMaker, subModels: [ConicCuffOuter, innerDesignClass]}).rerender();
    })
}

$(document).ready(attachHandlers);

export default {} 