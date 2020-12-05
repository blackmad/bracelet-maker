<template>
  <div>
    <div id="previewArea">
      <div id="svgArea" class="text-center"></div>

      <div id="loading">Rendering ...</div>
      <div id="error">
        Error rendering design. Sorry :-/
        <br />
        <span id="errorMessage"></span>
      </div>

      <div class id="topArea">
        <div id="downloadContainer" class="text-center">
          <a class="downloadButton downloadSVG" @click="downloadSVG">Download SVG</a>
          <a class="downloadButton downloadPDF" @click="downloadPDF">Download PDF</a>
          <a class="downloadButton downloadOutlinePDF" @click="downloadOutlinePDF">Download Outline PDF</a>
          <a class="downloadButton saveToMyLibrary" @click="saveToMyLibrary">Save</a>
        </div>
      </div>
    </div>

    <div class="container px-xs-3 px-sm-3 px-md-4 px-lg-5">
      <div class="previewAreaPadding"></div>
      <div class="m-3">
        <h1 class="title">Sizing</h1>
        <small>
          <div class="sizingInfo patternInfo">{{modelMaker ? modelMaker.controlInfo : ''}}</div>
        </small>
        <div id="outerParameterDiv" class="row clear-on-reinit"></div>
      </div>

      <div id="parameterSection" class="m-3">
        <h1 class="title">Design</h1>
        <div class="patternInfo">
          <small>
            Not all of these variables do what they say. Consider them various ways to play with the
            randomness until you find a design you like.
          </small>
        </div>

        <button @click="randomize">Randomize</button>

        <div id="innerParameterDiv" class="row design-params-row"></div>
      </div>

      <div id="parameterSection" class="m-3" v-if="debugLayerNames.length > 0">
        <h1 class="title">Debug Layers</h1>

        <div v-for="name in debugLayerNames" :key="name">
          <label :style="{ color: cssColor(name) }">
            <input type="checkbox" @click="toggleVisibility(name)" />
            {{ name }}
          </label>
        </div>
      </div>

      <div id="designScratchArea"></div>

      <div class="row justify-content-center">
        <button class="btn btn-primary m-1 changeDesign" @click="changeDesign">
          Change Design
        </button>
      </div>
    </div>

    <b-modal
      id="save-modal"
      title="Save Design"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
      ok-title="Save"
      @shown="focusNameElement"
    >
      <form ref="form">
        <b-form-group
          :state="designNameState"
          label="Name"
          label-for="name-input"
          invalid-feedback="Name is required"
        >
          <b-form-input
            id="name-input"
            ref="designName"
            v-model="designName"
            :state="designNameState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import $ from 'jquery';

// import * as $ from "jquery";

import * as paper from "paper";

import * as _ from "lodash";

import firebase from "firebase";

import { CompletedModel, OuterPaperModelMaker } from "@/bracelet-maker/model-maker";
import { MetaParameterBuilder } from "@/new-playground/meta-parameter-builder";

import { makeSVGData } from "@/bracelet-maker/utils/paperjs-export-utils";
import * as SVGtoPDF from "svg-to-pdfkit";
import blobStream from "blob-stream";

import { AllInnerDesigns } from "@/bracelet-maker/designs/inner/all";
import { AllOuterDesigns } from "@/bracelet-maker/designs/outer/all";
import { getDebugLayers, getDebugLayerNames } from "@/bracelet-maker/utils/debug-layers";
import { State, Getter, Action, Mutation, namespace } from "vuex-class";

@Component({})
export default class NewPlaygroundView extends Vue {
  @Getter user;
  designs = AllInnerDesigns;
  @Prop(String) outerDesign: string;
  @Prop(String) innerDesign: string;
  isFirstQueryReplace = true;
  debugLayers = getDebugLayers();
  debugLayerNames = getDebugLayerNames();
  params: any;
  currentModel: CompletedModel;
  modelMaker: OuterPaperModelMaker = null;
  queryParamUpdateCb: Function;
  designName: string = "";
  designNameState: boolean = null;
  metaParamBuilder: MetaParameterBuilder = null;

  isVisible(name) {
    return this.debugLayers[name].visible;
  }

  toggleVisibility(name) {
    const value = this.debugLayers[name];
    value.visible = !value.visible;
    this.rerender();
  }

  cssColor(name) {
    const value = this.debugLayers[name];
    return value.style.strokeColor.toCSS();
  }

