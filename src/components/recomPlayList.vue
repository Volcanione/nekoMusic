<template>
  <div>
    <ul class="songListCmp">
      <play-list-item
        v-for="item in showList"
        :key="item.id"
        :data="item"
        :handler="()=>fn_routerPush(item.id)" />
    </ul>
    <div
      v-if="!showList.length"
      class="noMusic">
      <p>请求数据中</p>
    </div>
  </div>
</template>

<script>
import playListItem from './list-item/playList-item.vue'
export default {
  components: {
    playListItem
  },
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
      songList: []
    }
  },
  computed: {
    showList() {
      return this.songList.filter((item, i) => {
        return this.type === 0 ? true : i < 12
      })
    }
  },
  created() {
    this.fn_getSongList()
  },
  methods: {
    //获取推荐歌单
    async fn_getSongList() {
      try {
        const {
          data: { code, result }
        } = await this.$http({
          url: '/personalized'
        })
        if (code === 200) {
          this.songList = result
        }
      } catch (error) {
        console.log('获取数据失败')
      }
    },

    //歌单详细
    fn_routerPush(id) {
      this.$router.push(`/playListDetail/${id}`)
    }
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
