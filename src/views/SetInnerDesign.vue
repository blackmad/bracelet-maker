<template>
  <div class="container p-xs-3 p-sm-3 p-md-4 p-lg-5">
    <div class="row">
      <h2>Pick an inner design</h2>
    </div>
    <div class="row">
      <DesignSelectBlock
        :designName="design.name.replace('InnerDesign', '')"
        :designClassName="design.name"
        v-on:design-selected="onDesignSelected"
        v-for="design in designs"
        :key="design.name"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { AllInnerDesigns } from "@/bracelet-maker/designs/inner/all";
import DesignSelectBlock from "@/components/DesignSelectBlock.vue";

@Component({
  components: {
    DesignSelectBlock
  }
})
export default class SetInnerDesign extends Vue {
  designs = AllInnerDesigns;
  @Prop(String) outerDesign: string;

  onDesignSelected(designName) {
    this.$router.push({
      name: "NewPlayground",
      params: { outerDesign: this.outerDesign, innerDesign: designName }
    })
  }
}
</script>