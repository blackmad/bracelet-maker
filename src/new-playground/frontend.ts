import { DavidsPlayground } from './new-playground';
import { OuterPaperModelMaker } from '../model-maker';

import * as $ from 'jquery';
import { AllInnerDesigns } from '../designs/inner/all';
import { AllOuterDesigns } from '../designs/outer/all';

let innerDesignClass = null;
let outerDesignClass = null;

function setInnerDesignFromName(name: String) {
  innerDesignClass = AllInnerDesigns.find(d => d.name == name);

  if (!innerDesignClass) {
    throw "can't interpret design: " + name;
  }

  trySetDesign();
}

function trySetDesign() {
  if (outerDesignClass) {
    $('.algoPattern').show();
    if (innerDesignClass) {
      const innerDesign = new innerDesignClass();
      const modelMaker: OuterPaperModelMaker = new outerDesignClass(innerDesign);
      $('.clear-on-reinit').empty();
      new DavidsPlayground(modelMaker).rerender();
      $('.startHidden').show();
      $('.hideAfterDesignSelected').hide();
      return true;
    }
  }
  return false;
}

function setOuterDesignFromName(name: String) {
  outerDesignClass = AllOuterDesigns.find(d => d.name == name);

  if (!outerDesignClass) {
    throw "can't interpret design: " + name;
  }

  $('.outer-design-container').hide();

  return trySetDesign();
}

function generateDesignButton({
  containerSelector,
  designName,
  designClassName,
  extraButtonClassNames,
  clickCb
}) {
  const html = `
  <div class="design-container col-sm-12 col-md-4">

  <div class="panel panel-default border m-1 p-1">
  <div class="panel-body text-center"><img src="demo-output/${designClassName}.png"/></div>
  <div class="panel-footer  text-center ">           <button
  class=" btn-primary btn-sm m-1 ${extraButtonClassNames}"
  value="${designClassName}"
>
  ${designName}
</button>
</div>
</div>
</div>
`;
  const elem = $(html);
  elem.click(clickCb);
  // elem.find('button').click(clickCb);

  $(containerSelector).append(elem);
}

function generateDesignButtons() {
  AllInnerDesigns.forEach(innerDesign => {
    function clickCb() {
      setInnerDesignFromName(innerDesign.name);
    }

    generateDesignButton({
      containerSelector: '.inner-design-row',
      designName: innerDesign.name.replace('InnerDesign', ''),
      designClassName: innerDesign.name,
      extraButtonClassNames: 'designButton',
      clickCb
    });
  });

  AllOuterDesigns.forEach(outerDesign => {
    function clickCb() {
      window.location.hash = '';
      setOuterDesignFromName(outerDesign.name);
    }

    generateDesignButton({
      containerSelector: '.outer-design-row',
      designName: outerDesign.name.replace('Outer', ''),
      designClassName: outerDesign.name,
      extraButtonClassNames: 'outerDesignButton',
      clickCb
    });
  });
}

function attachHandlers() {
  $('#initMessage').show();

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
  } else if (outerDesignClass) {
    $('.inner-design-container').show();
  } else {
    $('.control-selectors').show();
  }

  generateDesignButtons();
}

$(document).ready(attachHandlers);