<template>
  <transition
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <div class="container">
      <loading class="loading" :is-loading="artistList.length" />
      <wapper-scroll>
        <div class="artist">
          <div class="title">
            <span>歌手榜</span>
            <span @click="$router.push('/artistList')">歌手分类</span>
          </div>
          <ul class="list">
            <artist-item
              v-for="item in artistList"
              :key="item.id"
              :data="item"
              :handler="fn_artistDetail"
            />
          </ul>
        </div>
      </wapper-scroll>
    </div>
  </transition>
</template>
<script>
import artistItem from '../../components/list-item/artist-item.vue'
export default {
  components: {
    artistItem
  },
  data() {
    return {
      artistList: []
    }
  },
  created() {
    this.fn_getHotArtist()
  },
  methods: {
    //获取热门歌手
    async fn_getHotArtist() {
      const {
        data: {
          code,
          list: { artists }
        }
      } = await this.$http({
        url: '/toplist/artist'
      })

      if (code === 200) {
        this.artistList = artists
        return artists.length
      }
    },
    //歌手详细
    fn_artistDetail(id) {
      this.$router.push(`/artist/${id}`)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  .loading {
    top: 88px;
  }
  .artist {
    margin-top: 10px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      span:first-child {
        font-size: 16px;
        font-weight: 700;
      }
      span:nth-child(2) {
        font-size: 12px;
        color: #666;
        border: 1px solid #666;
        padding: 2px 6px;
        border-radius: 11px;
      }
    }
  }
}
</style>
