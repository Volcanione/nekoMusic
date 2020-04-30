<template>
  <transition
    enter-active-class="animated fadeInUp"
    leave-active-class="animated fadeOutDown"
  >
    <div
      v-show="MusicPlayer.isPlayID>-1 && showHomePlay"
      class="playList"
    >
      <div class="control">
        <div
          :class="{CD:true,rotate:true,paused:!MusicPlayer.playing}"
          @click="fn_openPlay"
        >
          <img
            :src="`${isPlay.picUrl}?param=40y40`"
            alt=""
          >
        </div>
        <div class="info">
          <p class="name one-txt-cut">
            {{ isPlay.name }}
          </p>
          <p class="singer one-txt-cut">
            {{ isPlay.singer }}
          </p>
        </div>
        <!-- <div
          class="playBtn"
          @click="fn_playing"
        > -->
        <progress-clre :progress="progress" @click="fn_playing">
          <i :class="['iconfont', MusicPlayer.playing?'icon-zanting':'icon-bofang1']"></i>
        </progress-clre>
          

        <!-- </div> -->
        <div
          class="listBtn"
          @click="fn_openPlayList"
        >
          <i class="iconfont icon-gengduo"></i>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import progressClre from './progressClre.vue'
import mixin from '../../utils/mixins'
export default {
  components: {
    progressClre
  },
  mixins: [mixin],
  data() {
    return {
      isPlay: {}
    }
  },
  computed: {
    ...mapState(['MusicPlayer', 'showHomePlay']),
    ...mapGetters(['isPlayMusic', 'progress'])
  },
  watch: {
    isPlayMusic(data) {
      data && (this.isPlay = data)
    }
  },
  methods: {
    ...mapActions(['setopenList']),
    // 播放暂停
    fn_playing() {
      this.fn_setplaying()
    },
    // 打开播放器
    fn_openPlay() {
      this.fn_PlayPage(true)
    },
    // 打开播放列表
    fn_openPlayList() {
      this.$store.commit('setopenList')
    }
  }
}
</script>

<style lang="less" scoped>
.playList {
  background: rgba(255, 255, 255, 0.9);
  height: 60px;
  position: fixed;
  z-index: 500;
  width: 100%;
  bottom: 0;
  .control {
    height: 100%;
    position: relative;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .CD {
      width: 40px;
      height: 40px;
      min-width: 40px;
      border-radius: 50%;
      overflow: hidden;
      background: #ddd;
      &.rotate {
        animation: rotate 25s infinite linear;
      }
      &.paused {
        animation-play-state: paused;
      }
    }
    .info {
      flex: 1;
      color: #666;
      max-width: calc(100vw - 165px);
      padding: 0 10px;
      .name {
        width: 100%;
        font-size: 14px;
        overflow: hidden;
      }
      .singer {
        font-size: 12px;
        overflow: hidden;
      }
    }
    .playBtn {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      border: 2px solid #666;
      display: flex;
    }
    .listBtn {
      width: 40px;
      height: 40px;
      display: flex;
      margin-left: 10px;
      .iconfont {
        margin: auto;
        font-size: 30px !important;
        color: #666;
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
