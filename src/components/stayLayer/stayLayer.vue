<template>
  <transition
    enter-active-class="animated fadeInUp"
    leave-active-class="animated fadeOutDown">
    <div v-if="show" class="root">
      <div class="header">
        <p class="title">{{ title }}</p>
        <i class="iconfont icon-icon--shanchu" @click="close"></i>
      </div>
      <div class="content">
        <wapper-scroll ref-content="stayWrapper">
          <slot />
        </wapper-scroll>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    title: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    close() {
      this.$emit('update:show', false)
    }
  }
}
</script>
<style lang="less" scoped>
.root {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 44px;
  background: #ffffff;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  z-index: 999;
  .header{
    height: 40px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title{
      padding:0 10px;
      font-size: 14px;
      color: #333;
    }
    .iconfont{
      color: #999;
      padding: 10px;
    }
  }
  .content{
   bottom: 0;
    width: 100%;
    top: 40px;
    position: absolute;
    overflow: hidden;
    /deep/ .wrapper{
      height: 100%;
    }
  }
}
</style>
