<template>
  <transition
    enter-active-class="animated fadeInUp"
    leave-active-class="animated fadeOutDown">
    <div
      v-show="MusicPlayer.openPlayPage"
      class="palyContainer">
      <div class="content">
        <div class="header">
          <span
            class="back"
            @click="fn_closePlayPage">
            <i class="iconfont icon-shouqi"></i>
          </span>
          <span class="hide">
          </span>
          <div class="name">
            <p class="one-txt-cut">{{ isPlay.name }}</p>
            <p class="one-txt-cut">{{ isPlay.singer }}</p>
          </div>
        </div>
        <div class="main">
          <div
            v-show="!openLyric"
            :class="{musicCD:true,rotate:true,paused:!MusicPlayer.playing}"
            @click="openLyric=!openLyric">
            <img
              v-lazy="`${isPlay.picUrl}?param=400y400`"
              alt="">
          </div>
          <keep-alive>
            <lyric
              v-show="openLyric"
              :show="openLyric && MusicPlayer.openPlayPage"
              :init="audioInit"
              :current-time="currentTime"
              @click="openLyric=!openLyric" />
          </keep-alive>
        </div>
        <div class="control">
          <div class="audio">
            <audio
              id="audio"
              ref="audio"
              controls
              :src="isPlay.playUrl"
              @stalled="fn_error"
              @error="fn_error"
              @canplay="fn_getAudioDuration"
              @timeupdate="fn_getCurrentTime"
              @loadstart="fn_isMusicPlay"></audio>
          </div>
          <div class="progessBar">
            <span class="newDate">{{ currentTime | filterMusicTime }}</span>
            <div class="dateBar">
              <progress-bar
                v-model="per"
                :drag="audioInit"
                @change="fn_setMusicPre" />
            </div>
            <span class="totlaDate">{{ duration | filterMusicTime }}</span>
          </div>
          <div class="btns">
            <span
              class=""
              @click="fn_changeType">
              <i :class="playTypeCls"></i>
            </span>
            <span
              class=""
              @click="fn_switchPlay('prve')">
              <i class="iconfont  icon-shangyishou"></i>
            </span>
            <span
              class="playBtn"
              @click="fn_playing">
              <i :class="['iconfont', MusicPlayer.playing?'icon-zanting':'icon-bofang1']"></i>
            </span>
            <span
              class=""
              @click="fn_switchPlay('next')">
              <i class="iconfont icon-shangyishou-copy"></i>
            </span>
            <span class="" @click="setLikeMusic">
              <i v-if="!likeState" class="iconfont  icon-xihuan1"></i>
              <i v-if="likeState" class="iconfont  icon-xihuan"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="playBg">
        <img
          :src="`${isPlay.picUrl}?param=400y400`"
          alt="">
        <div class="filter"></div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import progressBar from './progress.vue'
