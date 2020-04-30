<template>
  <div>
    <swiper
      ref="mySwiper"
      class="swiperBanner"
      :options="swiperOption">
      <!-- slides -->

      <swiper-slide
        v-for="item in slideData"
        :key="+item.bannerId"
        class="swiperSlide"
        @click="fn_handleURL(item)">
        <img
          :src="item.pic"
          alt="">
      </swiper-slide>
      <!-- Optional controls -->
      <div
        v-show="slideData.length"
        slot="pagination"
        class="swiper-pagination"></div>

    </swiper>
  </div>
</template>

<script>
// require styles
import 'swiper/dist/css/swiper.css'

import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'carrousel',
  components: {
    swiper,
    swiperSlide
  },
  props: {
    slideData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      swiperOption: {
        init: false,
        loop: true,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false
        },
        on: {
          click: () => {
            const swiper = this.$refs.mySwiper.swiper
            const i = swiper.realIndex
            if (this.slideData[i].url) {
              return window.open(this.slideData[i].url)
            }
          }
        },
        pagination: {
          el: '.swiper-pagination'
        }
        // navigation: {
        //   nextEl: '.swiper-button-next',
        //   prevEl: '.swiper-button-prev',
        // },
      }
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  updated() {
    if (this.slideData.length > 1) {
      this.swiper.init()
    }
  },
  mounted() {
    // current swiper instance
    // 然后你就可以使用当前上下文内的swiper对象去做你想做的事了
    this.$nextTick(() => {
      // 下一个UI帧再初始化swiper
    })
  },
  methods: {
    fn_handleURL(item) {
      console.log(item)
    }
  }
}
</script>

<style lang="less">
@import url('../assets/theme/default.less');
.swiperBanner {
  .swiperSlide {
    height: calc((100vw - 20px) * 0.3889);
    background: #ddd;
    display: block;
    img {
      width: 100%;
      display: block;
    }
  }
  .swiper-pagination-bullet {
    background: #fff;
    opacity: 1;
  }
  .swiper-pagination-bullet-active {
    background: @bgred;
    opacity: 1;
  }
}
</style>

