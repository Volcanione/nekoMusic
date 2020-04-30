<template>
  <div
    class="root"
    @click="$emit('click')">
    <span class="btn">
      <slot /></span>
    <svg
      :key="progress"
      class="arc"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg">
      <path
        id="arc"
        fill="none"
        d="M 49.99 10.00 A 40.00 40.00 0 1 0 50.00 10.00" />
      <path
        id="graph"
        :style="` stroke-dashoffset: calc(251.35 / 100 * ${progress});`"
        fill="none"
        d="M 49.99 10.00 A 40.00 40.00 0 1 0 50.00 10.00" />
    </svg>
  </div>
</template>
<script>
export default {
  props: {
    progress: {
      type: Number,
      default() {
        return 0
      }
    }
  }
}
</script>
<style lang="less" scoped>
.root {
  position: relative;
  display: flex;
  width: 38px;
  height: 38px;
  .btn {
    margin: auto;
    position: relative;
    z-index: 1;
    /deep/ .iconfont {
      margin: auto;
      font-size: 18px !important;
      color: #666;
    }
  }
  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 38px;
    height: 38px;
    stroke: #d44439;
  }
  #arc {
    stroke-width: 6px;
  }
  #graph {
    stroke: #666;
    transition: stroke-dashoffset 0.8s ease-out;
    stroke-width:6px;
    stroke-dasharray: 251.35;
  }
}
</style>