import lyric from './lyric.vue'
import mixin from '../../utils/mixins'
export default {
  components: {
    progressBar,
    lyric
  },
  mixins: [mixin],
  data() {
    return {
      list: [],
      per: 0,
      playTypeCls: ['iconfont', 'icon-liebiaoxunhuan'],
      isPlay: {},
      duration: 0,
      currentTime: 0,
      ended: false,
      playTypeTxt: '',
      audioInit: false,
      openLyric: false,
      likeState: false,
      timeID: -1
    }
  },
  computed: {
    ...mapState(['MusicPlayer']),
    ...mapGetters(['getplayType', 'isPlayMusic'])
  },
  watch: {
    'isPlay.playUrl'(val) {
    },
    //CD旋转
    'MusicPlayer.playing'(val) {
      if (val) {
        this.$nextTick(() => {
          const audio = this.$refs.audio
          const playPromise = audio.play()
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                audio.play()
              })
              .catch(() => {})
          }
        })
      } else {
        this.$nextTick(() => {
          this.$refs.audio.pause()
        })
      }
    },
    //当前播放音乐
    isPlayMusic(data) {
      if (data) {
        this.isPlay = data
        clearTimeout(this.timeID)
        if (data.playUrl === null) {
          this.audioInit = false
        }
      }
    },
    //当前播放模式
    getplayType() {
      this.fn_playType()
    },

    //切换音乐
    async 'MusicPlayer.isPlayID'(val) {
      if (this.isPlay.playUrl === null && val !== -1) {
        this.fn_isMusicPlay()
      }
      this.getPlayMusicLike(val, this.MusicPlayer.likeMusicList)
      this.duration = 0
      this.per = 0
      this.audioInit = false
      const music = this.MusicPlayer.list[val]
      this.$store.commit('sethistoryList', music)
      if (val === -1) {
        this.fn_setplaying(false)
        this.$nextTick(() => {
          this.$refs.audio.load()
        })
      } else {
        this.fn_setAudioPlay(this.MusicPlayer.playing)
      }
    },
    //切换音乐（播放歌单）
    'MusicPlayer.list': {
      deep: true,
      handler(val) {
        if (Object.keys(val).length === 0) {
          return
        }
        //  this.fn_setplaying(true)
      }
    },
    //是否播放结束
    ended(state) {
      if (state) {
        this.fn_setNextMusic()
      }
    },
    //当前播放时间
    duration(val) {
      if (val > 0) {
        this.audioInit = true
      }
    }
  },
  mounted() {
    //初始化播放模式
    this.fn_playType()
    //获取喜欢歌曲列表
    this.getLikeList()
  },
  methods: {
    ...mapMutations([
      'setOpenPlayPage',
      'setplayType',
      'delplaylist',
      'setplaying',
      'setplayList',
      'sethistoryList',
      'setIsPlayID',
      'setLikeList',
      'setduration',
      'setcurrentTime'
    ]),
    //收起播放器
    fn_closePlayPage() {
      this.fn_PlayPage(false)
    },
    //切换播放模式
    fn_changeType() {
      this.fn_setPlayType()
      this.fn_playType()
    },
    //播放暂停
    fn_playing() {
      this.fn_setplaying()
      //console.log(this.MusicPlayer.playing)
      if (!this.MusicPlayer.playing) {
        clearTimeout(this.timeID)
      } else {
        this.fn_isMusicPlay()
      }
    },
    //音乐长度
    fn_getAudioDuration() {
      this.$nextTick(() => {
        this.duration = this.$refs.audio.duration || 0
        // this.audioInit = true
        this.$store.commit('setduration', this.duration)
      })
    },
    //当前音乐是否能被播放
    fn_isMusicPlay() {
      if (!this.MusicPlayer.playing) {
        return
      }
      this.$nextTick(() => {
        this.fn_checkMusic(this.MusicPlayer.isPlayID).then(res => {
          console.log(res)
        }).catch(err => {
          if (err.response.status === 502) {
            return this.toast({
              title: '网络错误',
              top: 70,
              cancell: () => {
                this.fn_setplaying(false)
              }
            })
          }
          console.log(err.response.data)
          this.toast({
            title: err.response.data.message,
            top: 70,
            cancell: () => {
              this.$store.commit('delplaylist', this.MusicPlayer.isPlayID)
            }
          })
        })
      })
    },
    //当前播放时间
    fn_getCurrentTime() {
      this.$nextTick(() => {
        this.currentTime = this.$refs.audio.currentTime || 0
        this.per = this.currentTime / this.duration
        this.ended = this.$refs.audio.ended
        this.$store.commit('setcurrentTime', this.currentTime)
      })
    },
    //调整播放时间
    fn_setMusicPre() {
      this.$nextTick(() => {
        try {
          this.$refs.audio.currentTime = this.per * this.duration
        } catch (error) {
          this.toast({
            title: '操作太快了',
            top: 70
          })
        }
      })
    },
    //根据播放模式切换歌曲
    fn_setNextMusic() {
      const mode = this.getplayType
      const arr = this.MusicPlayer.playlistID
      const idx = arr.findIndex(i => {
        return i.id === this.MusicPlayer.isPlayID
      })
      let music = {}
      let newArr = []
      switch (mode) {
        case 'order':
          music = arr[idx + 1] ? arr[idx + 1] : arr[0]
          this.fn_playList(music)
          this.fn_setAudioPlay(this.MusicPlayer.playing)
          break
        case 'random':
          if (arr.length === 1) {
            newArr = arr
          } else {
            newArr = arr.filter(i => {
              return i.id !== this.MusicPlayer.isPlayID
            })
          }
          music = newArr[parseInt(Math.random() * newArr.length)]
          this.fn_playList(music)
          this.fn_setAudioPlay(this.MusicPlayer.playing)
          break
        default:
          this.fn_setAudioPlay(this.MusicPlayer.playing)
          break
      }
    },
    //上一曲，下一曲
    fn_switchPlay(type) {
      this.audioInit = true
      let idx
      const { historyList } = this.MusicPlayer
      clearTimeout(this.timeID)
      if (!this.MusicPlayer.playlistID.length) {
        return this.toast({
          title: '还没加入音乐呢',
          top: 70
        })
      }
      switch (type) {
        case 'next':
          this.fn_setNextMusic()
          this.toast({
            title: '下一首',
            top: 70
          })
          break
        case 'prve':
          if (!historyList.length) {
            return this.toast({
              title: '你还没听过音乐呢！',
              top: 70
            })
          }
          this.toast({
            title: '上一首',
            top: 70
          })
          idx = historyList.findIndex(i => i.id === this.MusicPlayer.isPlayID)
          if (idx === 0) {
            return this.toast({
              title: '到头了',
              top: 70
            })
          }
          this.fn_playList(historyList[idx - 1])
          this.fn_isPlayID(historyList[idx - 1])
          break
        default:
          break
      }
    },
    //播放错误处理
    async  fn_error() {
      try {
        console.log('播放错误')
        this.toast({
          title: '获取资源中',
          top: 10
        })
        const res = await this.$http({
          url: '/song/url',
          params: {
            id: this.MusicPlayer.isPlayID
          }
        })
        if (res.data.code === 200) {
          const { data } = res.data
          this.$set(this.isPlay, 'playUrl', data[0].url)
          this.fn_setAudioPlay(this.MusicPlayer.playing)
        } else {
          this.toast({
            title: '获取资源失败',
            top: 10,
            cancell: () => {
              this.fn_setNextMusic()
            }
          })
        }
      } catch (error) {
        if (error.response.status === 502) {
          return this.toast({
            title: '网络错误',
            top: 70,
            cancell: () => {
              this.fn_setplaying(false)
            }
          })
        }
        this.toast({
          title: '获取资源失败',
          top: 10,
          cancell: () => {
            this.fn_setNextMusic()
          }
        })
      }
    },
    //喜爱歌曲列表
    async  getLikeList() {
      const likeList = JSON.parse(localStorage.getItem('likeList')) 
      if (!likeList) {
        const res = await this.$http({
          url: '/likelist',
          params: {
            uid: localStorage.getItem('userId'),
            timestamp: +new Date()
          }
        })
        if (res.data.code !== 200) {
          return
        }
        const { ids } = res.data
        this.$store.commit('setLikeList', ids)

      }
    },
    //获取当前歌曲是否喜爱
    getPlayMusicLike(id, list) {
      this.likeState = list.includes(id)
    },
    //设置歌曲喜爱
    async setLikeMusic() {
      const res = await this.$http({
        url: '/like',
        params: {
          id: this.MusicPlayer.isPlayID,
          like: !this.likeState,
          timestamp: +new Date()
        }
      })
      if (res.data.code !== 200) {
        return
      }
      this.likeState = !this.likeState
      this.toast({
        title: this.likeState ? '已加入喜欢' : '取消喜欢',
        top: 70
      })
      this.getLikeList()
      
    }
  }

}
</script>

