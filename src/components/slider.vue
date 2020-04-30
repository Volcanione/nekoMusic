<template>
  <div
    ref="sliderWrapper"
    class="slider-wrapper">
    <div
      ref="sliderUl"
      class="slider-ul">
      <div
        v-for="(item,index) in imgDatas"
        :key="index"
        class="slider-li">
        <a :href="item.linkUrl">
          <img :src="item.imgSrc">
        </a>
      </div>
    </div>
    <div class="dots">
      <span
        v-for="(item,index) in imgDatas"
        :key="'b'+index"
        :class="{'dot-active' : currentPageIndex == index}"
        @click="linkToPage(index)"></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interVal: {
      type: Number,
      default: 3000
    },
    imgDatas: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      currentPageIndex: 0
    }
  },
  mounted() {
    setTimeout(() => {
      this.fn_setUlWidth()
      this.fn_initSlider()
      this.fn_setAutoplay()
    }, 20)
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this.fn_setUlWidth()
    })
  },
  methods: {
    //初始化wrapper的宽度
    fn_setUlWidth() {
      this.children = this.$refs.sliderUl.children
      const childrenLength = this.loop
        ? this.children.length + 2
        : this.children.length
      this.$refs.sliderUl.style.width = childrenLength * 100 + '%'
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].style.width = 100 / childrenLength + '%'
      }
    },
    //播放
    fn_setAutoplay() {
      let goToIndex = this.currentPageIndex + 1
      const childrenLength = this.loop
        ? this.children.length - 2
        : this.children.length
      if (goToIndex >= childrenLength) {
        goToIndex = 0
      }
      this.timer = setInterval(() => {
        this.slider.goToPage(goToIndex, 0, 400)
      }, this.interVal)
    },
    //初始化better-scroll
    fn_initSlider() {
      const that = this
      this.slider = new BScroll(this.$refs.sliderWrapper, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        probeType: 2
      })
      //监听scroll结束的时候，赋值更新currentPageIndex
      this.slider.on('scrollEnd', () => {
        clearInterval(that.timer)
        that.currentPageIndex = that.slider.getCurrentPage().pageX
        const childrenLength = this.loop
          ? this.children.length - 2
          : this.children.length
        that.fn_setAutoplay()
      })
      const childrenLength = this.loop
        ? this.children.length - 2
        : this.children.length
      //左滑到最左还想轮播
      this.fn_checkScroll(childrenLength, this.$refs.sliderWrapper.offsetWidth)
    },
    //监听滑事件
    fn_checkScroll(childrenLength, itemWidth) {
      const that = this
      this.slider.on('scroll', () => {
        clearInterval(that.timer)
        const leftScroll = parseInt(
          that.$refs.sliderUl.style['transform'].substring(10, 15)
        )
        const left = -1 * itemWidth
        const right = left * childrenLength
        if (leftScroll > left) {
          that.slider.goToPage(childrenLength, 0, 400)
        } else if (leftScroll < right) {
          that.slider.goToPage(1, 0, 400)
        }
      })
    }
  }
}
</script>

<style>
.slider-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 1px;
  overflow: hidden;
}
.dots {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
  display: flex;
  flex-direction: row;
}
.dots span {
  cursor: pointer;
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  margin: 0 4px;
}
.dot-active {
  background: #d44439 !important;
}

.slider-ul {
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  height: 100%;
}
.slider-li {
  /* width: 20%; */
  height: 100%;
  float: left;
  box-sizing: border-box;
  overflow: hidden;
}
.slider-li a {
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: block;
}
.slider-li img {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
