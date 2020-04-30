<template>
  <transition-view>
    <div class="full_header">
      <title-back title="歌手分类" />
    </div>
    <div class="full_main">
      <div class="container">
        <loading :is-loading="artistList.length" />
        <loading
          v-show="updataLoading"
          class="updateloading" />
        <div class="title">
          <span>{{ catFilter }}</span>
          <span @click="fn_filter"><i class="iconfont icon-shaixuan-"></i>筛选</span>
        </div>
        <transition
          enter-active-class="animated slideInDown"
          leave-active-class="animated slideOutUp">
          <artist-filter
            v-if="artistFilterShow"
            v-model="artistFilter"
            @closeFilter="closeFilter" />
        </transition>
        <artist-letter v-model="initial" />
        <wapper-scroll
          :pull-up-load-and-refresh="true"
          @pullingUp="fn_pullingUp"
          @pullingDown="fn_pullingDown"
          @init="fn_init">
          <ul class="list">
            <artist-item
              v-for="item in artistList"
              :key="item.id"
              :data="item"
              :handler="fn_artistDetail" />
            <li
              v-if="isnextShow"
              ref="itemend"
              class="itemend">{{ nextLetter }}</li>
          </ul>
        </wapper-scroll>
      </div>
    </div>
  </transition-view>
</template>
<script>
import artistFilter from '../../components/artist-fliter/filter.vue'
import artistLetter from '../../components/artist-fliter/letter.vue'
import artistItem from '../../components/list-item/artist-item.vue'
import { artistCat, letter } from '../../utils/createMusic'
export default {
  components: {
    artistFilter,
    artistItem,
    artistLetter
  },
  data() {
    return {
      artistList: [],
      pageSize: 30,
      page: 1,
      updataLoading: false,
      lastCount: 999,
      artistFilterShow: false,
      artistFilter: 1001,
      initial: '',
      isnextShow: false
    }
  },
  computed: {
    catFilter() {
      const cat = artistCat.find(item => item.cat === this.artistFilter)
      return cat ? cat.name : '华语男歌手'
    },
    nextLetter() {
      const idx = letter.findIndex(item => item === this.initial)
      if (idx < letter.length - 1) {
        return `继续下拉加载${letter[idx + 1].toUpperCase()}`
      }
      return '没有更多了'
    }
  },
  watch: {
    artistFilter() {
      this.initial = ''
      this.page = 1
      this.fn_getHot()
    },
    async initial() {
      this.page = 1
      this.scroll.scrollTo(0, 0, 0)
      await this.fn_getHot()
      this.isnextShow = false
    }
  },
  created() {
    this.fn_getHot()
  },
  methods: {
    //获取数据
    async fn_getHot(type = 'refresh') {
      const {
        data: { code, artists }
      } = await this.$http({
        url: '/artist/list',
        params: {
          offset: (this.page - 1) * this.pageSize,
          limit: this.pageSize,
          cat: this.artistFilter,
          initial: this.initial
        }
      })
      if (code === 200) {
        switch (type) {
          case 'refresh':
            this.artistList = artists
            break
          default:
            if (artists) {
              this.artistList = [...this.artistList, ...artists]
            }
            break
        }
        return artists.length
      }
    },
    //初始化scroll
    fn_init(scroll) {
      this.scroll = scroll
    },
    //上拉加载
    async fn_pullingUp(scroll) {
      this.updataLoading = true
      if (this.lastCount >= this.pageSize) {
        this.page += 1
        this.lastCount = await this.fn_getHot('update')
        scroll.refresh()
      } else {
        this.toast({
          title: '到底了',
          top: 94
        })
      }
      this.isnextShow = true
      const idx = letter.findIndex(item => item === this.initial)
      if (this.$refs.itemend && this.initial !== 'z') {
        this.initial = letter[idx + 1]
        this.isnextShow = false
        this.updataLoading = true
      }

      scroll.finishPullUp()
      this.updataLoading = false
    },
    //下拉刷新
    async fn_pullingDown(scroll) {
      const idx = letter.findIndex(item => item === this.initial)
      if (idx === 0) {
        this.updataLoading = true
        this.page = 1
        this.lastCount = 999
        await this.fn_getHot()
        this.updataLoading = false
      } else {
        this.initial = letter[idx - 1]
      }
      scroll.finishPullDown()
      scroll.refresh()
    },
    //打开筛选
    fn_filter() {
      this.artistFilterShow = true
    },
    //关闭筛选
    closeFilter() {
      this.artistFilterShow = false
    },
    //歌手详细
    fn_artistDetail(id) {
      this.$router.push(`/artist/${id}`)
    }
  }
}
</script>


<style lang="less" scoped>
.full_main {
  .updateloading {
    top: 44px;
    opacity: 0.2;
  }
  .title {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    height: 40px;
    overflow: hidden;
    color: #666;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14px;
    line-height: 40px;
    .iconfont {
      font-size: 14px !important;
      margin-right: 2px;
    }
  }
  .itemend {
    text-align: center;
    font-size: 12px;
    color: #999;
    line-height: 40px;
  }
}
</style>
