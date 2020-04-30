<template>
  <transition-view>
    <div class="full_header">
      <title-back :title="$route.query.name?$route.query.name: '歌单广场'"></title-back>
    </div>
    <div class="full_main">
      <div class="container">
        <loading :is-loading="pageLoading" />
        <filter-bar
          v-if="isFilterShow"
          :data-arr="playListTag"
          :more="true"
          :is-check="isTag"
          @change="fn_getCheck"
          @moreClick="$router.push('/playTags')" />
        <play-list-filter
          :cat="isTag.name"
          @pageIsLoading="pageIsLoading" />
      </div>
    </div>
  </transition-view>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import playListFilter from '../../components/playList-filter/playList-filter.vue'
import filterBar from '../../components/filterBar.vue'
export default {
  components: {
    playListFilter,
    filterBar
  },
  data() {
    return {
      playListTag: [],
      isTag: {},
      pageLoading: 0,
      isFilterShow: true
    }
  },
  methods: {
    ...mapMutations(['changeTag']),
    //获取热门歌单分类数据
    async fn_getFilterData() {
      try {
        const {
          data: { code, tags }
        } = await this.$http({
          url: '/playlist/hot'
        })
        if (code === 200) {
          this.playListTag = tags
          if (this.playlists.tagCat.name) {
            return (this.isTag = this.playlists.tagCat)
          }
          this.isTag = tags[0]
        }
      } catch (error) {
        console.log(error)
      }
    },

    //获取选中的类别
    fn_getCheck(val) {
      this.isTag = val
    },

    //隐藏筛选
    fn_hideFilter() {
      this.isFilterShow = false
    },

    //loading
    pageIsLoading(val) {
      this.pageLoading = val
    }
  },
  created() {
    this.fn_getFilterData()
    const { name } = this.$route.query
    name && this.fn_hideFilter()
  },
  computed: {
    ...mapState(['playlists'])
  },
  watch: {
    isTag(val) {
      this.$store.commit('changeTag', val)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
