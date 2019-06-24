import { DavidsPlayground } from "./new-playground";
import { ModelMaker } from "../model";

import { ConicCuffOuter } from "../designs/conic-cuff";
import { StraightCollar } from "../designs/collar";
import { PostureCollar } from "../designs/posture-collar";

import { InnerDesignCircles } from "../designs/inner-design-circles";
import { InnerDesignCirclePacking } from "../designs/inner-design-circle-packing";
import { InnerDesignVera } from "../designs/inner-design-vera";
import { InnerDesignHashmarks } from "../designs/inner-design-hashmarks";
import { InnerDesignCirclesXVera } from "../designs/inner-design-circles-x-vera";
import { InnerDesignVoronoi } from "../designs/inner-design-voronoi";
import { InnerDesignHexes } from "../designs/inner-design-hexes";
import { InnerDesignLines } from "../designs/inner-design-lines";
import { InnerDesignMondrian } from "../designs/inner-design-mondrian";



import * as $ from "jquery";

function attachHandlers() {
  $("#playArea").hide();
  $(".algoPattern").hide();
  
  let innerDesignClass = null;
  let outerDesignClass = null;
  
  function trySetDesign() {
    if (outerDesignClass) {
      $('.algoPattern').show();
      if (innerDesignClass) {
        const innerDesign = new innerDesignClass();
        const modelMaker: ModelMaker = new outerDesignClass(innerDesign);
        $('.clear-on-reinit').empty();
        new DavidsPlayground(modelMaker, [modelMaker, innerDesign]).rerender();
      }
    }
  }``
  
  // outer
  const possibleOuterDesigns = [
    StraightCollar,
    ConicCuffOuter,
    PostureCollar
  ];
  
  const possibleOuterDesignNameMap = {};
  possibleOuterDesigns.forEach(d => {
    possibleOuterDesignNameMap[d.name] = d;
  });
  
  possibleOuterDesigns.forEach(d => {
    if (window.location.hash.indexOf(d.name + '.') > 0) {
      setOuterDesignFromName(d.name);
    }
  });
  
  function setOuterDesignFromName(name: String) {
    outerDesignClass = possibleOuterDesigns.find(d => d.name == name);

    if (!outerDesignClass) {
      throw "can't interpret design: " + name;
    }
  
    trySetDesign();
  }

  $(".outerDesignButton").click(function(button) {
    const design = (<HTMLInputElement>button.target).value;
    window.location.hash = '';
    setOuterDesignFromName(design);
  });
  

  
  // inner

  const possibleDesigns = [
    InnerDesignVoronoi,
    InnerDesignHashmarks,
    InnerDesignCircles,
    InnerDesignVera,
    InnerDesignCirclesXVera,
    InnerDesignCirclePacking,
    InnerDesignHexes,
    InnerDesignLines,
    InnerDesignMondrian
  ];
  
  
  const possibleDesignNameMap = {};
  possibleDesigns.forEach(d => {
    possibleDesignNameMap[d.name] = d;
  });


 function setInnerDesignFromName(name: String) {
    innerDesignClass = possibleDesigns.find(d => d.name == name);

    if (!innerDesignClass) {
      throw "can't interpret design: " + name;
    }
  
    trySetDesign();
  }

  possibleDesigns.forEach(d => {
    if (window.location.hash.indexOf(d.name + '.') > 0) {
      setInnerDesignFromName(d.name);
    }
  });

  $(".designButton").click(function(button) {
    const design = (<HTMLInputElement>button.target).value;
    window.location.hash = '';
    setInnerDesignFromName(design);
  });
}

$(document).ready(attachHandlers);