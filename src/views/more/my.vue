<template>
  <transition-view>
    <div class="full_header">
      <title-back
        title=""
        :title-style="{
          backgroundColor: 'rgba(212,68,57,0)',
          color: '#fff'
        }"
        :fixed="true"
        :transition-h="topImgH - 88"
        :transitiont-title="userInfo.nickname">
        <i
          slot="rightBtn"
          class="iconfont icon-tuichu"
          @click="logout"></i>
      </title-back>
    </div>
    <div class="full_main">
      <div class="container">
        <div class="bodyBg"></div>
        <div
          ref="topImg"
          class="datilImg"
          :style="
            `background-image:url(${userInfo.backgroundUrl}?param=600y600)`
          ">
          <div
            ref="infoBox"
            :style="`opacity:${optInfo}`"
            class="infoBox">
            <div class="avatar">
              <img
                :src="`${userInfo.avatarUrl}?param=100y100`"
                alt="" />
            </div>
            <p class="nickname">{{ userInfo.nickname }}</p>
          </div>
          <div
            class="mask"
            :style="`opacity:${opt}`"></div>
          <div class="tabTitle">
            <tab-bar
              v-model="tabVal"
              :data-list="tabList"
              font-color="#fff"
              active-color="#ea6767" />
          </div>
        </div>
        <wapper-scroll
          :get-scorll-y="true"
          @scroll="fn_scrollY"
          @init="fn_init">
          <div class="myBox">
            <loading
              class="loading"
              :is-loading="myLoading" />
            <div class="listBox">
              <template v-if="tabVal===1">
                <plays-item
                  v-if="musicArr.favorite.id "
                  :data="musicArr.favorite"
                  :handler="fn_playlistsDetail" />
                <p
                  v-if="musicArr.create.length"
                  class="title">
                  创建的歌单<span><i>{{ musicArr.create.length }}</i></span>
                </p>
                <plays-item
                  v-for="item in musicArr.create"
                  :key="item.id"
                  :data="item"
                  :handler="fn_playlistsDetail" />
                <p
                  v-if="musicArr.collect.length"
                  class="title">
                  收藏的歌单<span><i>{{ musicArr.collect.length }}</i></span>
                </p>
                <plays-item
                  v-for="item in musicArr.collect"
                  :key="item.id"
                  :data="item"
                  :handler="fn_playlistsDetail" />
              </template>

              <template v-if="tabVal===2">
                <div class="total">
                  <span @click="fn_playAll"><i class="iconfont icon-bofang"></i></span>
                  <p>播放全部（共{{ weekData.length }}首）</p>
                </div>
                <songs-item
                  v-for="(item,index) in weekData"
                  :key="item.id"
                  :index="index"
                  :data="item"
                  :handler="fn_songDetail" />
              </template>
            </div>
          </div>
        </wapper-scroll>
      </div>
    </div>
  </transition-view>
