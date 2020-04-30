<template>
  <div>
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div
        v-show="MusicPlayer.openList"
        class="listBg"
      ></div>
    </transition>
    <transition
      enter-active-class="animated fadeInUp"
      leave-active-class="animated fadeOutDown"
    >
      <div
        v-show="MusicPlayer.openList"
        class="playList"
      >
        <div class="title">
          <p
            class="mode"
            @click="fn_changeType"
          >
            <i :class="playTypeCls"></i><span>{{ playTypeTxt }}</span>
          </p>
          <span
            class="removeList"
            @click="fn_removeList"
          >
            <i class="iconfont icon-shanchu-copy"></i>
          </span>
        </div>
        <div
          class="musicList"
          :style="{height:listH+'px'}"
        >
          <div class="listBox">
            <wapper-scroll @init="fn_init">
              <ul class="list">
                <li
                  v-for="item in MusicPlayer.playlistID"
                  :key="item.id"
                  :ref="item.id === MusicPlayer.isPlayID?'nowplay':''"
                >
                  <p
                    class="one-txt-cut "
                    @click="fn_switchPlay(item)"
                  >
                    <i
                      v-show="item.id === MusicPlayer.isPlayID && MusicPlayer.playing"
                      class="iconfont icon-playing"
                    ></i>{{ item.name }}
                  </p>
                  <span @click="fn_delSing(item.id)">
                    <i class="iconfont icon-shanchu"></i>
                  </span>
                </li>
              </ul>
            </wapper-scroll>
          </div>
        </div>
        <div
          class="closeBtn"
          @click="$store.commit('setopenList')"
        >
          关闭
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import mixin from '../../utils/mixins'
export default {
  mixins: [mixin],
  data() {
    return {
      playList: [],
      listH: 0,
      playTypeCls: ['iconfont', 'icon-liebiaoxunhuan'],
      playTypeTxt: '',
      scroll: null
    }
  },
  methods: {
    ...mapMutations([
      'setopenList',
      'delplaylist',
      'removeplaylist',
      'setplayList',
      'setplaying',
      'setplayType'
    ]),
    // 初始化scroll
    fn_init(scroll) {
      this.scroll = scroll
    },
    // 删除指定歌曲
    fn_delSing(id) {
      this.$store.commit('delplaylist', id)
    },
    // 清空列表
    fn_removeList() {
      this.$store.commit('removeplaylist')
    },
    // 切换播放模式
    fn_changeType() {
      this.fn_setPlayType()
      this.fn_playType()
      this.toast({
        title: this.playTypeTxt,
        top: 10
      })
    },

    // 切换歌曲
    fn_switchPlay(item) {
      this.fn_playList(item)
      this.fn_setplaying(true)
    }
  },
  created() {
    this.fn_playType()
  },
  computed: {
    ...mapState(['MusicPlayer']),
    ...mapGetters(['isPlayMusic', 'getplayType'])
  },
  watch: {
    // 当前播放列表
    isPlayMusic() {
      this.playList = Object.keys(this.MusicPlayer.list).map(item => {
        return {
          ...this.MusicPlayer.list[item]
        }
      })
    },
    // 列表高度
    'MusicPlayer.playlistID'(data) {
      this.$nextTick(() => {
        this.listH = Math.min(data.length * 37, 370)
        console.log(this.listH)
      })
    },
    // 当前播放模式
    getplayType() {
      this.fn_playType()
    },
    'MusicPlayer.isPlayID'() {
      this.$nextTick(() => {
        this.scroll.refresh()
        this.scroll.scrollToElement(this.$refs.nowplay[0], 500, 0, 0)
      })
    },
    'MusicPlayer.openList'(type) {
      if (type) {
        this.$nextTick(() => {
          this.scroll.refresh()
          this.scroll.scrollToElement(this.$refs.nowplay[0], 500, 0, 0)
        })
      }
    }
  }
}
</script>

<style lang="less">
@import url('../../assets/theme/default.less');
.listBg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
.playList {
  position: fixed;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  overflow: hidden;
  z-index: 999;
  .title {
    height: 50px;
    padding: 15px 20px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .mode {
      line-height: 16px;
      display: flex;
      align-items: center;
      .iconfont {
        position: relative;
        font-size: 16px !important;
        margin-right: 5px;
        width: 18px;
        text-align: center;
        &.alone::after {
          content: '1';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.5);
        }
      }
    }
    .removeList {
      width: 30px;
      height: 30px;
      display: flex;
      .iconfont {
        margin: auto;
        font-size: 20px !important;
        color: #999;
      }
    }
  }
  .musicList {
    position: relative;
    // height: 80vh;
    .listBox {
      height: 100%;
      width: 100%;
      top: 0;
      position: absolute;
      & .wrapper {
        height: 100%;
        overflow: hidden;
        & > .content {
          min-height: 100%;
          position: relative;
          overflow: hidden;
          .marginBottom {
            margin-bottom: 0 !important;
          }
        }
      }
      .list {
        li {
          padding: 10px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          p {
            flex: 1;
            max-width: calc(100vw - 90px);
            color: #666;
            overflow: hidden;
            .iconfont {
              font-size: 12px !important;
              color: @bgred;
              margin-right: 5px;
            }
          }
          span {
            width: 30px;
            text-align: center;
            color: #999;
          }
        }
      }
    }
  }
  .closeBtn {
    padding: 20px;
    text-align: center;
    color: #666;
  }
}
</style>
