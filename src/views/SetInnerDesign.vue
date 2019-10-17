<template>
  <div class="container p-xs-3 p-sm-3 p-md-4 p-lg-5 ">
    <div v-for="design in designs" :key="design.name">
      <DesignSelectBlock
        :designName="design.name"
        :designClassName="design.name"
        v-on:design-selected="onDesignSelected"
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

  mounted() {
    console.log(this.outerDesign);
  }

  onDesignSelected(designName) {
    console.log(designName);
    this.$router.push({
      name: "NewPlayground",
      params: { outerDesign: this.outerDesign, innerDesign: designName }
    });
  }
}
</script>