<template>
  <transition-view>
    <div class="full_header">
      <title-back
        title="歌手详细"
        :title-style=" {
          backgroundColor:'rgba(212,68,57,1)',
          color: '#999'
        }"
        :fixed="true"
        :transition="true"
        :transition-h="infoH"
        :transitiont-title="artist.name"></title-back>
      <suspension-bar
        v-model="isActive"
        :supsen-top="supsenTop" />
    </div>
    <div class="full_main">
      <div class="container">
        <loading
          class="loading"
          :is-loading="initLoading" />
        <loading
          v-show="updataLoading"
          class="updateloading" />
        <stay-layer
          :show.sync="moreShow"
          title="详细信息">
          <div class="artistPop">
            <div class="title">基本资料</div>
            <div class="content">{{ artistDecs.briefDesc }}</div>
            <template v-for="(item,index) in artistDecs.introduction">
              <div :key="index+'1'" class="title">{{ item.ti }}</div>
              <div :key="index+'2'" class="content">{{ item.txt }}</div>
            </template>

          </div>
        </stay-layer>
        <wapper-scroll
          :get-scorll-y="true"
          :pull-up-load-and-refresh="true"
          @pullingUp="fn_pullingUp"
          @pullingDown="fn_pullingDown"
          @init="fn_init">
          <div class="datilImg">
            <div class="Mask">
              <div
                ref="info"
                class="info">
                <p class="name">
                  {{ artist.name }}
                </p>
                <p class="count txt-cut">
                  {{ artist.briefDesc }}
                </p>
              </div>
            </div>
            <img
              :src="`${artist.picUrl}?param=400y400`"
              alt="">
          </div>
          <div
            ref="datilList"
            class="datilList">
            <div
              ref="totalBar"
              class="total">
              <span
                v-for="item in tabList"
                :key="item.id"
                :class="{active:item.id===isActive}"
                @click="change(item)">{{ item.title }}</span>
            </div>
            <div class="list">
              <template v-if="isActive===0">
                <div class="totalAll">
                  <span @click="fn_playAll"><i class="iconfont icon-bofang"></i></span>
                  <p>播放全部（共{{ hotSongs.length }}首）</p>
                </div>
                <songs-item
                  v-for="(item,index) in hotSongs"
                  :key="item.id"
                  :index="index"
                  :data="item"
                  :handler="fn_songDetail" />
              </template>
              <template v-if="isActive===1">
                <albums-item
                  v-for="item in hotAlbums"
                  :key="item.id"
                  :data="item"
                  :handler="fn_getAlbumDetail" />
              </template>
              <template v-if="isActive===2">
                <div class="artistDeatil">
                  <template v-if="artistDecs.introduction.length">
                    <div class="title">
                      <span>歌手资料</span>
                      <span
                        class="more"
                        @click="moreShow=true">更多</span>
                    </div>
                    <div class="decsContent">{{ artistDecs.briefDesc }}</div>
                  </template>
                  <div class="title">
                    <span>相似歌手</span>
                  </div>
                  <div class="likeArtustContent">
                    <like-list :data-list="likeList" @detailed="fn_gotoLike" />
                  </div>
                </div>
              </template>
            </div>
          </div>
        </wapper-scroll>
      </div>
    </div>
  </transition-view>
