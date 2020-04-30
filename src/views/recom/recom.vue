<template>
  <transition
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut">
    <div class="container">
      <div
        v-show="topBg"
        class="topBg">
      </div>
      <loading
        class="loading"
        :is-loading="slideData.length" />
      <wapper-scroll
        :get-scorll-y="true"
        @scroll="fn_getscrollY"
        @init="fn_init">

        <div
          class="bodyBg"
          :style="{top:topH+'px'}"></div>
        <!--内容区-->
        <div
          ref="banner"
          class="banner">
          <slider-wapper :slide-data="slideData"></slider-wapper>
        </div>
        <div class="songList">
          <div class="title">
            <span>推荐歌单</span>
            <span @click="$router.push('/recomPlayList')">歌单广场</span>
          </div>
          <recom-play-list :type="ListType"></recom-play-list>
        </div>

        <div class="tuneList">
          <div class="title">
            <span>推荐歌曲</span>
          </div>
          <recom-song-list></recom-song-list>
        </div>
        <!---->
      </wapper-scroll>
    </div>
  </transition>
</template>
<script>
import sliderWapper from '../../components/sliderSwiper.vue'
import recomPlayList from '../../components/recomPlayList.vue'
import recomSongList from '../../components/recomSongList.vue'
export default {
  name: 'recom',
  components: {
    sliderWapper,
    recomPlayList,
    recomSongList
  },
  data() {
    return {
      bannerH: 0,
      scrollY: 0,
      slideData: [],
      ListType: 1, //获取歌单的类型，0全部歌单，1部分歌单
      topBg: true,
      topH: 50,
      scroll: null
    }
  },
  watch: {},
  mounted() {
    //resize
    window.addEventListener('resize', this.fn_getBodyWidht)
  },
  created() {
    //获取banner
    this.fn_getBanner()
    this.fn_getBodyWidht()
  },
  activated() {
    this.topBg = true
    this.scroll.scrollTo(0, 0, 0)
  },
  destroyed() {
    window.removeEventListener('resize', this.fn_getBodyWidht)
  },
  methods: {
    //获取banner
    async fn_getBanner() {
      try {
        const {
          data: { banners, code }
        } = await this.$http({
          url: '/banner',
          params: {
            type: 1
          }
        })
        if (code === 200) {
          // console.log(banners)
          this.slideData = banners
          this.toast({
            title: '已获取最新推荐内容'
          })
        }
      } catch (error) {
        console.log('获取数据失败')
      }
    },
    //初始化scroll
    fn_init(scroll) {
      this.scroll = scroll
    },
    //设置顶部背景效果
    fn_getscrollY(scroll, y) {
      if (y <= scroll.maxScrollY) {
        this.topBg = false
      } else {
        this.topBg = true
      }
    },
    fn_getBodyWidht() {
      this.topH = (window.innerWidth - 20) * (420 / 1080) - 30
    }
  }
}
</script>


<style lang="less" scoped>
@import url('../../assets/theme/default.less');
.container {
  .loading {
    top: 88px;
  }
  .topBg {
    top: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: @bgred;
  }
  .bodyBg {
    position: absolute;
    width: 100%;
    bottom: 0;
    background: #fafafa;
  }
  .banner {
    position: relative;
    margin: 0 10px 10px;
    border-radius: 6px;
    overflow: hidden;
    height: calc((100vw - 20px) * 0.3889);
  }
  .songList,
  .tuneList {
    position: relative;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      margin-bottom: 10px;
      span:first-child {
        font-size: 16px;
        font-weight: 700;
      }
      span:nth-child(2) {
        font-size: 12px;
        color: #666;
        border: 1px solid #666;
        padding: 2px 6px;
        border-radius: 11px;
      }
    }
  }
}
</style>

