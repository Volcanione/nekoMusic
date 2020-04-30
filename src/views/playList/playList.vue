<template>
  <transition-view>
    <div class="full_header">
      <title-back :title="$route.params.search?$route.params.search:'歌单'"></title-back>
    </div>
    <div class="full_main">
      <div class="container">
        <loading :is-loading="playsList.length" />
        <loading
          v-show="updataLoading"
          class="updateloading" />
        <div class="titel">
          <p>共{{ count }}歌单</p>
        </div>
        <wapper-scroll
          :pull-up-load-and-refresh="true"
          @pullingUp="fn_pullingUp"
          @pullingDown="fn_pullingDown">
          <ul class="playsList">
            <plays-item
              v-for="item in playsList"
              :key="item.id"
              :data="item"
              :handler="fn_playlistsDetail" />
          </ul>
        </wapper-scroll>
      </div>
    </div>
  </transition-view>
</template>
<script>
import mixin from '../../utils/mixins'
import playsItem from '../../components/list-item/plays-item.vue'
export default {
  components: {
    playsItem
  },
  mixins: [mixin],
  data() {
    return {
      page: 1,
      pageSize: 30,
      playsList: [],
      count: 0,
      updataLoading: false
    }
  },
  created() {
    this.fn_getPlayData()
  },
  methods: {
    //获取数据
    async fn_getPlayData(type = 'refresh') {
      const { playlists, playlistCount } = await this.fn_getSearchData(
        '/search',
        1000,
        this.$route.params.search,
        this.page,
        this.pageSize
      )
      switch (type) {
        case 'refresh':
          this.playsList = playlists
          break
        default:
          if (playlists) {
            this.playsList = [...this.playsList, ...playlists]
          }
          break
      }
      this.count = playlistCount
    },
    //上拉加载
    async fn_pullingUp(scroll) {
      this.updataLoading = true
      const lastCount = this.count - this.pageSize * this.page
      if (lastCount > 0) {
        this.page += 1
        await this.fn_getPlayData('update')
        //上拉加载完成
        scroll.refresh()
      } else {
        this.toast({
          title: '到底了'
        })
      }
      scroll.finishPullUp()
      this.updataLoading = false
    },
    //下拉刷新
    async fn_pullingDown(scroll) {
      this.updataLoading = true
      this.page = 1
      await this.fn_getPlayData()
      this.updataLoading = false

      //下拉刷新完成
      scroll.finishPullDown()
      scroll.refresh()
    },
    //点击歌单详细
    fn_playlistsDetail(id) {
      this.$router.push(`/playListDetail/${id}`)
    }
  }
}
</script>

<style lang="less" scoped>
.full_main {
  .updateloading {
    top: 44px;
    opacity: 0.2;
  }
  .titel {
    padding: 0 10px;
    height: 40px;
    overflow: hidden;
    color: #666;
    border-bottom: 1px solid #f0f0f0;
    span {
      float: left;
      width: 40px;
      height: 100%;
      display: flex;
      .iconfont {
        margin: auto;
      }
    }
    p {
      font-size: 14px;
      line-height: 40px;
    }
  }
}
</style>
