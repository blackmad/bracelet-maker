import * as paper from 'paper';

import * as $ from 'jquery';
import * as _ from 'lodash';
import 'rangeslider.js';

import 'core-js/library';

import { PaperModelMaker } from '../model-maker';
import { MetaParameter, MetaParameterType } from '../meta-parameter';

// @ts-ignore - this works fine, wtf typescript?
import * as PDFDocument from '../external/pdfkit.standalone';
import * as SVGtoPDF from 'svg-to-pdfkit';
import blobStream from 'blob-stream';

function clone(src) {
  return Object.assign({}, src);
}

function parseParamsString(paramsString: string): Map<string, string> {
  const params = new Map<string, string>();
  paramsString.split('&').forEach((p: string) => {
    const parts: string[] = p.split('=');
    params[parts[0]] = decodeURIComponent(parts[1]);
  });
  return params;
}

export class DavidsPlayground {
  private params: Map<string, any>;
  private svgEl: SVGElement;
  private model: MakerJs.IModel;
  private scope: any;

  constructor(
    public modelMaker: PaperModelMaker,
    public subModels: Array<PaperModelMaker> = null,
    public allowPanAndZoom?: boolean
  ) {
    if (this.modelMaker.subModels && !subModels) {
      this.subModels = subModels;
    }
    this.allowPanAndZoom = allowPanAndZoom;
    this.params = new Map();

    if (window.location.hash.length > 1) {
      this.params = parseParamsString(window.location.hash.substring(1));
    }

    this.buildMetaParameterWidgets(document.getElementById('parameterDiv'));

    $('.downloadSVG').off('click');
    $('.downloadSVG').click(this.downloadSVG.bind(this));
    $('.downloadPDF').off('click');
    $('.downloadPDF').click(this.downloadPDF.bind(this));
  }

  rerender() {
    this.makeUrlParams();
    this.doRender();
  }

  makeUrlParams() {
    function encodeGetParams(p: Map<string, any>): string {
      return _.map(p, (value, key) => {
        return (
          encodeURIComponent(key) + '=' + encodeURIComponent(value.toString())
        );
      }).join('&');
    }

    window.location.hash = encodeGetParams(this.params);
  }

  metaParamRequiresNumber(metaParameter) {
    return metaParameter.type == MetaParameterType.Range;
  }

  onParamChange({ metaParameter, value }) {
    if (this.metaParamRequiresNumber(metaParameter)) {
      this.params[metaParameter.name] = Number(value);
    } else {
      this.params[metaParameter.name] = value;
    }
    this.rerender();
  }

  makeMetaParameterSlider(metaParameter) {
    const value =
      Number(this.params[metaParameter.name]) || metaParameter.value;

    const { parentDiv, containingDiv } = this.makeMetaParameterContainer(
      metaParameter.title
    );

    const rangeInput = document.createElement('input');
    rangeInput.type = 'range';
    rangeInput.name = metaParameter.name + '-range';
    rangeInput.min = metaParameter.min;
    rangeInput.max = metaParameter.max;
    rangeInput.step = metaParameter.step;
    rangeInput.id = metaParameter.name + '-range';
    rangeInput.value = value;
    rangeInput.className = 'col-4';

    const inputWrapDiv = document.createElement('div');
    inputWrapDiv.className = 'col-3';
    const textInput = document.createElement('input');
    textInput.type = 'number';
    textInput.min = metaParameter.min;
    textInput.max = metaParameter.max;
    textInput.step = metaParameter.step;
    textInput.id = metaParameter.name + '-num-input';
    textInput.value = value;
    textInput.className = 'mx-1';

    containingDiv.append(rangeInput);
    containingDiv.append(inputWrapDiv);
    inputWrapDiv.append(textInput);

    this.params[metaParameter.name] = Number(value);

    rangeInput.addEventListener(
      'change',
      function(event) {
        const value = event.target.value;
        textInput.value = value;
        this.onParamChange({ metaParameter, value });
      }.bind(this)
    );

    textInput.addEventListener(
      'change',
      function(event) {
        rangeInput.value = event.target.value;
        this.onParamChange({ metaParameter, value: event.target.value });
      }.bind(this)
    );

    return parentDiv;
  }

  makeMetaParameterContainer(title) {
    const sizingDiv = document.createElement('div');
    sizingDiv.className =
      'meta-parameter-container col-md-12 col-lg-6 small border-top border-bottom py-1';

    const containingDiv = document.createElement('div');
    containingDiv.className = 'row';

    sizingDiv.append(containingDiv);

    const textLabelDiv = document.createElement('div');
    textLabelDiv.className = 'col-5';
    textLabelDiv.innerHTML = title;
    containingDiv.append(textLabelDiv);

    // const hr = $('<hr class="d-lg-none"/>');
    // sizingDiv.append(hr[0]);

    return { parentDiv: sizingDiv, containingDiv };
  }

