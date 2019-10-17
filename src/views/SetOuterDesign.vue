<template>
  <b-container class="p-xs-3 p-sm-3 p-md-4 p-lg-5">
    <div class="row">
      <DesignSelectBlock
        :designName="design.name"
        :designClassName="design.name"
        v-on:design-selected="onDesignSelected"
        v-for="design in designs"
        :key="design.name"
      />
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { AllOuterDesigns } from "@/bracelet-maker/designs/outer/all";
import DesignSelectBlock from "@/components/DesignSelectBlock.vue";

@Component({
  components: {
    DesignSelectBlock
  }
})
export default class SetOuterDesign extends Vue {
  designs = AllOuterDesigns;

  onDesignSelected(designName) {
    this.$router.push({
      name: "SetInnerDesign",
      params: { outerDesign: designName }
    });
  }
}
</script>