<template>
  <transition
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut">
    <div
      class="lyricBox"
      @click="$emit('click')">
      <div
        ref="lyricList"
        class="lyric">
        <div class="lyricTxt">
          <template v-for="(item,index) in lyric">
            <p
              :key="item.time"
              :ref="index===lyricIdx?'lyricTxt':''"
              :class="{opt2:lyricIdx>=index-4 && lyricIdx<=index+4,opt1:lyricIdx>=index-2 && lyricIdx<=index+2,current:index===lyricIdx,current:index===lyricIdx }">
              {{ item.lyricText?item.lyricText:'------' }}
            </p>
          </template>
        </div>
      </div>
      <div v-if="lyricObj.version!==''" :class="{version:true,active:isVersion}" @click.stop="version"><span>译</span></div>
    </div>
  </transition>
</template>
<script>
import BScroll from 'better-scroll'
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'
import { NextTimeArray, initTime } from '../../utils/dom'
export default {
  props: {
    init: {
      type: Boolean,
      default() {
        return false
      }
    },
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    currentTime: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      lyric: [],
      lyricIdx: 0,
      lyricObj: {},
      isVersion: false
    }
  },
  computed: {
    ...mapState(['MusicPlayer']),
    ...mapGetters(['isPlayMusic'])
  },
  watch: {
    show(state) {
      if (state && this.init) {
        const idx = NextTimeArray(this.currentTime, this.lyric)
        this.lyricIdx = idx
        this.$nextTick(() => {
        // this.$refs.lyricList.scrollToElement()
          this.scroll.scrollToElement(this.$refs.lyricTxt[0], 0, 0, -150)
        })
      }
    },
    // 获取当前歌词
    async init(status) {
      if (!status) {
        return
      }
      this.isVersion = false
      // 调用歌词处理方法
      this.lyricObj = await this.getLyric()
      this.lyric = this.lyricRegular(this.lyricObj.source)
      this.$nextTick(() => {
        if (this.lyric.length === 1) {
          this.$refs.lyricTxt[0].style.color = 'rgba(255,255,255,.8)'
        }
      })
    },
    // 当前播放的时间
    currentTime: {
      immediate: true,
      handler(val) {
        if (this.lyric.length > 0) {
        // 当前歌词的ClassIdx
          const nowTime = moment.unix(val).format('mm:ss.SSS')
          this.lyricIdx = this.lyric.findIndex(
            item => item.time.split('.')[0] === nowTime
          )
        }
      }
    },
    // 当前歌词高亮的INDEX
    lyricIdx(newIdx, oldIdx) {
      if (newIdx === -1) {
        const idx = NextTimeArray(this.currentTime, this.lyric)
        this.lyricIdx = idx
      }
      // 监听当前歌词高亮的INDEX触发歌词滚动
      this.lyricScroll()
    },
    // 切换歌曲时，歌词重置
    'MusicPlayer.isPlayID'() {
      this.lyric = []
      this.lyricIdx = 0
    }
  },
  mounted() {
    this.initScroll()
    this.scroll.disable()
  },
  methods: {
    // 歌词容器处理
    initScroll() {
      this.scroll = new BScroll(this.$refs.lyricList, {
        click: true,
        tap: true,
        probeType: 3
      })
    },
    // 获取当前歌词
    async getLyric() {
      let lyricStr, velyricStr
      try {
        const {
          data: {
            code,
            lrc: { lyric },
            tlyric: { lyric: veLyric }
          }
        } = await this.$http({
          url: 'lyric',
          params: {
            id: this.isPlayMusic.id
          }
        })
        if (code === 200) {
          lyricStr = lyric || ''
          velyricStr = veLyric || ''
        } else {
          lyricStr = '[00:00.000]暂无歌词'
          velyricStr = '[00:00.000]暂无歌词'
        }
      } catch (error) {
        console.log('获取歌词失败')
        lyricStr = '[00:00.000]暂无歌词'
        velyricStr = '[00:00.000]暂无歌词'
      }
      return {
        source: lyricStr,
        version: velyricStr
      }
    },
    // 歌词转换
    lyricRegular(lyric) {
      let str = JSON.stringify(lyric)
      str = str.substring(1, str.length - 1)
      let lyricArr = str.split('\\' + 'n')
      const PATTERN = /\[\d{2}:\d{2}(.\d{2,3})?\]/g
      // 判断是否有重复歌词
      lyricArr.forEach((item, index) => {
        if (!PATTERN.test(item)) {
          return
        }
        if (item.match(PATTERN).length >= 2) {
          const res = item.match(PATTERN).map(i => {
            return i + item.replace(PATTERN, '')
          })
          lyricArr[index] = ''
          lyricArr.push(...res)
        }
      })
      lyricArr = lyricArr.filter(item => item !== '')
      lyricArr.sort((a, b, index) => {
        const timea = a.split(']')[0].replace('[', '')
        const timeb = b.split(']')[0].replace('[', '')
        return initTime(timea) - initTime(timeb)
      })

      // 处理歌词样式
      const newLyric = lyricArr
        .map((item, index) => {
          return {
            time: PATTERN.test(item)
              ? item
                .match(PATTERN)[0]
                .replace(/\[/, '')
                .replace(/\]/, '')
              : NaN,
            lyricText: PATTERN.test(item) ? item.replace(PATTERN, '') : '---'
          }
        })
        .filter(i => i.lyricText !== '---')

      newLyric.forEach((item, index) => {
        if (index === newLyric.length - 1 && item.lyricText === '') {
          newLyric.pop()
        }
      })
      newLyric.sort((i, v) => {
        if (i.time === v.time) {
          const idx = newLyric.findIndex(m => m.time === i.time)
          v.time = moment.unix(initTime(v.time) + (idx + 1) * 0.5).format('mm:ss.SSS')
        }
      })

      return newLyric
    },
    // 歌词滚动
    lyricScroll() {
      this.$nextTick(() => {
        // this.$refs.lyricList.scrollToElement()
        this.scroll.scrollToElement(this.$refs.lyricTxt[0], 500, 0, -150)
      })
    },
    //歌词翻译
    version() {
      this.isVersion = !this.isVersion
      this.lyric = this.lyricRegular(this.lyricObj[this.isVersion ? 'version' : 'source'])
    }
  }
 

}
</script>

<style lang="less" scoped>
.lyricBox {
  position: absolute;
  width: 80vw;
  height: 390px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .version{
    display: flex;
    width: 22px;
    height: 22px;
    color: #fff;
    border-radius: 4px;
    border: 1px solid #fff;
    opacity: .6;
    span{
      margin: auto;
      font-size: 12px;
    }
    &.active{
      color: #d44439;
      border: 1px solid #d44439;
    }
  }
  .lyric {
    position: relative;
    flex: 1;
    overflow: hidden;
    color: rgba(255, 255, 255, 0.5);
    .lyricTxt {
      padding: 150px 0;
      min-height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    p {
      text-align: center;
      font-size: 14px;
      line-height: 30px;
      opacity: 0;
      transition: 0.5s;
      &.opt2 {
        opacity: .7;
      }
      &.opt1 {
        opacity: 1;
      }
      &.current {
        color: #d44439;
        opacity: 1;
      }
    }
  }
  .closeBtn {
    align-self: center;
    font-size: 12px;
    color: #fff;
  }
}
</style>

