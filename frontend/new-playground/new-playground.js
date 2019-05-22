/* TODO
- debug this one http://127.0.0.1:5500/new-playground/new-playground.html#ConicCuffOuter.height=2&ConicCuffOuter.wristCircumference=7&ConicCuffOuter.forearmCircumference=7.75&InnerDesignHashmarks.bufferWidth=0.325&InnerDesignHashmarks.hashWidth=0.325&InnerDesignHashmarks.seed=8519&InnerDesignHashmarks.initialNoiseRange1=17.9&InnerDesignHashmarks.initialNoiseRange2=4.8&InnerDesignHashmarks.noiseOffset1=0.81&InnerDesignHashmarks.noiseOffset2=0.31&InnerDesignHashmarks.noiseInfluence=0.8
*/

var makerjs = require('makerjs');
import { ConicCuffOuter } from '../conic-cuff-model.js';
import { InnerDesignHashmarks } from '../inner-design-hashmarks.js';

function parseParamsString(paramsString) {
    const params = {};
    paramsString.split('&').forEach((p) => {
        const parts = p.split('=');
        params[parts[0]] = decodeURIComponent(parts[1])
    })
    return params;
}

export class DavidsPlayground {
    constructor({
        modelMaker,
        subModels = null,
        allowPanAndZoom = false
    }) {
        this.modelMaker = modelMaker;
        this.subModels = subModels;
        if (this.modelMaker.subModels && !subModels) {
            this.subModels = subModels;
        }

        this.allowPanAndZoom = allowPanAndZoom;
        this.params = {};

        if (window.location.hash.lenghth > 1) {
            this.params = parseParamsString(window.location.hash.substring(1));
        }

        this.buildMetaParameterWidgets(document.getElementById('parameterDiv'));
    }

    rerender() {
        this.makeUrlParams();
        this.doRender();
    }

    makeUrlParams() {
        const encodeGetParams = p => 
            Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");
        window.location.hash = encodeGetParams(this.params)
    }

    makeMetaParameterSlider(metaParameter) {
        //    { title: "Height", type: "range", min: 1, max: 5, value: 2, step: 0.25, name: "height" },

        this.params[metaParameter.name] = this.params[metaParameter.name] || metaParameter.value;

        const containingDiv = document.createElement('div');
        containingDiv.name = metaParameter.name + '-container';
        containingDiv.className = 'meta-parameter-container'

        const rangeInput = document.createElement('input');
        rangeInput.type = 'range';
        rangeInput.name = metaParameter.name + '-range';
        rangeInput.min = metaParameter.min;
        rangeInput.max = metaParameter.max;
        rangeInput.step = metaParameter.step;
        rangeInput.id = metaParameter.name + '-range';
        rangeInput.value = metaParameter.value;

        const textInput = document.createElement('input');
        textInput.type = 'number';
        textInput.min = metaParameter.min;
        textInput.max = metaParameter.max;
        textInput.step = metaParameter.step;
        textInput.id = metaParameter.name + '-num-input';
        textInput.value = metaParameter.value;

        const textLabelDiv = document.createElement('div');
        textLabelDiv.name = metaParameter.name + '-text-label';
        textLabelDiv.className = 'textLabel'
        textLabelDiv.innerHTML = metaParameter.title;

        containingDiv.append(textLabelDiv);
        containingDiv.append(rangeInput);
        containingDiv.append(textInput);

        rangeInput.addEventListener('change', _.bind(function (event) {
            const value = event.target.value;
            textInput.value = value;
            this.params[metaParameter.name] = Number(value);
            this.rerender();
        }, this));

        textInput.addEventListener('change', function () {
            rangeInput.value = this.value;
        });

        return containingDiv;
    }

    buildMetaParameterWidgets(parameterDiv) {
        $('.meta-parameter-container').remove();
        //    { title: "Height", type: "range", min: 1, max: 5, value: 2, step: 0.25, name: "height" },
        if (this.subModels) {
            this.subModels.forEach((subModel) => {
                if (subModel.metaParameters) {
                    subModel.metaParameters.forEach((metaParameter) => {
                        const metaParam = _.clone(metaParameter);
                        metaParam.name = subModel.name + '.' + metaParameter.name;
                        const subModelDiv = document.getElementById(subModel.name);
                        let divToAppendTo = parameterDiv;
                        if (subModelDiv) {
                            divToAppendTo = subModelDiv;
                        }
                        divToAppendTo.append(this.makeMetaParameterSlider(metaParam))
                    })
                }
            })
        } else {
            this.modelMaker.metaParameters.forEach((metaParameter) =>
                parameterDiv.append(this.makeMetaParameterSlider(metaParameter))
            )
        }
    }

    showError(errorMessage) {
       $('body').addClass('error');
       $('body').removeClass('loading');
        document.getElementById('errorMessage').innerHTML = errorMessage;
    }

    doRender() {
        $('body').addClass('loading');
        $('body').removeClass('error');

        // rebuild params from X.a to {X: {a: }}
        const modelParams = this.params;
        if (this.subModels) {
            _.each(this.params, function (value, key) {
                const parts = key.split('.');
                modelParams[parts[0]] = modelParams[parts[0]] || {};
                modelParams[parts[0]][parts[1]] = value;
            })
        }
        
        let model = null;
        try {
            model = Reflect.construct(this.modelMaker, [modelParams]);

            const previewDiv = document.getElementById('previewArea');
            var svg = makerjs.exporter.toSVG(model, {useSvgPathOnly: false} );
            previewDiv.innerHTML = svg;

            const svgElem = previewDiv.getElementsByTagName('svg')[0];
            svgElem.setAttribute('width', '100%');
            const panZoomInstance = svgPanZoom(svgElem, {
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
        } catch(err) {
            this.showError(err.message);
            console.log(err);
            throw err;
        }
    }
}

export default {} 

// const paramsStr = window.location.search || '?';
// const params = parseParamsString(window.location.search.substring(1));
// if (params['script']) {
//     import(params['script'])
//     .then((module) => {
//       console.log(module.default)
//       console.log(module);
//       // → logs 'Hi from the default export!'
//       new DavidsPlayground({modelMaker: module.default}).rerender();
//     });
// } else {
//     const modelMaker = function(options) {
//         return ConicCuffOuter(InnerDesignHashmarks)(options);
//     }

//     new DavidsPlayground({modelMaker: modelMaker, subModels: [ConicCuffOuter, InnerDesignHashmarks]}).rerender();
// }
