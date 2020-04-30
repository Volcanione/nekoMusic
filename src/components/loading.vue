<template>
  <transition
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut">
    <div
      v-if="loadingshow"
      class="loading">
      <div class="rotate">
        <i class="iconfont icon-loading"></i>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    isLoading: {
      type: [Number, Boolean],
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      loadingshow: true
    }
  },
  watch: {
    isLoading(val, old) {
      setTimeout(() => {
        if (typeof this.isLoading === 'boolean') {
          this.loadingshow = val 
        } else {
          this.loadingshow = !val 
        }
      }, 500)
    }
  },
  mounted() {
    if (typeof this.isLoading === 'boolean') {
      this.loadingshow = this.isLoading
    } else {
      this.loadingshow = !this.isLoading
    }
  }
}
</script>

<style lang="less" scoped>
.loading {
  position: fixed;
  top: 0;
  width: 100%;
  bottom: 0;
  background: #eeeeee;
  z-index: 500;
  display: flex;
  .rotate {
    margin: auto;
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 4px solid #ddd;
    z-index: 600;
    display: flex;
    animation: rotate 2s infinite linear;
    .iconfont {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 40px !important;

      color: #999;
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
