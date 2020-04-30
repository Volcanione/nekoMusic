<template>
  <div class="playItem">
    <loading
      v-show="updataLoading"
      class="updateloading"
      :style="{top:loadingTop+'px'}" />
    <wapper-scroll
      :pull-up-load-and-refresh="true"
      @pullingUp="fn_pullingUp"
      @pullingDown="fn_pullingDown"
      @init="fn_init">
      <ul class="songListCmp">
        <play-list-item
          v-for="item in tagPlayList"
          :key="item.id"
          :data="item"
          :handler="()=>fn_routerPush(item.id)" />
      </ul>
    </wapper-scroll>
  </div>
</template>

<script>
import playListItem from '../list-item/playList-item.vue'
export default {
  components: {
    playListItem
  },
  props: {
    type: {
      type: Number,
      default: function() {
        return 0
      }
    },
    cat: {
      required: true
    }
  },
  data() {
    return {
      tagPlayList: [],
      updataLoading: false,
      pageSize: 30,
      count: 0,
      page: 1,
      scroll: null,
      loadingTop: 84
    }
  },
  watch: {
    async cat() {
      this.updataLoading = true
      this.tagPlayList = []
      this.page = 1
      this.scroll.scrollTo(0, 0, 0)
      await this.fn_getSongList()
      this.$nextTick(() => {
        this.updataLoading = false
      })
    }
  },
  created() {
    const { name } = this.$route.query
    name && this.fn_getSongList()
  },
  methods: {
    //初始化scroll
    fn_init(scroll) {
      this.scroll = scroll
    },
    //获取推荐歌单
    async fn_getSongList(type = 'refresh') {
      const { name } = this.$route.query
      this.loadingTop = name ? 44 : 84
      try {
        const {
          data: { code, playlists, total }
        } = await this.$http({
          url: '/top/playlist',
          params: {
            cat: name ? name : this.cat,
            limit: this.pageSize,
            offset: (this.page - 1) * this.pageSize
            //  timestamp: +new Date()
          }
        })
        if (code === 200) {
          switch (type) {
            case 'refresh':
              this.tagPlayList = playlists
              break
            default:
              if (playlists) {
                this.tagPlayList = [...this.tagPlayList, ...playlists]
              }
              break
          }
          this.count = total
          this.$emit('pageIsLoading', playlists.length)
        }
      } catch (error) {
        console.log('获取数据失败')
      }
    },

    //歌单详细
    fn_routerPush(id) {
      this.$router.push(`/playListDetail/${id}`)
    },
    //上拉
    async fn_pullingUp(scroll) {
      this.updataLoading = true
      const lastCount = this.count - this.pageSize * this.page
      if (lastCount > 0) {
        this.page += 1
        await this.fn_getSongList('update')
        //上拉加载完成
        scroll.refresh()
      } else {
        this.toast({
          title: '到底了',
          top: 94
        })
      }
      scroll.finishPullUp()
      this.updataLoading = false
    },
    //下拉刷新
    async fn_pullingDown(scroll) {
      this.updataLoading = true
      this.page = 1
      await this.fn_getSongList()
      this.updataLoading = false
      //下拉刷新完成
      scroll.finishPullDown()
      scroll.refresh()
    }
  }
}
</script>


<style lang="less" scoped>
.playItem {
  flex: 1;
  display: flex;
  overflow: hidden;
  .updateloading {
    opacity: 0.2;
    z-index: 499;
  }
  .songListCmp {
    margin-top: 10px;
    padding: 0 5px;
    justify-content: start;
    flex-wrap: wrap;
    overflow: hidden;
  }
}
</style>
