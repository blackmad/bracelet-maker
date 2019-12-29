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
          <a class="downloadButton downloadSVG">Download SVG</a>
          <a class="downloadButton downloadPDF">Download PDF</a>
          <a class="downloadButton downloadOutlinePDF">Download Outline PDF</a>
        </div>
      </div>
    </div>

    <div class="container p-xs-3 p-sm-3 p-md-4 p-lg-5">
      <div class="playArea container">
        <div class="m-3">
          <h1 class="title">Sizing</h1>
          <small>
            <div class="sizingInfo patternInfo">/</div>
          </small>
          <div id="outerParameterDiv" class="row clear-on-reinit"></div>
        </div>

        <div id="parameterSection" class="m-3">
          <h1 class="title">Design</h1>
          <div class="patternInfo">
            <small>
              Not all of these variables do what they say. Consider them various
              ways to play with the randomness until you find a design you like.
            </small>
          </div>

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

        <div id="designScratchArea">
        </div>

        <div class="row justify-content-center">
          <button
            class="btn btn-primary m-1 changeDesign"
            @click="changeDesign"
          >
            Change Design
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { AllInnerDesigns } from "@/bracelet-maker/designs/inner/all";
import { AllOuterDesigns } from "@/bracelet-maker/designs/outer/all";
import { OuterPaperModelMaker } from "../bracelet-maker/model-maker";
import { DavidsPlayground } from "@/new-playground/new-playground";
import * as $ from "jquery";
import { getDebugLayers, getDebugLayerNames } from "@/bracelet-maker/utils/debug-layers";

@Component({})
export default class NewPlaygroundView extends Vue {
  designs = AllInnerDesigns;
  @Prop(String) outerDesign: string;
  @Prop(String) innerDesign: string;
  isFirstQueryReplace = true;
  debugLayers = getDebugLayers();
  debugLayerNames = getDebugLayerNames();
  playground: DavidsPlayground = null;

  toggleVisibility(name) {
    const value = this.debugLayers[name];
    value.visible = !value.visible;
    this.playground.rerender();
  }

  cssColor(name) {
    const value = this.debugLayers[name];
    console.log(value.style.strokeColor.toCSS());
    return value.style.strokeColor.toCSS();
  }

  mounted() {
    const innerDesignClass = AllInnerDesigns.find(
      d => d.name == this.innerDesign
    );
    const outerDesignClass = AllOuterDesigns.find(
      d => d.name == this.outerDesign
    );

    const innerDesign = new innerDesignClass();
    const modelMaker: OuterPaperModelMaker = new outerDesignClass(innerDesign);
    $(".clear-on-reinit").empty();
    console.log(this.debugLayers);
    this.playground = new DavidsPlayground(modelMaker, this.$route.query, params => {
      if (!this.isFirstQueryReplace || !this.$route.query) {
        this.$router.replace({ query: params });
      }
      this.isFirstQueryReplace = false;
    })
    this.playground.rerender();
  }

  changeDesign() {
    this.$router.replace("/");
  }
}
</script>