  public rerender() {
    this.queryParamUpdateCb(this.params);
    this.metaParamBuilder.rerender(this.params);
    this.doRender().then(() => {
      $('.previewAreaPadding').css('height', 
        document.getElementById('previewArea').clientHeight + 'px');
    });
  }

  public onParamChangeHelper({ metaParameter, value }) {
    // console.log(metaParameter);
    this.params[metaParameter.name] = value;
  }


  public onParamChange({ metaParameter, value }) {
    // console.log(metaParameter);
    this.onParamChangeHelper({metaParameter, value});
    this.rerender();
  }

  public showError(errorMessage) {
    $("body").addClass("error");
    $("body").removeClass("loading");
    document.getElementById("errorMessage").innerHTML = errorMessage;
  }

  public downloadPDFHelper(designCallback) {
    const widthInches = paper.project.activeLayer.bounds.width;
    const heightInches = paper.project.activeLayer.bounds.height;

    // @ts-ignore
    const doc = new PDFDocument({
      compress: false,
      size: [widthInches * 72, heightInches * 72]
    });

    SVGtoPDF(doc, designCallback(), 0, 0);

    function blobToDataURL(blob, callback) {
      const a = new FileReader();

      a.onload = function(e) {
        // @ts-ignore
        callback(e.target.result);
      };
      a.readAsDataURL(blob);
    }

    const stream = doc.pipe(blobStream());
    const self = this;
    stream.on("finish", function() {
      const blob = stream.toBlob("application/pdf");
      blobToDataURL(blob, s => self.sendFileToUser(s, "pdf"));
    });
    doc.end();
  }

  public downloadPDF() {
    this.downloadPDFHelper(() => makeSVGData(paper, paper.project, true, svg => $(svg)[0]));
  }

  public downloadOutlinePDF() {
    this.downloadPDFHelper(() => {
      const wholeDesign = makeSVGData(paper, paper.project, true, svg => $(svg)[0]);

      const tmpOuter = new paper.CompoundPath({
        children: [this.currentModel.outer, ...this.currentModel.holes],
        strokeColor: "red",
        strokeWidth: "0.005",
        fillColor: "lightgrey",
        fillRule: "evenodd"
      });
      const outerDesignOnly = makeSVGData(paper, tmpOuter, true, svg => $(svg)[0]);
      const $wholeDesign = $(wholeDesign);
      $wholeDesign.empty();
      $wholeDesign.append($(outerDesignOnly));
      return $wholeDesign[0].outerHTML;
    });
  }

  public downloadSVG() {
    const data = makeSVGData(paper, paper.project, true, svg => $(svg)[0]);
    const mimeType = "image/svg+xml";
    const encoded = encodeURIComponent(data);
    const uriPrefix = "data:" + mimeType + ",";
    const dataUri = uriPrefix + encoded;

    this.sendFileToUser(dataUri, "svg");
  }

  resetModal() {
    this.designName = "";
    this.designNameState = null;
  }

  public saveToMyLibrary() {
    this.$bvModal.show("save-modal");
  }

  form(): Vue & { checkValidity: () => boolean } {
    return this.$refs.form as Vue & { checkValidity: () => boolean };
  }

  focusNameElement = () => {
    (this.$refs.designName as any).focus();
  };

  handleOk(bvModalEvt) {
    console.log("ok");
    // Prevent modal from closing
    bvModalEvt.preventDefault();
    // Trigger submit handler
    this.handleSave();
  }

  handleSave() {
    const valid = this.form().checkValidity();
    this.designNameState = valid;

    // Exit when the form isn't valid
    if (!valid) {
      return;
    }

    console.log('designName', this.designName);

    var db = firebase.firestore();

    const data = makeSVGData(paper, paper.project, true, svg => $(svg)[0]);

    db.collection("saved").add({
      svg: data,
      ts: new Date(),
      user: this.user.data,
      params: this.params,
      designName: this.designName,
      outerDesign: this.outerDesign,
      innerDesign: this.innerDesign,
    });

    // Hide the modal manually
    this.$nextTick(() => {
      this.$bvModal.hide("save-modal");
    });
  }

  public sendFileToUser(dataUri, extension) {
    const downloadLink = document.createElement("a");
    downloadLink.href = dataUri;

    const filename = this.makeFilename(extension);

    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    return false;
  }

