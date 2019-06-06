import { DavidsPlayground } from './new-playground'
import { ModelMaker } from '../model';

import { ConicCuffOuter } from '../designs/conic-cuff';

import { InnerDesignCircles } from '../designs/inner-design-circles';
import { InnerDesignCirclePacking } from '../designs/inner-design-circle-packing';
import { InnerDesignVera } from '../designs/inner-design-vera'

import * as $ from "jquery";

// import {InnerDesignHashmarks} from '../designs/inner-design-hashmarks.mjs';
// import {InnerDesignVoronoi} from '../designs/inner-design-voronoi.mjs';
// import {InnerDesignCirclesXVera} from '../designs/inner-design-circles-x-vera.mjs'

function attachHandlers() {
    // const possibleDesigns = [InnerDesignVoronoi, InnerDesignHashmarks, InnerDesignCircles, InnerDesignVera, InnerDesignCirclesXVera];
    const possibleDesigns = [InnerDesignCircles, InnerDesignCirclePacking];
    const possibleDesignNameMap = {}
    possibleDesigns.forEach(d => { possibleDesignNameMap[d.name] = d })
    console.log(possibleDesigns)
    console.log(possibleDesignNameMap)

    function setDesign(designClass: ModelMaker) {
        const modelMaker: ModelMaker = new ConicCuffOuter(designClass)
        new DavidsPlayground(modelMaker, [modelMaker, designClass]).rerender();
    }

    function setDesignFromName(name: String) {
        var innerDesignClass = null;
        if (name == InnerDesignCircles.name) {
            setDesign(new InnerDesignCircles())
        } else if (name == InnerDesignCirclePacking.name) {
            setDesign(new InnerDesignCirclePacking())
        } else if (name == InnerDesignVera.name) {
            setDesign(new InnerDesignVera())
        } else {
            throw "can't interpret design: " + name;
        }
    }

    possibleDesigns.forEach(d => {
        if (window.location.hash.indexOf(d.name) > 0) {
            setDesignFromName(d.name);
        }
    });

    $('.designButton').click(function(button) {
        const design = (<HTMLInputElement>button.target).value;
        setDesignFromName(design);
    })
}

$(document).ready(attachHandlers);