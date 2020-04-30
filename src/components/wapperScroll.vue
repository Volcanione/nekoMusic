<template>
  <div
    :ref="refContent"
    class="wrapper">
    <div class="content">
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    getScorllY: {
      type: Boolean,
      default() {
        return false
      }
    },
    pullUpLoadAndRefresh: {
      type: Boolean,
      default() {
        return false
      }
    },
    refContent: {
      type: String,
      default() {
        return 'wrapper'
      }

    }
  },
  methods: {
    ...mapMutations(['setScrollY', 'setShowHomePlay']),
    fn_initScroll() {
      this.scroll = new BScroll(this.$refs[this.refContent], {
        click: true,
        tap: true,
        probeType: 3,
        pullUpLoad: this.pullUpLoadAndRefresh && {
          threshold: 90,
          stop: 40
        },
        pullDownRefresh: this.pullUpLoadAndRefresh && {
          threshold: 90,
          stop: 40
        }
      })
      this.$emit('init', this.scroll)
    }
  },
  mounted() {
    this.fn_initScroll()
    this.scroll.refresh()
    this.$store.commit('setShowHomePlay', true)
    this.scroll.on('scroll', ({ y }) => {
      if (window.isNaN(y)) {
        this.scroll.destroy()
        return this.scroll.refresh()
      }
      this.$store.commit('setShowHomePlay', y > this.scroll.maxScrollY)
      if (this.getScorllY) {
        this.$store.commit('setScrollY', y)
        this.$emit('scroll', this.scroll, y)
      }
    })
    if (this.pullUpLoadAndRefresh) {
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp', this.scroll)
      })
      this.scroll.on('pullingDown', () => {
        this.$emit('pullingDown', this.scroll)
      })
    }  
  },
  computed: {
    ...mapState(['scrollY', 'MusicPlayer'])
  },
  watch: {
    'MusicPlayer.playlistID'() {
      this.scroll.refresh()
      this.$store.commit('setShowHomePlay', true)
    }
  },
  activated() {
    //console.log('激活了')
    this.scroll.refresh()
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  // background: #f0f0f0;
  .content {
    & > div {
      overflow: hidden;
    }
    .marginBottom {
    //  margin-bottom: 60px;
    }
  }
}
</style>

