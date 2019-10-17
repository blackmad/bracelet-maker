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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AllOuterDesigns } from '@/bracelet-maker/designs/outer/all';
import DesignSelectBlock from '@/components/DesignSelectBlock.vue'

@Component({
  components: {
    DesignSelectBlock
  }}
)
export default class SetOuterDesign extends Vue {
  designs = AllOuterDesigns;

  onDesignSelected(designName) {
    console.log(designName);
    this.$router.push({ name: 'SetInnerDesign', params: { outerDesign: designName } })
  }
}
</script>