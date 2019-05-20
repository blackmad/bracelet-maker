/* TODO
- deal with nested metaparams somehow
*/

var makerjs = require('makerjs');
import {ConicCuffWithHashMarks} from '../conic-cuff-model.js';

class DavidsPlayground {
    constructor({
        modelMaker
    }) {
        this.modelMaker = modelMaker;
        this.params = {};

        if (window.location.hash.lenghth > 1) {
            window.location.hash.substring(1).split('&').forEach((p) => {
                const parts = p.split('=');
                this.params[parts[0]] = parts[1];
            })
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
        containingDiv.class = 'meta-parameter-container'

        const sliderDiv = document.createElement('div');
        sliderDiv.name = metaParameter.name + '-slider';

        const textInput = document.createElement('input');
        textInput.type = 'number';
        textInput.min = metaParameter.min;
        textInput.max = metaParameter.max;
        textInput.step = metaParameter.step;
        textInput.id = metaParameter.name + '-num-input';

        const textLabelDiv = document.createElement('div');
        textLabelDiv.name = metaParameter.name + '-text-label';
        textLabelDiv.class = 'textLabel'
        textLabelDiv.innerHTML = metaParameter.title;

        containingDiv.append(textLabelDiv);
        containingDiv.append(sliderDiv);
        containingDiv.append(textInput);

        //debugger;
        noUiSlider.create(sliderDiv, {
            start: this.params[metaParameter.name] || metaParameter.value,
            step: metaParameter.step,
            range: {
                'min': metaParameter.min,
                'max': metaParameter.max
            }
        });

        sliderDiv.noUiSlider.on('update', _.bind(function (values, handle) {
            var value = values[handle];
            textInput.value = value;

            this.params[metaParameter.name] = Number(value);
        }, this));

        textInput.addEventListener('change', function () {
            sliderDiv.noUiSlider.set([this.value]);
        });

        sliderDiv.noUiSlider.on('set', _.bind(function (values, handle) {
            this.rerender();
        }, this));

        return containingDiv;
    }

    buildMetaParameterWidgets(parameterDiv) {
        //    { title: "Height", type: "range", min: 1, max: 5, value: 2, step: 0.25, name: "height" },
        if (this.modelMaker.subModels) {
            this.modelMaker.subModels.forEach((subModel) => {
                subModel.metaParameters.forEach((metaParameter) => {
                    metaParameter.name = subModel.name + '.' + metaParameter.name;
                    parameterDiv.append(this.makeMetaParameterSlider(metaParameter))
                })
            })
        } else {
            this.modelMaker.metaParameters.forEach((metaParameter) =>
                parameterDiv.append(this.makeMetaParameterSlider(metaParameter))
            )
        }
    }

    doRender() {
        // rebuild params from X.a to {X: {a: }}
        const modelParams = {}
        _.each(this.params, function (value, key) {
            const parts = key.split('.');
            modelParams[parts[0]] = modelParams[parts[0]] || {};
            modelParams[parts[0]][parts[1]] = value;
        })
        
        const model = Reflect.construct(this.modelMaker, [modelParams]);

        const previewDiv = document.getElementById('previewArea');
        var svg = makerjs.exporter.toSVG(model, {useSvgPathOnly: false} );
        previewDiv.innerHTML = svg;

        const svgElem = previewDiv.getElementsByTagName('svg')[0];
        svgElem.setAttribute('width', '100%');
        const panZoomInstance = svgPanZoom(svgElem, {
            zoomEnabled: true,
            controlIconsEnabled: true,
            fit: true,
            center: true,
            minZoom: 0.1
        });
        panZoomInstance.resize();
        panZoomInstance.updateBBox();
        panZoomInstance.fit();
        panZoomInstance.center();
    }
}

new DavidsPlayground({modelMaker: ConicCuffWithHashMarks}).rerender();
