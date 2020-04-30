<template>
  <transition
    enter-active-class="animated fadeInDown"
    leave-active-class="animated fadeOutUp"
    @after-leave="leaveCancelled">
    <div
      v-if="show"
      class="root"
      :style="`top:${top}px`">
      <div class="content">
        {{ title }}
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'toast',
  data() {
    return {
      homeName: ['recom', 'rank', 'artist'],
      timeId: -1,
      top: 54,
      duration: 1000,
      title: '',
      show: false
    }
  },
  watch: {
    show(state) {
      if (state) {
        this.$nextTick(() => {
          clearTimeout(this.timeId)
          this.timeId = setTimeout(() => {
            this.show = false
            this.$emit('cancell')
          }, this.duration)
        })
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    leaveCancelled() {
      this.$destroy()
    },
    init() {
      if (this.homeName.includes(this.$route.name)) {
        this.top = 98
      } else if (this.$route.name === 'my') {
        this.top = 10
      }
    }
    
  }
}
</script>
<style lang="less" scoped>
.root {
  position: fixed;
  z-index: 999;
  width: 50px;
  height: 30px;
  left: 50%;
  margin-left: -25px;
  .content {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    color: #333;
    white-space:nowrap;  
  }
}
</style>
