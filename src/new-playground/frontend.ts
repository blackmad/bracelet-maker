import { DavidsPlayground } from "./new-playground";
import { ModelMaker } from "../model-maker";

import { ConicCuffOuter } from "../designs/outer/conic-cuff";
import { StraightCollarOuter } from "../designs/outer/collar";
import { StraightCuffOuter } from "../designs/outer/straight-cuff";


// import { InnerDesignCircles } from "../designs/inner-design-circles";
import { InnerDesignCirclePacking } from "../designs/inner/circle-packing";
import { InnerDesignVera } from "../designs/inner/vera";
import { InnerDesignHashmarks } from "../designs/inner/hashmarks";
import { InnerDesignCirclesXVera } from "../designs/inner/circles-x-vera";
// import { InnerDesignVoronoi } from "../designs/inner/voronoi";
// import { InnerDesignLattice } from "../designs/inner/lattice";
import { InnerDesignHexes } from "../designs/inner/hexes";
import { InnerDesignLines } from "../designs/inner/lines";
import { InnerDesignMondrian } from "../designs/inner/mondrian";
// import { InnerDesignExplode } from "../designs/inner/explode"
import { InnerDesignGrid } from "../designs/inner/grid"
import { InnerDesignEmpty } from "../designs/inner/empty"


// import { InnerDesignHingedTesselation } from "../designs/inner-design-hinged-tesselation";

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
    StraightCollarOuter,
    ConicCuffOuter,
    StraightCuffOuter
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

  const possibleDesigns = [
    // InnerDesignVoronoi,
    InnerDesignHashmarks,
    // InnerDesignLattice,
    // InnerDesignCircles,
    InnerDesignVera,
    InnerDesignCirclesXVera,
    InnerDesignCirclePacking,
    InnerDesignHexes,
    InnerDesignLines,
    InnerDesignMondrian,
    // InnerDesignExplode,
    // InnerDesignGrid,
    InnerDesignEmpty
    // InnerDesignHingedTesselation
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