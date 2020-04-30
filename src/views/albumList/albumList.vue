<template>
  <transition-view>
    <div class="full_header">
      <title-back :title="$route.params.search?$route.params.search:'专辑'"></title-back>
    </div>
    <div class="full_main">
      <div class="container">
        <loading :is-loading="albumsList.length" />
        <loading
          v-show="updataLoading"
          class="updateloading" />
        <div class="titel">
          <p>共{{ count }}专辑</p>
        </div>
        <wapper-scroll
          :pull-up-load-and-refresh="true"
          @pullingUp="fn_pullingUp"
          @pullingDown="fn_pullingDown">
          <ul class="albumsList">
            <albums-item
              v-for="item in albumsList"
              :key="item.id"
              :data="item"
              :handler="fn_getAlbumDetail" />
          </ul>
        </wapper-scroll>
      </div>
    </div>
  </transition-view>
</template>
<script>
import mixin from '../../utils/mixins'
import albumsItem from '../../components/list-item/albums-item.vue'
export default {
  components: {
    albumsItem
  },
  mixins: [mixin],
  data() {
    return {
      page: 1,
      pageSize: 30,
      albumsList: [],
      count: 0,
      updataLoading: false
    }
  },
  created() {
    this.fn_getAlbumData()
  },
  methods: {
    //获取数据
    async fn_getAlbumData(type = 'refresh') {
      const { albums, albumCount } = await this.fn_getSearchData(
        '/search',
        10,
        this.$route.params.search,
        this.page,
        this.pageSize
      )
      switch (type) {
        case 'refresh':
          this.albumsList = albums
          break
        default:
          if (albums) {
            this.albumsList = [...this.albumsList, ...albums]
          }
          break
      }
      this.count = albumCount
    },
    //上拉加载
    async fn_pullingUp(scroll) {
      this.updataLoading = true
      const lastCount = this.count - this.pageSize * this.page
      if (lastCount > 0) {
        this.page += 1
        await this.fn_getAlbumData('update')
        //上拉加载完成
        scroll.refresh()
      }else {
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
      await this.fn_getAlbumData()
      this.updataLoading = false

      //下拉刷新完成
      scroll.finishPullDown()
      scroll.refresh()
    },
    //点击专辑详细
    fn_getAlbumDetail(id) {
      this.$router.push(`/albumDetail/${id}`)
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
