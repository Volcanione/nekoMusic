<template>
  <transition-view>
    <div class="full_header">
      <title-back
        title="专辑"
        :title-style=" {
          backgroundColor: 'rgba(212,68,57,1)',
          color: '#999'
        }"
        :fixed="true"
        :transition="true"
        :transition-h="infoH"
        :transitiont-title="albumDetail.name"></title-back>
    </div>
    <div class="full_main">
      <div class="container">
        <loading :is-loading="songs.length" />
        <wapper-scroll :get-scorll-y="true">
          <div class="datilImg">
            <div class="Mask">
              <div
                ref="info"
                class="info">
                <p class="name txt-cut">{{ albumDetail.name }}</p>
                <p class="count">{{ albumDetail.publishTime | filterResolveTime }}</p>
              </div>
            </div>
            <img
              :src="`${albumDetail.blurPicUrl}?param=400y400`"
              alt="">
          </div>
          <div class="datilList">
            <div class="total">
              <span @click="fn_playAll"><i class="iconfont icon-bofang"></i></span>
              <p>播放全部（共{{ songs.length }}首）</p>
            </div>
            <ul class="list">
              <li
                v-for="(item,index) in songs"
                :key="index"
                @tap="fn_addPlayList(item)">
                <span class="idx">{{ index+1 }}</span>
                <div class="info">
                  <p class="name  one-txt-cut">{{ item.name }}</p>
                  <span class="singer">{{ item.ar[0].name }}</span>
                </div>
              </li>
            </ul>
          </div>
        </wapper-scroll>
      </div>
    </div>
  </transition-view>
</template>
<script>
import { mapMutations } from 'vuex'
import Music from '../../utils/createMusic'
import mixin from '../../utils/mixins'
export default {
  mixins: [mixin],
  data() {
    return {
      albumDetail: {},
      songs: [],
      infoH: 0
    }
  },
  methods: {
    ...mapMutations(['setAllMusic']),
    //获取歌单详细
    async fn_getRecomDetal() {
      try {
        const {
          data: {
            code,
            songs,
            album: { name, blurPicUrl, publishTime }
          }
        } = await this.$http({
          url: '/album',
          params: this.$route.params
        })
        if (code === 200) {
          this.albumDetail = {
            name,
            blurPicUrl,
            publishTime
          }
          this.songs = songs
        }
      } catch (error) {
        console.log('获取数据失败')
      }
    },
    //获取头部距离
    fn_getInfoH() {
      this.infoH = this.$refs.info.offsetTop
    },
    //单击加入播放列表
    async fn_addPlayList(item) {
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

      const music = new Music(newMusic)
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
    //全部播放
    async fn_playAll() {
      const Musics = this.songs.map(item => {
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
      const playlistID = this.songs.map(({ id, name }) => {
        return { id, name }
      })
      this.$store.commit('setAllMusic', [allMusic, playlistID])
      this.fn_PlayPage(true)
    },

    //全部播放其他方案
    fn_playAll_2() {
      const allMusic = {}
      this.songs.forEach(item => {
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
        const music = new Music(newMusic)
        music.getMusicURL('/song/url')
        allMusic[id] = music
      })

      const playlistID = this.songs.map(({ id, name }) => {
        return { id, name }
      })
      this.$store.commit('setAllMusic', [allMusic, playlistID])

      // console.log(allMusic, playlistID)
    }
  },
  created() {
    this.fn_getRecomDetal()
  },
  mounted() {
    this.fn_getInfoH()
    window.addEventListener('resize', this.fn_getInfoH)
  },
  destroyed() {
    window.removeEventListener('resize', this.fn_getInfoH)
  }
}
</script>

<style lang="less" scoped>
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
    .list {
      min-height: calc(100vh - 84px);
      li {
        padding: 10px;
        color: #666;
        overflow: hidden;
        .idx {
          width: 20px;
          height: 40px;
          font-size: 16px;
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
    }
  }
}
</style>
