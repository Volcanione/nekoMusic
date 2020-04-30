<template>
  <!-- <transition enter-active-class="animated fadeInRightBig"
    leave-active-class="animated fadeOutRightBig"> -->
  <div class="full-container">
    <div class="fullContent">
      <slot></slot>
    </div>
  </div>
  <!-- </transition> -->
</template>
<script>
export default {
  data() {
    return {}
  }
}
</script>



<style lang="less" scoped>
.fullContent {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