  public makeFilename(extension: string): string {
    // @ts-ignore
    let filename = this.modelMaker.name;
    if (this.modelMaker.subModel) {
      filename = this.modelMaker.constructor.name + "-" + this.modelMaker.subModel.constructor.name;
    }
    const modelName = this.modelMaker.constructor.name;
    filename += `-${this.params[modelName + ".height"]}x${
      this.params[modelName + ".wristCircumference"]
    }x${this.params[modelName + ".forearmCircumference"]}`;
    filename += "." + extension;
    return filename;
  }

  public makeGrid(canvas, xPixelsPerInch, yPixelsPerInch) {
    const data = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <pattern id="smallGrid" width="${xPixelsPerInch / 10}" height="${yPixelsPerInch /
      10}" patternUnits="userSpaceOnUse">
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
    $("#gridArea")[0].innerHTML = data;
  }

  public async doRender() {
    const previewDiv = document.getElementById("previewArea");

    $("body").addClass("loading");
    $("body").removeClass("error");
    $(".playArea").show();

    // rebuild params from X.a to {X: {a: }}
    let modelParams = new Map<string, any>();
    if (this.modelMaker.subModel) {
      _.each(this.params, (value, key) => {
        const parts = key.split(".");
        if (parts.length == 2) {
          modelParams[parts[0]] = modelParams[parts[0]] || {};
          modelParams[parts[0]][parts[1]] = value;
        } else {
          throw new Error("param does not have a dot: " + key);
        }
      });
    } else {
      modelParams = new Map(this.params);
    }

    const canvas: HTMLCanvasElement = document.getElementById("myCanvas") as HTMLCanvasElement;
    var paper1 = new paper.PaperScope();
    paper.setup(canvas);
    paper.settings.insertItems = false;
    paper.activate();

    if (paper != null && paper.project != null) {
      paper.project.activeLayer.removeChildren();
      _.forEach(getDebugLayers(), (v: paper.Group, k) => {
        v.removeChildren();
      });
    }

    this.currentModel = await this.modelMaker.make(paper, modelParams);

    const compoundPath = new paper.CompoundPath({
      children: [this.currentModel.outer, ...this.currentModel.holes, ...this.currentModel.design],
      strokeColor: "red",
      strokeWidth: "0.005",
      fillColor: "lightgrey",
      fillRule: "evenodd"
    });

    paper.project.activeLayer.addChild(compoundPath);

    _.forEach(getDebugLayers(), (v: paper.Group, k: string) => {
      if (v.visible) {
        paper.project.activeLayer.addChild(v);
      }
    });

    $("#svgArea")[0].innerHTML = makeSVGData(paper, paper.project, false, svg => $(svg)[0]);
    console.log($("#svgArea")[0]);

    $("body").removeClass("loading");
  }

  mounted() {
    console.log(this.$store);
    console.log(this.$store.getters.user);
    this.$store.watch(
      (state, getters) => getters.user,
      (newValue, oldValue) => {
        console.log(`Updating from ${oldValue} to ${newValue}`);
      }
    );

    const innerDesignClass = AllInnerDesigns.find(d => d.name == this.innerDesign);
    const outerDesignClass = AllOuterDesigns.find(d => d.name == this.outerDesign);

    const innerDesign = new innerDesignClass();
    this.modelMaker = new outerDesignClass(innerDesign);
    $(".clear-on-reinit").empty();

    this.params = { ...this.$route.query };
    this.queryParamUpdateCb = params => {
      if (!this.isFirstQueryReplace || !this.$route.query) {
        this.$router.replace({ query: params });
      }
      this.isFirstQueryReplace = false;
    };

    $(".meta-parameter-container").remove();

    this.metaParamBuilder = new MetaParameterBuilder(
      this.params,
      _.bind(this.onParamChange, this)
    )
    
    this.metaParamBuilder.buildMetaParametersForModel(
      this.modelMaker, 
      document.getElementById("outerParameterDiv")
    );

    this.metaParamBuilder.buildMetaParametersForModel(
      this.modelMaker.subModel, 
      document.getElementById("innerParameterDiv")
    );

    this.rerender();
  }

  changeDesign() {
    this.$router.replace("/");
  }

  randomize() {
    console.log('random!');
    this.metaParamBuilder.randomize(this.onParamChangeHelper);
    this.rerender();
  }
}
</script>
