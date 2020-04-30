<template>
  <div
    class="titleBack"
    :style="topStyle"
    :class="{fixed:fixed}">
    <span
      class="back"
      @click="goBack"><i class="iconfont icon-houtui"></i></span>
    <span class="right">
      <slot name="rightBtn"></slot>
    </span>
    <div class="info">
      <p class="one-txt-cut">{{ topTitle }} <slot></slot>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    titleStyle: {
      type: Object,
      default() {
        return {
          backgroundColor: 'rgba(212,68,57,1)',
          color: '#fff'
        }
      }
    },
    fixed: {
      type: Boolean,
      default() {
        return false
      }
    },
    transition: {
      type: Boolean,
      default() {
        return false
      }
    },
    transitionH: {
      type: Number,
      default() {
        return 44
      }
    },
    transitiontTitle: {
      type: String,
      default() {
        return this.title
      }
    }
  },
  data() {
    return {
      gradualStyle: {
        color: '#fff'
      },
      topTitle: ''
    }
  },

  methods: {
    goBack() {
      this.$router.isBack()
      this.$router.go(-1)
    }
  },
  computed: {
    ...mapState(['scrollY']),
    topStyle() {
      if (!this.transition) {
        return this.titleStyle
      }
      return this.gradualStyle
    }
  },
  watch: {
    scrollY() {
      const op = Math.max(-this.scrollY / this.transitionH, 0)
      this.$set(
        this.gradualStyle,
        'backgroundColor',
        `rgba(212, 68, 57, ${op})`
      )
      if (op >= 1) {
        this.topTitle = this.transitiontTitle
      } else {
        this.topTitle = this.title
      }
    }
  },
  created() {
    this.topTitle = this.title
  }
}
</script>

<style lang="less" scoped>
.titleBack {
  height: 100%;
  overflow: hidden;
  height: 44px;
  position: relative;
  z-index: 9999;
  span {
    width: 44px;
    height: 44px;
    display: flex;
    &.back {
      float: left;
    }
    &.right {
      float: right;
    }
    .iconfont {
      margin: auto;
    }
  }
  .info {
    display: flex;
    font-size: 15px;
    overflow: hidden;
    height: 44px;
    align-items: center;
    p {
      flex: 1;
      height: auto;
    }
  }
}
.fixed {
  position: fixed;
  width: 100%;
  z-index: 999;
}
</style>
