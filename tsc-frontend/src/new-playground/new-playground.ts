const makerjs = require('makerjs');
const StringReader = require('string-reader');
const svgPanZoom = require('svg-pan-zoom');

import * as PDFDocument from 'pdfkit';
import * as $ from "jquery";
import * as _ from "lodash";

import "core-js/library"

import { ModelMaker } from '../model';
import { MetaParameter, MetaParameterType } from '../meta-parameter';

function clone(src) {
  return Object.assign({}, src);
}

function parseParamsString(paramsString): Map<string, string> {
    const params = new Map<string, string>();
    paramsString.split('&').forEach((p) => {
        const parts = p.split('=');
        params[parts[0]] = decodeURIComponent(parts[1])
    })
    return params;
}

export class DavidsPlayground {
    private params: Map<string, any>;
    private svgEl: SVGElement;
    private model: MakerJs.IModel;

    constructor(
        public modelMaker: ModelMaker,
        public subModels: Array<ModelMaker> = null,
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

        $('.downloadSVG').click(this.downloadSVG.bind(this));
        $('.downloadPDF').click(this.downloadPDF.bind(this));
    }

    rerender() {
        this.makeUrlParams();
        this.doRender();
    }

    makeUrlParams() {
        function encodeGetParams(p: Map<string, any>): string {
            return _.map(p, (value, key) => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(value.toString())
            }).join('&');
        }
        console.log(encodeGetParams(this.params));
    
