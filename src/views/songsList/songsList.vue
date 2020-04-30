<template>
  <transition-view>
    <div class="full_header">
      <title-back :title="$route.params.search?$route.params.search:'单曲'"></title-back>
    </div>
    <div class="full_main">
      <div class="container">
        <loading :is-loading="songsList.length" />
        <loading
          v-show="updataLoading"
          class="updateloading" />
        <div class="total">
          <span @click="fn_playAll"><i class="iconfont icon-bofang"></i></span>
          <p>播放全部（共{{ count }}首）</p>
        </div>
        <wapper-scroll
          :pull-up-load-and-refresh="true"
          @pullingUp="fn_pullingUp"
          @pullingDown="fn_pullingDown"
          @init="fn_init">
          <div class="searchResult">
            <ul class="list">
              <songs-item
                v-for="(item,index) in songsList"
                :key="item.id"
                :data="item"
                :index="index"
                :handler="fn_songDetail" />
            </ul>
          </div>
        </wapper-scroll>
      </div>
    </div>
  </transition-view>
</template>

<script>
import { mapState } from 'vuex'
import Music from '../../utils/createMusic'
import mixin from '../../utils/mixins'
import songsItem from '../../components/list-item/songs-item.vue'
export default {
  components: {
    songsItem
  },
  mixins: [mixin],
  data() {
    return {
      page: 1,
      pageSize: 30,
      songsList: [],
      count: 0,
      updataLoading: false,
      scroll: null
    }
  },
  created() {
    this.fn_getSongsData()
  },
  methods: {
    //获取数据
    async fn_getSongsData(type = 'refresh') {
      const { songs, songCount } = await this.fn_getSearchData(
        '/search',
        1,
        this.$route.params.search,
        this.page,
        this.pageSize
      )
      switch (type) {
        case 'refresh':
          this.songsList = songs
          break
        default:
          if (songs) {
            this.songsList = [...this.songsList, ...songs]
          }
          break
      }
      this.count = songCount
    },
    //初始化scroll
    fn_init(scroll) {
      this.scroll = scroll
    },
    //上拉加载
    async fn_pullingUp(scroll) {
      this.updataLoading = true
      const lastCount = this.count - this.pageSize * this.page
      if (lastCount > 0) {
        this.page += 1
        await this.fn_getSongsData('update')
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
      await this.fn_getSongsData()
      this.updataLoading = false

      //下拉刷新完成
      scroll.finishPullDown()
      scroll.refresh()
    },
    //点击单曲
    async fn_songDetail(ids) {
      const music = await this.fn_getMusicUrl(ids)
      this.fn_openPlay(music)
    },
    //点击单曲获取地址
    async fn_getMusicUrl(ids) {
      const {
        id,
        al: { picUrl },
        ar: artists,
        name
      } = await this.fn_getSongDetail('/song/detail', ids)
      const music = new Music({
        id,
        name,
        picUrl,
        artists
      })
      await music.getMusicURL('/song/url')
      return music
    },
    //点击跳转播放
    fn_openPlay(music) {
      this.fn_PlayPage(true)
      this.fn_playList(music)
      this.fn_isPlayID(music)
      this.fn_setplaying(true)
    },
    //全部播放
    async fn_playAll() {
      const ids = this.songsList
        .map(item => {
          return item.id
        })
        .join(',')
      const res = await this.fn_getSongDetail('/song/detail', ids)
      const Musics = res.map(item => {
        const {
          id,
          al: { picUrl },
          ar: artists,
          name
        } = item
        const newMusic = {
          id,
          name,
          picUrl,
          artists
        }
        return new Music(newMusic)
      })
      const allMusic = await this.getMusicURL_all('/song/url', Musics)
      const playlistID = this.songsList.map(({ id, name }) => {
        return { id, name }
      })
      this.$store.commit('setAllMusic', [allMusic, playlistID])
      this.fn_PlayPage(true)
    }
  },
  computed: {
    ...mapState(['MusicPlayer'])
  },
  watch: {
    async 'MusicPlayer.isPlayID'(val) {
      //实现全部当前分页播放完成后自动加载下一页，并添加到播放列表
      const idx = this.MusicPlayer.playlistID.findIndex(item => item.id === val)
      if (idx === this.songsList.length - 1) {
        await this.fn_pullingUp(this.scroll)
      }
      if (idx >= this.pageSize - 1) {
        const ids = this.songsList[idx + 1].id
        if (!ids) {
          return
        }
        const music = await this.fn_getMusicUrl(ids)
        this.fn_pushplayList(music)
      }
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
  .total {
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
