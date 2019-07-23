//const makerjs = require("makerjs");

import * as paper from "paper";
import ExtendPaperJs from 'paperjs-offset'

// @ts-ignore - this works fine, wtf typescript?
// import * as PDFDocument from "../external/pdfkit.standalone";
import * as blobStream from "blob-stream";
import * as $ from "jquery";
import * as _ from "lodash";
import "rangeslider.js";

import "core-js/library";


import { PaperModelMaker } from "../model-maker";
import { MetaParameter, MetaParameterType } from "../meta-parameter";

import * as fs from "fs";

function clone(src) {
  return Object.assign({}, src);
}

function parseParamsString(paramsString: string): Map<string, string> {
  const params = new Map<string, string>();
  paramsString.split("&").forEach((p: string) => {
    const parts: string[] = p.split("=");
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
    // const canvas: HTMLCanvasElement = document.getElementById(
    //   "myCanvas"
    // ) as HTMLCanvasElement;
    // var scope = new paper.PaperScope();
    // this.scope = scope;
    // scope.setup(canvas)
    // scope.activate();

    // when view is resized...
    // scope.view.onResize = function() {
    //   // ...log new view width
    //   console.log("view.width is now: " + scope.view.bounds.width);
    //   scope.project.activeLayer.fitBounds(scope.view.bounds);
    // };
    //  paper.view.draw();

    if (this.modelMaker.subModels && !subModels) {
      this.subModels = subModels;
    }
    this.allowPanAndZoom = allowPanAndZoom;
    this.params = new Map();

    if (window.location.hash.length > 1) {
      this.params = parseParamsString(window.location.hash.substring(1));
    }

    this.buildMetaParameterWidgets(document.getElementById("parameterDiv"));

    $(".downloadSVG").off("click");
    $(".downloadSVG").click(this.downloadSVG.bind(this));
    $(".downloadPDF").off("click");
    // $(".downloadPDF").click(this.downloadPDF.bind(this));
  }

  rerender() {
    this.makeUrlParams();
    this.doRender();
  }

  makeUrlParams() {
    function encodeGetParams(p: Map<string, any>): string {
      return _.map(p, (value, key) => {
        return (
          encodeURIComponent(key) + "=" + encodeURIComponent(value.toString())
        );
      }).join("&");
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

    const rangeInput = document.createElement("input");
    rangeInput.type = "range";
    rangeInput.name = metaParameter.name + "-range";
    rangeInput.min = metaParameter.min;
    rangeInput.max = metaParameter.max;
    rangeInput.step = metaParameter.step;
    rangeInput.id = metaParameter.name + "-range";
    rangeInput.value = value;
    rangeInput.className = "col-5";

    const inputWrapDiv = document.createElement("div");
    inputWrapDiv.className = "col-2";
    const textInput = document.createElement("input");
    textInput.type = "number";
    textInput.min = metaParameter.min;
    textInput.max = metaParameter.max;
    textInput.step = metaParameter.step;
    textInput.id = metaParameter.name + "-num-input";
    textInput.value = value;
    textInput.className = "mx-1";

    containingDiv.append(rangeInput);
    containingDiv.append(inputWrapDiv);
    inputWrapDiv.append(textInput);

    this.params[metaParameter.name] = Number(value);

    rangeInput.addEventListener(
      "change",
      function(event) {
        const value = event.target.value;
        textInput.value = value;
        this.onParamChange({ metaParameter, value });
      }.bind(this)
    );

    textInput.addEventListener(
      "change",
      function(event) {
        rangeInput.value = event.target.value;
        this.onParamChange({ metaParameter, value: event.target.value });
      }.bind(this)
    );

    return parentDiv;
  }

  makeMetaParameterContainer(title) {
    const sizingDiv = document.createElement("div");
    sizingDiv.className =
      "meta-parameter-container col-md-12 col-lg-6 small border-top border-bottom py-1";

    const containingDiv = document.createElement("div");
    containingDiv.className = "row";

    sizingDiv.append(containingDiv);

    const textLabelDiv = document.createElement("div");
    textLabelDiv.className = "col-5";
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

    const selectInput = document.createElement("select");
    selectInput.name = metaParameter.name + "-select";

    metaParameter.options.forEach(optionValue => {
      const option = document.createElement("option");
      option.value = optionValue;
      option.text = optionValue;
      if (optionValue == selectedValue) {
        option.setAttribute("selected", "selected");
      }
      selectInput.appendChild(option);
    });

    containingDiv.append(selectInput);

    this.params[metaParameter.name] = selectedValue;

    selectInput.addEventListener(
      "change",
      function(event) {
        const selectedValue = event.target.selectedOptions[0].value;
        this.onParamChange({ metaParameter, value: selectedValue });
      }.bind(this)
    );

    return parentDiv;
  }

  makeMetaParameterOnOff(metaParameter) {
    var selectedValue = this.params[metaParameter.name] == "true";
    if (this.params[metaParameter.name] == null) {
      selectedValue = metaParameter.value;
    }

    const { parentDiv, containingDiv } = this.makeMetaParameterContainer(
      metaParameter.title
    );
    const selectInput = document.createElement("select");
    selectInput.name = metaParameter.name + "-select";

    const switchDiv = $(`<div class="col-2">
      <input type="checkbox" checked autocomplete="off">
  </div>`);

    // const switchDiv = $(`<div><input type="checkbox"></input></div>`);
    containingDiv.append(switchDiv[0]);

    (<HTMLInputElement>$(switchDiv).find("input")[0]).checked = selectedValue;

    this.params[metaParameter.name] = selectedValue;
    const id = metaParameter.name;
    $(switchDiv)
      .find("input")
      .attr("id", id);
    $(switchDiv)
      .find("label")
      .attr("for", id);

    $(switchDiv)
      .find("input")
      .on(
        "change",
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
        throw "unknown metaParam - not slider or select";
    }
  }

  buildMetaParameterWidgets(parameterDiv) {
    $(".meta-parameter-container").remove();

    if (this.subModels) {
      this.subModels.forEach(subModel => {
        if (subModel.metaParameters) {
          subModel.metaParameters.forEach(metaParameter => {
            const metaParam = clone(metaParameter);
            metaParam.name =
              subModel.constructor.name + "." + metaParameter.name;
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
    $("body").addClass("error");
    $("body").removeClass("loading");
    document.getElementById("errorMessage").innerHTML = errorMessage;
  }

  downloadSVG() {
    let svgData: string = (paper.project.exportSVG({
      asString: true
    }) as unknown) as string;
    const preface = '<?xml version="1.0" standalone="no"?>\r\n';
    // I have NO IDEA why I need to add this closing </g> to make it work
    svgData =
      preface +
      svgData
        .replace("</svg>", "</g></svg>")
        .replace("<svg", '<svg  xmlns="http://www.w3.org/2000/svg" ');

    var encoded = encodeURIComponent(svgData);
    var uriPrefix = "data:" + "image/svg+xml" + ",";
    var dataUri = uriPrefix + encoded;

    var downloadLink = document.createElement("a");
    downloadLink.href = dataUri;

    const filename = this.makeFilename("svg");

    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    return false;
  }

  cleanModel(model) {
    if (!model || !model) {
      return;
    }

    _(model.models).each((value: any, key: string) => {
      if (value == null) {
        delete model.models[key];
      } else {
        this.cleanModel(value);
      }
    });
  }

  makeFilename(extension: string): string {
    // @ts-ignore
    let filename = this.modelMaker.name;
    if (this.subModels) {
      filename = this.subModels
        .map((f: PaperModelMaker) => f.constructor.name)
        .join("-");
    }
    filename += `-${this.params["ConicCuffOuter.height"]}x${
      this.params["ConicCuffOuter.wristCircumference"]
    }x${this.params["ConicCuffOuter.forearmCircumference"]}`;
    filename += "." + extension;
    return filename;
  }

  // downloadPDF() {
  //   console.log("downloading pdf");
  //   var bbox = makerjs.measure.modelExtents(this.model);
  //   const widthInches = bbox.high[0] - bbox.low[0];
  //   const heightInches = bbox.high[1] - bbox.low[1];
  //   var pdfOptions = {
  //     compress: false,
  //     info: {
  //       Producer: "MakerJs",
  //       Author: "MakerJs"
  //     },
  //     size: [widthInches * 72, heightInches * 72]
  //   };
  //   // @ts-ignore - loading this from external js so our upload bundle is smaller
  //   var doc = new PDFDocument(pdfOptions);
  //   const stream = doc.pipe(blobStream());

  //   this.cleanModel(this.model);

  //   const exportOptions = {
  //     stroke: "#FF0000"
  //   };
  //   doc.lineWidth(0.0001);
  //   makerjs.exporter.toPDF(doc, this.model, exportOptions);
  //   doc.end();

  //   stream.on(
  //     "finish",
  //     _.bind(function() {
  //       const pdfBlob = stream.toBlob("application/pdf");
  //       var pdfUrl = URL.createObjectURL(pdfBlob);
  //       var downloadLink = document.createElement("a");
  //       downloadLink.href = pdfUrl;

  //       const filename = this.makeFilename("pdf");
  //       downloadLink.download = filename;
  //       document.body.appendChild(downloadLink);
  //       downloadLink.click();
  //       document.body.removeChild(downloadLink);
  //     }, this)
  //   );

  //   return false;
  // }

  doRender() {
    const previewDiv = document.getElementById("previewArea");

    $("body").addClass("loading");
    $("body").removeClass("error");
    $(".playArea").show();

    // rebuild params from X.a to {X: {a: }}
    let modelParams = new Map<string, any>();
    if (this.subModels) {
      _.each(this.params, (value, key) => {
        const parts = key.split(".");
        if (parts.length == 2) {
          modelParams[parts[0]] = modelParams[parts[0]] || {};
          modelParams[parts[0]][parts[1]] = value;
        } else {
          throw "param does not have a dot: " + key;
        }
      });
    } else {
      modelParams = new Map(this.params);
    }

    const canvas: HTMLCanvasElement = document.getElementById(
      "myCanvas"
    ) as HTMLCanvasElement;
    var scope = new paper.PaperScope();
    this.scope = scope;
    scope.setup(canvas)
    scope.activate();

    scope.view.onResize = function() {
      // ...log new view width
      console.log("view.width is now: " + scope.view.bounds.width);
      scope.project.activeLayer.fitBounds(scope.view.bounds);
    };

    if (paper != null && paper.project != null) {
      paper.project.activeLayer.removeChildren();
    }

    this.modelMaker.make(this.scope, modelParams);
    // console.log(this.model);
    this.scope.view.onResize();

    // paper.view.scaling = new paper.Point(96, 96);
  }
}
