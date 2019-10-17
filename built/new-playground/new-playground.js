import * as paper from 'paper';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { MetaParameterBuilder } from './meta-parameter-builder';
import { makeSVGData } from '../utils/paperjs-export-utils';
import * as SVGtoPDF from 'svg-to-pdfkit';
import blobStream from 'blob-stream';
import { MetaParameterType } from '../meta-parameter';
function parseParamsString(paramsString) {
    const params = new Map();
    paramsString.split('&').forEach((p) => {
        const parts = p.split('=');
        params[parts[0]] = decodeURIComponent(parts[1]);
    });
    return params;
}
export class DavidsPlayground {
    constructor(modelMaker, queryParamUpdateCb) {
        this.modelMaker = modelMaker;
        this.queryParamUpdateCb = queryParamUpdateCb;
        this.params = new Map();
        if (window.location.search.length > 1) {
            this.params = parseParamsString(window.location.search.substring(1));
        }
        $('.meta-parameter-container').remove();
        new MetaParameterBuilder(this.params, _.bind(this.onParamChange, this)).buildMetaParametersForModel(this.modelMaker, document.getElementById('outerParameterDiv'));
        new MetaParameterBuilder(this.params, _.bind(this.onParamChange, this)).buildMetaParametersForModel(this.modelMaker.subModel, document.getElementById('innerParameterDiv'));
        $('.sizingInfo').html(modelMaker.controlInfo);
        $('.downloadSVG').off('click');
        $('.downloadSVG').click(this.downloadSVG.bind(this));
        $('.downloadPDF').off('click');
        $('.downloadPDF').click(this.downloadPDF.bind(this));
    }
    rerender() {
        this.queryParamUpdateCb(this.params);
        this.doRender();
    }
    metaParamRequiresNumber(metaParameter) {
        return metaParameter.type == MetaParameterType.Range;
    }
    onParamChange({ metaParameter, value }) {
        if (this.metaParamRequiresNumber(metaParameter)) {
            this.params[metaParameter.name] = Number(value);
        }
        else {
            this.params[metaParameter.name] = value;
        }
        this.rerender();
    }
    showError(errorMessage) {
        $('body').addClass('error');
        $('body').removeClass('loading');
        document.getElementById('errorMessage').innerHTML = errorMessage;
    }
    loadPDFLibs() {
        // @ts-ignore - this works fine, wtf typescript?
    }
    downloadPDF() {
        const widthInches = paper.project.activeLayer.bounds.width;
        const heightInches = paper.project.activeLayer.bounds.height;
        import('../external/pdfkit.standalone.js').then((PDFDocument) => {
            const doc = new PDFDocument.default({
                compress: false,
                size: [widthInches * 72, heightInches * 72]
            });
            SVGtoPDF(doc, makeSVGData(paper, true, (svg) => $(svg)[0]), 0, 0);
            function blobToDataURL(blob, callback) {
                const a = new FileReader();
                a.onload = function (e) {
                    // @ts-ignore
                    callback(e.target.result);
                };
                a.readAsDataURL(blob);
            }
            const stream = doc.pipe(blobStream());
            const self = this;
            stream.on('finish', function () {
                const blob = stream.toBlob('application/pdf');
                blobToDataURL(blob, (s) => self.sendFileToUser(s, 'pdf'));
            });
            doc.end();
        });
    }
    downloadSVG(e) {
        const data = makeSVGData(paper, true, (svg) => $(svg)[0]);
        const mimeType = 'image/svg+xml';
        const encoded = encodeURIComponent(data);
        const uriPrefix = 'data:' + mimeType + ',';
        const dataUri = uriPrefix + encoded;
        this.sendFileToUser(dataUri, 'svg');
        e.preventDefault();
        return false;
    }
    sendFileToUser(dataUri, extension) {
        const downloadLink = document.createElement('a');
        downloadLink.href = dataUri;
        const filename = this.makeFilename(extension);
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        return false;
    }
    makeFilename(extension) {
        // @ts-ignore
        let filename = this.modelMaker.name;
        if (this.modelMaker.subModel) {
            filename = this.modelMaker.constructor.name + '-' + this.modelMaker.subModel.constructor.name;
        }
        const modelName = this.modelMaker.constructor.name;
        filename += `-${this.params[modelName + '.height']}x${this.params[modelName + '.wristCircumference']}x${this.params[modelName + '.forearmCircumference']}`;
        filename += '.' + extension;
        return filename;
    }
    makeGrid(canvas, xPixelsPerInch, yPixelsPerInch) {
        const data = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
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
        let modelParams = new Map();
        if (this.modelMaker.subModel) {
            _.each(this.params, (value, key) => {
                const parts = key.split('.');
                if (parts.length == 2) {
                    modelParams[parts[0]] = modelParams[parts[0]] || {};
                    modelParams[parts[0]][parts[1]] = value;
                }
                else {
                    throw new Error('param does not have a dot: ' + key);
                }
            });
        }
        else {
            modelParams = new Map(this.params);
        }
        const canvas = document.getElementById('myCanvas');
        paper.setup(canvas);
        paper.activate();
        if (paper != null && paper.project != null) {
            paper.project.activeLayer.removeChildren();
        }
        // @ts-ignore
        this.modelMaker.make(paper, modelParams);
        $('#svgArea')[0].innerHTML = makeSVGData(paper, false, (svg) => $(svg)[0]);
        $('body').removeClass('loading');
    }
}
//# sourceMappingURL=new-playground.js.map