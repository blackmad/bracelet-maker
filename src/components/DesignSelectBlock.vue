<template>
  <div class="design-container col-sm-12 col-md-4" @click="onClick()">
    <div class="panel panel-default border m-1 p-1">
      <div class="panel-body text-center">
        <img :src="imgSrc"/>
      </div>
      <div class="panel-footer text-center">
        <button
          class="btn-primary btn-sm m-1 ${extraButtonClassNames}"
          value="${designClassName}"
          @click="onClick()"
        >{{designName}}</button>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { AllOuterDesigns } from "@/bracelet-maker/designs/outer/all";

@Component
export default class DesignSelectBlock extends Vue {
  @Prop(String) designClassName: string;
  @Prop(String) designName: string;

  get imgSrc() {
    return `demo-output/${this.designClassName}.png`;
  }

  onClick() {
    this.$emit('design-selected', this.designClassName)
  }
}
</script>