</template>
<script>
import tabBar from '@/components/tabbar/'
import Music from '@/utils/createMusic'
import playsItem from '@/components/list-item/plays-item.vue'
import songsItem from '@/components/list-item/songs-item.vue'
import mixin from '@/utils/mixins'
export default {
  components: {
    tabBar,
    playsItem,
    songsItem
  },
  mixins: [mixin],
  data() {
    return {
      myLoading: true,
      scroll: {},
      userInfo: {
        backgroundUrl: '',
        avatarUrl: '',
        nickname: '',
        userId: ''
      },
      topImgH: 0,
      topImg: null,
      infoH: 0,
      scrollY: 0,
      tabVal: 1,
      tabList: [
        {
          label: '主页',
          value: 1
        },
        {
          label: '历史',
          value: 2
        }
      ],
      musicArr: {
        create: [],
        favorite: {},
        collect: []
      },
      weekData: []
    }
  },
  computed: {
    opt() {
      return Math.min(-this.scrollY / this.topImgH, 0.5)
    },
    optInfo() {
      let opt = (this.scrollY + this.topImgH - 88) / this.infoH
      opt = Math.max(opt, 0)
      opt = Math.min(opt, 2)
      return Math.max(opt, 0)
    }
  },
  watch: {
    tabVal(val) {
      if (val === 1) {
        // this.getUserMusic()
      }
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.topImg = this.$refs['topImg'].style
    this.infoH = this.$refs['infoBox'].clientHeight / 2
    this.topImgH = this.$refs['topImg'].clientHeight
  },
  methods: {
    //初始化数据
    async init() {
      try {
        await this.$http({
          url: '/login/refresh',
          params: { timestamp: +new Date() }
        })
      } catch (error) {
        this.$router.push('/login')
      }
      const userInfo = JSON.parse(localStorage.getItem('NekoInfo')) || {}
      // console.log(userInfo)
      const {
        profile: { backgroundUrl, avatarUrl, nickname, userId }
      } = userInfo
      this.userInfo = {
        backgroundUrl,
        avatarUrl,
        nickname,
        userId
      }
      await this.getUserMusic()
      await this.getUserRecord()
      this.toast({
        title: '已获取最新动态'
      })
    },
    fn_scrollY(scroll, y) {
      this.scrollY = y
      this.topImg.height = Math.max(88, this.topImgH + y) + 'px'
    },
    //登出
    async logout() {
      const res = await this.$http({
        url: '/logout',
        params: { timestamp: +new Date() }
      })
      if (res.data.code !== 200) {
        return
      }
      this.toast({
        title: '已退出当前账号',
        cancell: async() => {
          this.$router.push('/')
        }
      })
      
    },
    //获取用户歌曲歌单
    async getUserMusic() {
      const res = await this.$http({
        url: '/user/playlist',
        params: {
          uid: this.userInfo.userId,
          timestamp: +new Date()
        }
      })
      if (res.data.code !== 200) {
        return
      }

      const {
        data: { playlist }
      } = res
      // console.log(playlist)
      this.musicArr = {
        create: playlist.filter((i, v) => !i.subscribed && v > 0),
        favorite: playlist[0],
        collect: playlist.filter(i => i.subscribed)
      }
    },
    //点击歌单详细
    fn_playlistsDetail(id) {
      this.$router.push(`/playListDetail/${id}`)
    },
    //获取用户历史歌曲
    async getUserRecord() {
      const res = await this.$http({
        url: '/user/record',
        params: {
          uid: this.userInfo.userId,
          type: 1,
          timestamp: +new Date()
        }
      })
      this.myLoading = false
      // console.log(res)
      if (res.data.code !== 200) {
        return
      }
      const {
        data: { weekData }
      } = res
      //console.log(res)
      this.weekData = weekData.map(({ song: { name, id, alia, ar, al }}) => {
        return {
          name,
          id,
          artists: [
            {
              name: ar[0].name
            }
          ], al
        }
      })
      // console.log(this.weekData)
    },
    //点击单曲
    async fn_songDetail(ids) {
      //console.log(ids)
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
    // 全部播放
    async fn_playAll() {
      const Musics = this.weekData.map(item => {
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
      const playlistID = this.weekData.map(({ id, name }) => {
        return { id, name }
      })
      this.$store.commit('setAllMusic', [allMusic, playlistID])
      this.fn_setplaying(true)
      this.fn_PlayPage(true)
    },

    //点击跳转播放
    fn_openPlay(music) {
      this.fn_PlayPage(true)
      this.fn_playList(music)
      this.fn_isPlayID(music)
      this.fn_setplaying(true)
    },
    //初始化scroll
    fn_init(scroll) {
      this.scroll = scroll
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../../assets/theme/default.less');
.container {
  .datilImg {
    position: fixed;
    width: 100%;
    top: 0;
    height: calc(80vw);
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: 1;
    .mask {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background: #000000;
      opacity: 0;
    }
    .infoBox {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      width: 100%;
      position: absolute;
      bottom: 44px;
      z-index: 99;
      padding: 20px;
      .avatar {
        width: 70px;
        height: 70px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        overflow: hidden;
        border: 4px solid rgba(255, 255, 255, 0.2);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .nickname {
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        margin-top: 20px;
      }
    }
    .tabTitle {
      position: absolute;
      z-index: 9;
      width: 100%;
      height: 44px;
      bottom: 0;
      background: #9d4136;
      border-top-left-radius: 22px;
      border-top-right-radius: 22px;
      box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.1);
    }
  }
  .myBox {
    padding-top: calc(80vw);
    min-height: calc(100vh + 80vw - 88px);
    position: relative;
    /deep/ .loading {
      position: absolute;
      bottom: 0;
      top: calc(80vw);
      background: #9d4136;
      .rotate {
        margin-top: 60px;
        opacity: 0.2;
      }
    }
    .listBox {
      /deep/ li {
        .name {
          color: #ffffff;
        }
        .total span {
          color: rgba(255, 255, 255, 0.5);
        }
        .idx {
          color: #ffffff;
        }
        .singer {
          color: #ffffff;
        }
      }
      .title {
        font-size: 14px;
        color: #fff;
        font-weight: 600;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          background: rgba(255, 255, 255, 0.8);
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          i {
            font-size: 12px;
            font-weight: 400;
            transform: scale(0.8);
            color: #e07f7f;
            font-style: normal;
          }
        }
      }
      .total {
        height: 40px;
        overflow: hidden;
        color: #ffffff;
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
  .bodyBg {
    position: fixed;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, #d44439 0%, #e07f7f 100%);
  }
}
</style>
