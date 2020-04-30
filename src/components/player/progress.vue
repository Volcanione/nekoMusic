<template>
  <div
    ref="progressBar"
    class="progress-bar"
    @click="fn_progressClick">
    <div class="bar-inner">
      <div
        ref="progress"
        class="progress"></div>
      <div
        ref="progressBtn"
        class="progress-btn-wrapper"
        @touchstart.prevent="fn_progressTouchStart"
        @touchmove.prevent="fn_progressTouchMove"
        @touchend="fn_progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from '../../utils/dom'
import { mapState } from 'vuex'
const transform = prefixStyle('transform')

const BTN_WIDTH = 16
export default {
  props: {
    value: {
      type: Number,
      default: 100
    },
    drag: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.touch = {}
    this.bar_width = 0
  },
  methods: {
    fn_progressClick(e) {
      if (!this.drag) {
        return
      }
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this.fn_offset(offsetWidth)
      this.fn_triggerPercent()
      this.$emit('change')
    },
    fn_progressTouchStart(e) {
      if (!this.drag) {
        return
      }
      this.touch.startX = e.touches[0].clientX
      this.touch.left = this.$refs.progress.clientWidth
      this.$emit('change')
    },
    fn_progressTouchMove(e) {
      if (!this.drag) {
        return
      }
      const delta = e.touches[0].clientX - this.touch.startX
      const offsetWidth = this.touch.left + delta
      this.fn_offset(offsetWidth)
      this.$emit('change')
    },
    fn_progressTouchEnd() {
      if (!this.drag) {
        return
      }
      this.fn_triggerPercent()
    },
    fn_triggerPercent() {
      const percent = this.$refs.progress.clientWidth / this.bar_width
      this.$emit('changePercent', percent)
    },
    fn_offset(width) {
      let w = width
      w = Math.max(w, 0)
      w = Math.min(this.bar_width, w)
      this.$refs.progress.style.width = `${w}px`
      this.$refs.progressBtn.style[transform] = `translateX(${w}px)`
      this.fn_getVal(w / this.bar_width)
    },
    //获取总宽度
    fn_getProgessBarW() {
      this.bar_width = this.$refs.progressBar.clientWidth - BTN_WIDTH
    },
    //获取值
    fn_getVal(val) {
      this.$emit('input', +val.toFixed(4))
    }
  },
  computed: {
    ...mapState(['MusicPlayer'])
  },
  watch: {
    value(newPercent) {
      this.fn_offset(this.bar_width * newPercent)
    },
    'MusicPlayer.openPlayPage': {
      handler() {
        this.fn_getProgessBarW()
        this.fn_offset(this.bar_width * this.value)
      }
    }
  },
  mounted() {
    this.fn_getProgessBarW()
  }
}
</script>

<style scoped lang="less">
@import url('../../assets/theme/default.less');
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: @bgred;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 8px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 5px solid #ddd;
        border-radius: 50%;
        background: @bgred;
      }
    }
  }
}
</style>