        window.location.hash = encodeGetParams(this.params)
    }

    metaParamRequiresNumber(metaParameter) {
        return metaParameter.type == MetaParameterType.Range;
    }

    onParamChange({metaParameter, value}) {
        if (this.metaParamRequiresNumber(metaParameter)) {
            this.params[metaParameter.name] = Number(value);
        } else {
            this.params[metaParameter.name] = value;
        }
        console.log(this.params);
        this.rerender();
    }

    makeMetaParameterSlider(metaParameter) {
        const value = Number(this.params[metaParameter.name]) || metaParameter.value;

        const containingDiv = document.createElement('div');
        containingDiv.className = 'meta-parameter-container'

        const rangeInput = document.createElement('input');
        rangeInput.type = 'range';
        rangeInput.name = metaParameter.name + '-range';
        rangeInput.min = metaParameter.min;
        rangeInput.max = metaParameter.max;
        rangeInput.step = metaParameter.step;
        rangeInput.id = metaParameter.name + '-range';
        rangeInput.value = value;

        const textInput = document.createElement('input');
        textInput.type = 'number';
        textInput.min = metaParameter.min;
        textInput.max = metaParameter.max;
        textInput.step = metaParameter.step;
        textInput.id = metaParameter.name + '-num-input';
        textInput.value = value;

        const textLabelDiv = document.createElement('div');
        textLabelDiv.className = 'textLabel'
        textLabelDiv.innerHTML = metaParameter.title;

        containingDiv.append(textLabelDiv);
        containingDiv.append(rangeInput);
        containingDiv.append(textInput);

        this.params[metaParameter.name] = Number(value);
      
        rangeInput.addEventListener('change', function (event) {
            const value = event.target.value;
            textInput.value = value;
            this.onParamChange({metaParameter, value})
        }.bind(this))

        textInput.addEventListener('change', function (event) {
            rangeInput.value = event.target.value;
            this.onParamChange({metaParameter, value: event.target.value});
        }.bind(this));

        return containingDiv;
    }

    makeMetaParameterSelect(metaParameter) {
        const selectedValue = this.params[metaParameter.name] || metaParameter.value;

        const containingDiv = document.createElement('div');
        containingDiv.className = 'meta-parameter-container'

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
        })

        const textLabelDiv = document.createElement('div');
        textLabelDiv.className = 'textLabel'
        textLabelDiv.innerHTML = metaParameter.title;
       
        containingDiv.append(textLabelDiv);
        containingDiv.append(selectInput);

        this.params[metaParameter.name] = selectedValue;
      
        selectInput.addEventListener('change',  function (event) {
            const selectedValue = event.target.selectedOptions[0].value;
            this.onParamChange({metaParameter, value: selectedValue})
        }.bind(this));

        return containingDiv;
    }

    makeMetaParameterOnOff(metaParameter) {
        const selectedValue = (this.params[metaParameter.name] == 'true') || metaParameter.value;

        const containingDiv = document.createElement('div');
        containingDiv.className = 'meta-parameter-container'

        const selectInput = document.createElement('select');
        selectInput.name = metaParameter.name + '-select';

//         const switchDiv = $(`
//         <div class="onoffswitch">
//     <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" checked>
//     <label class="onoffswitch-label" for="myonoffswitch">
//         <span class="onoffswitch-inner"></span>
//         <span class="onoffswitch-switch"></span>
//     </label>
// </div>`);

        const textLabelDiv = document.createElement('div');
        textLabelDiv.className = 'textLabel'
        textLabelDiv.innerHTML = metaParameter.title;

        containingDiv.append(textLabelDiv);

        const switchDiv = $(`<div><input type="checkbox"></input></div>`);
        containingDiv.append(switchDiv[0]);

        if (metaParameter.value) {
            $(switchDiv).find('input').prop( "checked", true );
        }

        this.params[metaParameter.name] = selectedValue;
      
        $(switchDiv).find('input').on('change',  function (event) {
            const selectedValue = (<HTMLInputElement>event.target).checked;
            this.onParamChange({metaParameter, value: selectedValue})
        }.bind(this));

        return containingDiv;
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
        //    { title: "Height", type: "range", min: 1, max: 5, value: 2, step: 0.25, name: "height" },
        if (this.subModels) {
            this.subModels.forEach((subModel) => {
                if (subModel.metaParameters) {
                    subModel.metaParameters.forEach((metaParameter) => {
                        const metaParam = clone(metaParameter);
                        metaParam.name = subModel.constructor.name + '.' + metaParameter.name;
                        const subModelDiv = document.getElementById(subModel.constructor.name);
                        let divToAppendTo = parameterDiv;
                        if (subModelDiv) {
                            divToAppendTo = subModelDiv;
                        }

                        const el = this.buildMetaParameterWidget(metaParam);
                        divToAppendTo.append(el);
                    })
                }
            })
        } else {
            this.modelMaker.metaParameters.forEach((metaParameter) => {
                const el = this.buildMetaParameterWidget(metaParameter);
                parameterDiv.append(el);
            })
        }
    }

    showError(errorMessage) {
       $('body').addClass('error');
       $('body').removeClass('loading');
        document.getElementById('errorMessage').innerHTML = errorMessage;
    }

    downloadSVG() {
        // var svg = makerjs.exporter.toSVG(this.model, {
        //     useSvgPathOnly: false,
        //     stroke: 'red',
        //     strokeWidth: '0.0001pt'} 
        // );
        // const svgEl = $(svg)[0];
        // svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        // svgEl.removeAttribute('viewBox');
        // console.log(svg);
        // console.log(svgEl);
        // const svgData = svgEl.outerHTML;

        this.svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        const svgData = this.svgEl.outerHTML;

        var preface = '<?xml version="1.0" standalone="no"?>\r\n';
        var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
        var svgUrl = URL.createObjectURL(svgBlob);
        var downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;

        let filename = this.modelMaker.constructor.name;
        if (this.subModels) {
            filename = this.subModels.map((f) => f.constructor.name).join('-')
        }
        filename += '.svg';

        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    cleanModel(model) {
        if (!model || !model) { return }

        model.models.map((value: any, key: string) => {
          if (value == null) {
            delete model.models[key];
          } else {
            this.cleanModel(value);
          }
        })
      }

    downloadPDF() {
        function complete(pdfDataString) {
            var pdfBlob = new Blob([pdfDataString], {type:"application/pdf"});
            var pdfUrl = URL.createObjectURL(pdfBlob);
            var downloadLink = document.createElement("a");
            downloadLink.href = pdfUrl;
    
            let filename = this.modelMaker.name;
            if (this.subModels) {
                filename = this.subModels.map((f: ModelMaker) => f.constructor.name).join('-')
            }
            filename += '.pdf';
    
            downloadLink.download = filename;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
        // TODO - calculate these
        const widthInches = 10;
        const heightInches = 3;
        var pdfOptions = {
            compress: false,
            info: {
                Producer: 'MakerJs',
                Author: 'MakerJs'
            },
            size: [widthInches*72, heightInches*72]
        };
        var doc = new PDFDocument(pdfOptions);
        var reader = new StringReader(complete.bind(this));
        var stream = doc.pipe(reader);
        
        this.cleanModel(this.model);

        const exportOptions = {
            stroke: '#FF0000'
        }
        doc.lineWidth(0.0001)
        makerjs.exporter.toPDF(doc, this.model, exportOptions);
        doc.end();
    }

    doRender() {
        const previewDiv = document.getElementById('previewArea');

        $('body').addClass('loading');
        $('body').removeClass('error');

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
            })
        } else {
            modelParams = new Map(this.params);
        }
        
        // try {
            this.model = this.modelMaker.make(modelParams);
            console.log(this.model);

            var svg = makerjs.exporter.toSVG(this.model, {useSvgPathOnly: false} );
            previewDiv.innerHTML = svg;
            
            this.svgEl = previewDiv.getElementsByTagName('svg')[0] as SVGElement;
            this.svgEl.setAttribute('width', '100%');
            const panZoomInstance = svgPanZoom(this.svgEl, {
                zoomEnabled: this.allowPanAndZoom,
                panEnabled: this.allowPanAndZoom,
                controlIconsEnabled: this.allowPanAndZoom,
                fit: true,
                center: true,
                minZoom: 0.1
            });
            panZoomInstance.resize();
            panZoomInstance.updateBBox();
            panZoomInstance.fit();
            panZoomInstance.center();
            $('body').removeClass('loading');
        // } catch(err) {
        //     var message = err;
        //     if (err.message) {
        //         message = err.message;
        //     }
        //     this.showError(message);
        //     console.log(err);
        //     throw err;
        // }
    }
}