<template>
  <div>
    <ul class="songListCmp">
      <song-list-item
        v-for="item in showList"
        :key="item.id"
        :data="item"
        :handler="()=>fn_getPlayUrl(item)" />
    </ul>
    <div
      v-if="!showList.length"
      class="noMusic">
      <p>数据加载中</p>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Music from '../utils/createMusic'
import mixin from '../utils/mixins'
import songListItem from './list-item/playList-item.vue'
export default {
  components: {
    songListItem
  },
  mixins: [mixin],
  props: {
    type: {
      type: Number,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function() {
        return 0
      }
    }
  },
  data() {
    return {
      tuneList: []
    }
  },
  methods: {
    ...mapMutations([
      'setOpenPlayPage',
      'setplayList',
      'setIsPlay',
      'setplaying'
    ]),
    //获取歌曲数据
    async fn_getTuneList() {
      try {
        const {
          data: { code, result }
        } = await this.$http({
          url: '/personalized/newsong'
        })
        if (code === 200) {
          this.tuneList = result.map(
            ({
              song: {
                id,
                name,
                album: { picUrl, artists }
              }
            }) => {
              return {
                id,
                name,
                picUrl,
                artists
              }
            }
          )
        }
      } catch (error) {
        console.log('获取数据失败')
      }
    },
    //获取音乐播放地址
    async fn_getPlayUrl(item) {
      // console.log(item)
      const music = new Music(item)
      const res = await music.getMusicURL('/song/url')
      if (res) {
        this.fn_openPlay(music)
      }
    },
    //点击跳转播放
    fn_openPlay(music) {
      // this.$store.commit('setOpenPlayPage', true)
      // this.$store.commit('setplayList', music)
      // this.$store.commit('setIsPlayID', music.id)

      this.fn_PlayPage(true)
      this.fn_playList(music)
      this.fn_isPlayID(music)
      this.fn_setplaying(true)
    }
  },
  computed: {
    showList() {
      return this.tuneList.filter((item, i) => {
        return this.type === 0 ? true : i < 12
      })
    }
  },
  created() {
    this.fn_getTuneList()
  }
}
</script>


<style lang="less" scoped>
.songListCmp {
  padding: 0 5px;
  justify-content: start;
  flex-wrap: wrap;
  overflow: hidden;
}
.noMusic {
  text-align: center;
  padding: 20px;
  font-size: 14px;
  color: #999;
  background: #f0f0f0;
  display: flex;
  height: 200px;
  border-radius: 4px;
  margin: 0 10px 10px;
  p {
    margin: auto;
  }
}
</style>