<style lang="less"   scoped>
.palyContainer {
  position: fixed;
  z-index: 999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #fff;
  .playBg {
    position: relative;
    z-index: -1;
    width: 100%;
    height: 100%;
    opacity: 0.8;
    -webkit-filter: blur(30px);
    filter: blur(30px);
    .filter {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #000;
      opacity: 0.6;
    }
    img {
      position: absolute;
      left: 50%;
      width: auto;
      height: 100%;
      transform: translateX(-50%);
    }
  }
  .content {
    position: absolute;
    z-index: 2;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .header {
      height: 60px;
      overflow: hidden;
      .back,
      .hide {
        float: left;
        width: 50px;
        height: 50px;
        display: flex;
        .iconfont {
          font-size: 25px;
          color: rgba(255, 255, 255, 0.8);
          margin: auto;
        }
      }
      .hide {
        float: right;
      }
      .name {
        flex: 1;
        height: 60px;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        overflow: hidden;
        p:first-child {
          font-size: 16px;
          max-width: 100%;
          margin-top: 10px;
        }
        p:last-child {
          font-size: 12px;
        }
      }
    }
    .main {
      flex: 1;
      position: relative;
      display: flex;
      overflow: hidden;
      .musicCD {
        margin: auto;
        max-width: 500px;
        max-height: 500px;
        width: 80vw;
        height: 80vw;
        border-radius: 50%;
        border: 15px solid hsla(0, 0%, 100%, 0.1);
        overflow: hidden;
        &.rotate {
          animation: rotate 25s infinite linear;
        }
        &.paused {
          animation-play-state: paused;
        }
      }
    }
    .control {
      height: 110px;
      .progessBar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .newDate,
        .totlaDate {
          width: 18vw;
          text-align: right;
          font-size: 12px;
          color: #fff;
          padding: 0 10px;
        }
        .totlaDate {
          text-align: left;
        }
        .dateBar {
          flex: 1;
        }
      }
      .btns {
        padding: 10px 10vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          width: 30px;
          height: 30px;
          display: flex;
          color: rgba(255, 255, 255, 0.8);
          .icon-xihuan{
            color: #e26f69;
          }
          .iconfont {
            margin: auto;
            font-size: 30px !important;
            position: relative;
            &.alone::after {
              content: '1';
              position: absolute;
              font-size: 10px;
              line-height: 10px;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
        .playBtn {
          width: 40px;
          height: 40px;
          border: 2px solid rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          .iconfont {
            font-size: 22px !important;
          }
        }
      }
      .audio {
        display: none;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
