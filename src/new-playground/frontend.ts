import { DavidsPlayground } from './new-playground';
import { PaperModelMaker } from '../model-maker';

import * as $ from 'jquery';
import { AllInnerDesigns } from '../designs/inner/all';
import { AllOuterDesigns } from '../designs/outer/all';

function attachHandlers() {
  $('#initMessage').show();

  let innerDesignClass = null;
  let outerDesignClass = null;

  function trySetDesign() {
    if (outerDesignClass) {
      $('.algoPattern').show();
      if (innerDesignClass) {
        const innerDesign = new innerDesignClass();
        const modelMaker: PaperModelMaker = new outerDesignClass(innerDesign);
        $('.clear-on-reinit').empty();
        new DavidsPlayground(modelMaker, [modelMaker, innerDesign]).rerender();
        $('.startHidden').show();
        $('.hideAfterDesignSelected').hide();
        return true;
      }
    }
    return false;
  }
  ``;

  // outer
  const possibleOuterDesigns = AllOuterDesigns;

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

    return trySetDesign();
  }

  $('.outerDesignButton').click(function(button) {
    const design = (<HTMLInputElement>button.target).value;
    window.location.hash = '';
    setOuterDesignFromName(design);
  });

  $('.changeDesign').click(function() {
    innerDesignClass = null;
    outerDesignClass = null;
    $('.playArea').hide();
    $('#previewArea').hide();
    $('.control-selectors').show();
  });

 
  const possibleDesigns = AllInnerDesigns;
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

  $('.designButton').click(function(button) {
    const design = (<HTMLInputElement>button.target).value;
    window.location.hash = '';
    setInnerDesignFromName(design);
  });

  $('#initMessage').hide();
  if (innerDesignClass) {
    $('.control-selectors').hide();
  } else {
    $('.control-selectors').show();
  }  
}

$(document).ready(attachHandlers);