</template>
<script>
import suspensionBar from '@/components/suspensionBar'
import songsItem from '@/components/list-item/songs-item.vue'
import albumsItem from '@/components/list-item/albums-item.vue'
import stayLayer from '@/components/stayLayer/stayLayer.vue'
import likeList from './components/likeList.vue'
import Music from '@/utils/createMusic'
import mixin from '@/utils/mixins'
export default {
  components: {
    suspensionBar,
    songsItem,
    albumsItem,
    stayLayer,
    likeList
  },
  mixins: [mixin],
  data() {
    return {
      artist: {},
      hotSongs: [],
      hotAlbums: [],
      initLoading: true,
      infoH: 0,
      supsenTop: 0,
      updataLoading: false,
      scroll: {},
      tabList: [
        {
          id: 0,
          url: '',
          title: '单曲'
        },
        {
          id: 1,
          url: 'album',
          title: '专辑'
        },
        {
          id: 2,
          url: 'desc',
          title: '详情'
        }
      ],
      isActive: 0,
      page: 1,
      pageSize: 20,
      albumSize: 0,
      artistDecs: {
        introduction: [],
        briefDesc: ''
      },
      moreShow: false,
      likeList: []
    }
  },
  watch: {
    isActive() {
      this.page = 1
      if (this.supsenTop <= 44) {
        this.scroll.scrollToElement(this.$refs.datilList, 0, 0, -44)
      }
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.fn_getInfoH()
    this.fn_getSuspenTop()
    window.addEventListener('resize', this.fn_getInfoH)
    this.scroll.on('scroll', () => {
      this.fn_getSuspenTop()
    })
  },
  destroyed() {
    window.removeEventListener('resize', this.fn_getInfoH)
  },
  methods: {
    //初始化数据
    async init() {
      this.hotSongs = await this.fn_getArtistDetail()
      this.hotAlbums = await this.fn_getArtistAlbums()
      await this.fn_getArtistDecs()
      await this.fn_getLikeArtist()
      this.initLoading = false
    },
    // 请求单曲数据
    async fn_getArtistDetail() {
      const {
        data: { code, artist, hotSongs }
      } = await this.$http({
        url: '/artists',
        params: { ...this.$route.params }
      })
      if (code !== 200) {
        return []
      }
      this.artist = artist
      const songsArr = hotSongs.map(({ name, id, alia, ar, al }) => {
        return {
          name,
          id,
          artists: [
            {
              name: ar[0].name
            }
          ],
          al
        }
      })
      return songsArr
    },
    // 请求专辑数据
    async fn_getArtistAlbums() {
      const {
        data: { code, hotAlbums, artist }
      } = await this.$http({
        url: '/artist/album',
        params: {
          ...this.$route.params,
          offset: (this.page - 1) * this.pageSize,
          limit: this.pageSize
        }
      })
      if (code !== 200) {
        return []
      }
      this.albumSize = artist.albumSize

      return hotAlbums
    },

    // 获取头部距离
    fn_getInfoH() {
      this.infoH = this.$refs.info.offsetTop - 44
    },
    fn_init(scroll) {
      this.scroll = scroll
    },
    fn_getSuspenTop() {
      if (this.$refs.totalBar) {
        this.supsenTop = this.$refs.totalBar.getBoundingClientRect().top
      }
    },
    // tab栏切换
    change(item) {
      this.isActive = item.id
    },
    //上拉加载
    async fn_pullingUp(scroll) {
      if (this.isActive === 1) {
        if (this.albumSize > this.hotAlbums.length) {
          this.updataLoading = true
          this.page++
          const arr = await this.fn_getArtistAlbums()
          this.hotAlbums.push(...arr)
          scroll.refresh()
          this.updataLoading = false
        } else {
          this.toast({
            title: '到底了',
            top: 94
          })
        }
      }
      scroll.finishPullUp()
    },
    //下拉刷新
    fn_pullingDown(scroll) {
      console.log(scroll)
    },
    // 全部播放
    async fn_playAll() {
      const Musics = this.hotSongs.map(item => {
        const {
          id,
          al: { picUrl },
          artists,
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
      const playlistID = this.hotSongs.map(({ id, name }) => {
        return { id, name }
      })
      this.$store.commit('setAllMusic', [allMusic, playlistID])
      this.fn_setplaying(true)
      this.fn_PlayPage(true)
    },
    //单曲播放
    async fn_songDetail(ids) {
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
      this.fn_openPlay(music)
    },
    //点击跳转播放
    fn_openPlay(music) {
      this.fn_PlayPage(true)
      this.fn_playList(music)
      this.fn_isPlayID(music)
      this.fn_setplaying(true)
    },
    //专辑详情
    fn_getAlbumDetail(id) {
      this.$router.push(`/albumDetail/${id}`)
    },
    //歌手详情
    async fn_getArtistDecs() {
      const res = await this.$http({
        url: '/artist/desc',
        params: {
          ...this.$route.params
        }
      })
      if (res.data.code !== 200) {
        return
      }
      const { introduction, briefDesc } = res.data
      this.artistDecs = {
        introduction,
        briefDesc
      }
    },
    //相似歌手
    async fn_getLikeArtist() {
      const res = await this.$http({
        url: '/simi/artist',
        params: {
          ...this.$route.params
        }
      })
      if (res.data.code !== 200) {
        return 
      }
      const { artists } = res.data
      this.likeList = artists
    },
    //相似详情
    fn_gotoLike(item) {
      console.log(this.$route)
      const { name } = this.$route
      if (name === 'artistDetail') {
        this.$router.replace(`/artists/${item.id}`)
      } else {
        this.$router.replace(`/artist/${item.id}`)
      }
      // this.$router.replace(`/artist/${item.id}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../assets/theme/default.less');
.container {
  .datilImg {
    position: absolute;
    width: 100%;
    top: 0;
    height: calc(100vw);
    .Mask {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      .info {
        padding: 0 10px;
        width: 100%;
        position: absolute;
        bottom: 110px;
        color: #fff;
        p.name {
          font-size: 16px;
          font-weight: 700;
          line-height: 18px;
          max-height: 36px;
        }
        p.count {
          margin-top: 5px;
          font-size: 12px;
          .iconfont {
            font-size: 12px !important;
          }
        }
      }
    }
  }
  .datilList {
    position: relative;
    margin-top: calc(100vw - 100px);
    z-index: 1;
    background: #fafafa;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    overflow: hidden;
    .loading {
      top: 88px;
    }
    .total {
      height: 40px;
      overflow: hidden;
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: #666;
      border-bottom: 1px solid #f0f0f0;
      span {
        font-size: 14px;
        color: #999;
        &.active {
          color: @bgred;
        }
      }
    }
    .list {
      min-height: calc(100vh - 84px);
      li {
        padding: 10px;
        color: #666;
        overflow: hidden;
        .idx {
          width: 20px;
          height: 40px;
          font-size: 12px;
          text-align: center;
          line-height: 40px;
          float: left;
        }
        .info {
          height: 40px;
          overflow: hidden;
          padding-left: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          .name {
            font-size: 16px;
            overflow: hidden;
          }
          .singer {
            font-size: 12px;
          }
        }
      }
      .totalAll {
        height: 40px;
        overflow: hidden;
        color: #333333;
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
  }
  .artistDeatil {
    .title {
      padding: 0 10px;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 18px;
        color: #333;
        font-weight: 700;
      }
      .more {
        font-size: 14px;
        font-weight: 400;
        color: #999;
      }
    }
    .decsContent {
      padding: 0 10px;
      height: 100px;
      line-height: 20px;
      text-align: justify;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      margin-bottom: 10px;
    }
    .likeArtustContent{
      margin: 10px 0;
    }
  }
  .updateloading {
    top: 84px;
    opacity: 0.2;
  }
  .artistPop {
    padding: 0 10px;
    .title {
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      color: #333;
      font-weight: 700;
    }
    .content{
      line-height: 20px;
      text-align: justify;
      color: #666;
      margin-bottom: 10px;
    }
  }
}
</style>
