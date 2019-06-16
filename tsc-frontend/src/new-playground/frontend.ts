import { DavidsPlayground } from "./new-playground";
import { ModelMaker } from "../model";

import { ConicCuffOuter } from "../designs/conic-cuff";

import { InnerDesignCircles } from "../designs/inner-design-circles";
import { InnerDesignCirclePacking } from "../designs/inner-design-circle-packing";
import { InnerDesignVera } from "../designs/inner-design-vera";
import { InnerDesignHashmarks } from "../designs/inner-design-hashmarks";
import { InnerDesignCirclesXVera } from "../designs/inner-design-circles-x-vera";
import { InnerDesignVoronoi } from "../designs/inner-design-delaunay";
import { InnerDesignHexes } from "../designs/inner-design-hexes";

import * as $ from "jquery";

function attachHandlers() {
  $("#playArea").hide();

  const possibleDesigns = [
    InnerDesignVoronoi,
    InnerDesignHashmarks,
    InnerDesignCircles,
    InnerDesignVera,
    InnerDesignCirclesXVera,
    InnerDesignCirclePacking,
    InnerDesignHexes
  ];
  const possibleDesignNameMap = {};
  possibleDesigns.forEach(d => {
    possibleDesignNameMap[d.name] = d;
  });

  function setDesign(designClass: ModelMaker) {
    const modelMaker: ModelMaker = new ConicCuffOuter(designClass);
    new DavidsPlayground(modelMaker, [modelMaker, designClass]).rerender();
  }

  function setDesignFromName(name: String) {
    const innerDesignClass = possibleDesigns.find(d => d.name == name);

    if (!innerDesignClass) {
      throw "can't interpret design: " + name;
    }

    setDesign(new innerDesignClass());
  }

  possibleDesigns.forEach(d => {
    if (window.location.hash.indexOf(d.name) > 0) {
      setDesignFromName(d.name);
    }
  });

  $(".designButton").click(function(button) {
    const design = (<HTMLInputElement>button.target).value;
    setDesignFromName(design);
  });
}

$(document).ready(attachHandlers);
