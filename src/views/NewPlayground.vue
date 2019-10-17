
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
          <a href="#" class="downloadSVG">Download SVG</a>
          <a href="#" class="downloadPDF">Download PDF</a>
        </div>
      </div>
    </div>

    <div class="container p-xs-3 p-sm-3 p-md-4 p-lg-5">
      <div class="m-3 control-selectors outer-design-container">
        <h1>Choose a shape</h1>
        <div class="row justify-content-center outer-design-row"></div>
      </div>

      <div class="m-3 algoPattern hideAfterDesignSelected inner-design-container">
        <h1>Choose a design</h1>
        <div class="row justify-content-center inner-design-row"></div>
      </div>

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

        <div class="row justify-content-center">
          <button class="btn btn-primary m-1 changeDesign">Change Design</button>
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
import { DavidsPlayground } from "../bracelet-maker/new-playground/new-playground";
import * as $ from "jquery";

@Component({})
export default class NewPlaygroundView extends Vue {
  designs = AllInnerDesigns;
  @Prop(String) outerDesign: string;
  @Prop(String) innerDesign: string;

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
    new DavidsPlayground(modelMaker, (params) => this.$router.replace({query: params})).rerender();
  }
}
</script>