  makeMetaParameterSelect(metaParameter) {
    const selectedValue =
      this.params[metaParameter.name] || metaParameter.value;

    const { parentDiv, containingDiv } = this.makeMetaParameterContainer(
      metaParameter.title
    );

    const colDiv = $('<div class="col-7 leftInputContainer"></div>');
    containingDiv.append(colDiv[0]);

    const selectInput = document.createElement('select');
    selectInput.name = metaParameter.name + '-select';

    metaParameter.options.forEach(optionValue => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.text = optionValue;
      if (optionValue == selectedValue) {
        option.setAttribute('selected', 'selected');
      }
      selectInput.appendChild(option);
    });

    colDiv.append(selectInput);

    this.params[metaParameter.name] = selectedValue;

    selectInput.addEventListener(
      'change',
      function(event) {
        const selectedValue = event.target.selectedOptions[0].value;
        this.onParamChange({ metaParameter, value: selectedValue });
      }.bind(this)
    );

    return parentDiv;
  }

  makeMetaParameterOnOff(metaParameter) {
    var selectedValue = this.params[metaParameter.name] == 'true';
    if (this.params[metaParameter.name] == null) {
      selectedValue = metaParameter.value;
    }

    const { parentDiv, containingDiv } = this.makeMetaParameterContainer(
      metaParameter.title
    );
    const selectInput = document.createElement('select');
    selectInput.name = metaParameter.name + '-select';

    const switchDiv = $(`<div class="col-7 leftInputContainer">
      <input type="checkbox" checked autocomplete="off">
  </div>`);

    // const switchDiv = $(`<div><input type="checkbox"></input></div>`);
    containingDiv.append(switchDiv[0]);

    (<HTMLInputElement>$(switchDiv).find('input')[0]).checked = selectedValue;

    this.params[metaParameter.name] = selectedValue;
    const id = metaParameter.name;
    $(switchDiv)
      .find('input')
      .attr('id', id);
    $(switchDiv)
      .find('label')
      .attr('for', id);

    $(switchDiv)
      .find('input')
      .on(
        'change',
        function(event) {
          const selectedValue = (<HTMLInputElement>event.target).checked;
          this.onParamChange({ metaParameter, value: selectedValue });
        }.bind(this)
      );

    return parentDiv;
  }

  buildMetaParameterWidget(metaParam: MetaParameter) {
    switch (metaParam.type) {
      case MetaParameterType.Range:
        return this.makeMetaParameterSlider(metaParam);
      case MetaParameterType.Select:
        return this.makeMetaParameterSelect(metaParam);
      case MetaParameterType.OnOff:
        return this.makeMetaParameterOnOff(metaParam);
      default:
        throw 'unknown metaParam - not slider or select';
    }
  }

  buildMetaParameterWidgets(parameterDiv) {
    $('.meta-parameter-container').remove();

    if (this.subModels) {
      this.subModels.forEach(subModel => {
        if (subModel.metaParameters) {
          subModel.metaParameters.forEach(metaParameter => {
            const metaParam = clone(metaParameter);
            metaParam.name =
              subModel.constructor.name + '.' + metaParameter.name;
            const subModelDiv = document.getElementById(
              subModel.constructor.name
            );
            let divToAppendTo = parameterDiv;
            if (subModelDiv) {
              divToAppendTo = subModelDiv;
            }

            const el = this.buildMetaParameterWidget(metaParam);
            divToAppendTo.append(el);
          });
        }
      });
    } else {
      this.modelMaker.metaParameters.forEach(metaParameter => {
        const el = this.buildMetaParameterWidget(metaParameter);
        parameterDiv.append(el);
      });
    }

    // @ts-ignore
    $('input[type="range"]').rangeslider();
  }

  showError(errorMessage) {
    $('body').addClass('error');
    $('body').removeClass('loading');
    document.getElementById('errorMessage').innerHTML = errorMessage;
  }

  cleanSVGforDownload(svg) {
    function recurse(el) {
      for (let x of Array.from(el.children)) {
        el.removeAttribute('transform');
        el.setAttribute('fill', 'none');
        el.removeAttribute('fill-rule');
        if (el.tagName == 'g') {
          el.setAttribute('stroke', '#ff0000');
          el.setAttribute('stroke-width', '0.001pt');
        }
        recurse(x);
      }
    }
    recurse(svg);
  }

  reprocessSVG(svg) {
    svg.setAttribute(
      'viewBox',
      `0 0 ${paper.project.activeLayer.bounds.width} ${paper.project.activeLayer.bounds.height}`
    );
    svg.setAttribute('height', paper.project.activeLayer.bounds.height + 'in');
    svg.setAttribute('width', paper.project.activeLayer.bounds.width + 'in');
  }

  downloadPDF() {
    const widthInches = paper.project.activeLayer.bounds.width;
    const heightInches = paper.project.activeLayer.bounds.height;

    let doc = new PDFDocument({
      compress: false,
      size: [widthInches * 72, heightInches * 72]
    });
    SVGtoPDF(doc, this.makeSVGData(), 0, 0);
    
    function blobToDataURL(blob, callback) {
      var a = new FileReader();
      
      a.onload = function(e) {
        // @ts-ignore
        callback(e.target.result);
      };
      a.readAsDataURL(blob);
    }

    let stream = doc.pipe(blobStream());
    const self = this;
    stream.on('finish', function() {
      let blob = stream.toBlob('application/pdf');
      blobToDataURL(blob, s => self.sendFileToUser(s, 'pdf'));
    });
    doc.end();
  }

  makeSVGData() {
    let svgData: string = (paper.project.exportSVG({
      asString: true,
      // @ts-ignore
      matrix: new paper.Matrix(),
      bounds: 'content'
    }) as unknown) as string;

    const svg = $(svgData);
    this.cleanSVGforDownload(svg[0]);
    this.reprocessSVG(svg[0]);
    return svg[0].outerHTML;
  }

  downloadSVG() {
    const data = this.makeSVGData();
    const mimeType = 'image/svg+xml';
    var encoded = encodeURIComponent(data);
    var uriPrefix = 'data:' + mimeType + ',';
    var dataUri = uriPrefix + encoded;

    this.sendFileToUser(dataUri, 'svg');
  }

  sendFileToUser(dataUri, extension) {
    var downloadLink = document.createElement('a');
    downloadLink.href = dataUri;

    const filename = this.makeFilename(extension);

    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    return false;
  }

  makeFilename(extension: string): string {
    // @ts-ignore
    let filename = this.modelMaker.name;
    if (this.subModels) {
      filename = this.subModels
        .map((f: PaperModelMaker) => f.constructor.name)
        .join('-');
    }
    const modelName = this.modelMaker.constructor.name;
    console.log('modelName', modelName);
    filename += `-${this.params[modelName + '.height']}x${
      this.params[modelName + '.wristCircumference']
    }x${this.params[modelName + '.forearmCircumference']}`;
    filename += '.' + extension;
    return filename;
  }

  makeGrid(canvas, xPixelsPerInch, yPixelsPerInch) {
    var data = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <pattern id="smallGrid" width="${xPixelsPerInch /
          10}" height="${yPixelsPerInch / 10}" patternUnits="userSpaceOnUse">
            <path d="M ${xPixelsPerInch / 10} 0 L 0 0 0 ${yPixelsPerInch /
      10}" fill="none" stroke="gray" stroke-width="0.5" />
        </pattern>
        <pattern id="grid" width="${xPixelsPerInch}" height="${yPixelsPerInch}" patternUnits="userSpaceOnUse">
            <rect width="${xPixelsPerInch}" height="${yPixelsPerInch}" fill="url(#smallGrid)" />
            <path d="M ${xPixelsPerInch} 0 L 0 0 0 ${yPixelsPerInch}" fill="none" stroke="gray" stroke-width="1" />
        </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>`;
    $('#gridArea')[0].innerHTML = data;
  }

  doRender() {
    const previewDiv = document.getElementById('previewArea');

    $('body').addClass('loading');
    $('body').removeClass('error');
    $('.playArea').show();

    // rebuild params from X.a to {X: {a: }}
    let modelParams = new Map<string, any>();
    if (this.subModels) {
      _.each(this.params, (value, key) => {
        const parts = key.split('.');
        if (parts.length == 2) {
          modelParams[parts[0]] = modelParams[parts[0]] || {};
          modelParams[parts[0]][parts[1]] = value;
        } else {
          throw 'param does not have a dot: ' + key;
        }
      });
    } else {
      modelParams = new Map(this.params);
    }

    const canvas: HTMLCanvasElement = document.getElementById(
      'myCanvas'
    ) as HTMLCanvasElement;
    paper.setup(canvas);
    paper.activate();

    if (paper != null && paper.project != null) {
      paper.project.activeLayer.removeChildren();
    }

    this.modelMaker.make(paper, modelParams);

    const self = this;
    const onResizeCallback = function() {
      const xScale =
        paper.project.view.bounds.width /
        paper.project.activeLayer.bounds.width;

      console.log(paper.project.activeLayer.view.scaling);
      paper.project.activeLayer.view.scale(
        xScale,
        paper.project.activeLayer.bounds.topLeft
      );
      console.log(paper.project.activeLayer.view.scaling);
      paper.project.activeLayer.applyMatrix = false;

      // @ts-ignore
      const yOffset = paper.project.view.getSize().height * xScale;
      $('#gridArea').css('margin-top', '-' + yOffset + 'px');

      const ySize = paper.project.activeLayer.bounds.height * xScale;
      $('#gridArea').css('height', ySize + 'px');

      self.makeGrid(canvas, xScale, xScale);
    };

    paper.view.onResize = onResizeCallback;
    onResizeCallback();

    let originalPlayAreaTop = null;
    $(window).scroll(function() {
      var distanceFromTop = $(this).scrollTop();
      let toCheck = $('.playArea').offset().top;
      if (originalPlayAreaTop) {
        toCheck = originalPlayAreaTop;
      } else {
        originalPlayAreaTop = toCheck;
      }
      if (distanceFromTop >= toCheck) {
        $('.jssticky').css('width', $('.playArea').width());
        $('.jssticky').addClass('fixed');
        $('body').css('padding-top', $('.jssticky').height() + 'px');
      } else {
        $('.jssticky').removeClass('fixed');
        $('body').css('padding-top', '0px');
      }
    });

    $('body').removeClass('loading');
  }
}
