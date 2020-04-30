<template>
  <transition-view>
    <div class="full_header">
      <title-back title="歌单分类"></title-back>
    </div>
    <div class="full_main">
      <div class="container">
        <loading
          v-show="false"
          class="loading"
        />
        <wapper-scroll>
          <div
            v-for="item in TagArr"
            :key="item.id"
            class="tagList"
          >
            <p class="title">
              {{ item.name }}
            </p>
            <div class="list">
              <div
                v-for="(tag,index) in item.tags"
                :key="item.id+index"
                class="item"
              >
                <p
                  class="one-txt-cut"
                  @click="fn_check(tag)"
                >
                  <i
                    v-if="ishot(tag.name)"
                    class="iconfont icon-hot-icon hot"
                  ></i>
                  <span>{{ tag.name }}</span>
                </p>
              </div>
            </div>
          </div>
        </wapper-scroll>
      </div>
    </div>
  </transition-view>
</template>

<script>
import { mapMutations } from 'vuex'
import recomPlayList from '../recomPlayList/recomPlayList.vue'
export default {
  mixins: [recomPlayList],
  data() {
    return {
      playListTag: [],
      allTags: [],
      categories: {}
    }
  },
  methods: {
    ...mapMutations(['changeTag']),
    // 获取热门歌单分类
    async fn_getHotTags() {
      await this.fn_getFilterData()
    },
    // 获取全部歌单分类
    async fn_getAllTags() {
      try {
        const {
          data: { code, sub, categories }
        } = await this.$http({
          url: '/playlist/catlist'
        })
        if (code === 200) {
          this.categories = categories
          this.allTags = sub
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 点击分类跳转
    fn_check(tag) {
      const idx = this.playListTag.findIndex(item => item.name === tag.name)
      if (idx === -1) {
        this.$router.push({
          path: '/recomPlayList',
          query: { ...tag }
        })
      } else {
        this.$store.commit('changeTag', tag)
        this.$router.go(-1)
      }
    },
    // 封装分类方法
    fn_getTags(type) {
      return this.allTags.filter(item => {
        return item.category === +type
      })
    }
  },
  computed: {
    TagArr() {
      const newArr = Object.keys(this.categories).map(item => {
        return {
          id: item,
          name: this.categories[item],
          tags: this.fn_getTags(item)
        }
      })
      return newArr
    },
    ishot() {
      return function(val) {
        return this.playListTag.findIndex(item => item.name === val) !== -1
      }
    }
  },
  created() {
    this.fn_getHotTags()
    this.fn_getAllTags()
  }
}
</script>

<style lang="less" scoped>
.container {
  .tagList {
    margin-top: 20px;
    .title {
      padding: 0 10px;
      font-size: 14px;
      color: #333;
      margin-bottom: 20px;
    }
    .list {
      margin: 0 5px 10px;
      overflow: hidden;
      .item {
        display: inline-block;
        width: 25%;
        margin-bottom: 10px;
        padding: 0 5px;
        p {
          position: relative;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: #e0e0e0;
          border-radius: 15px;
          padding: 0 5px;
          overflow: hidden;
          .hot {
            position: absolute;
            left: 5px;
            top: 50%;
            transform: translateY(-50%);
            color: #d44439;
            font-size: 12px !important;
          }
          span {
            font-size: 12px;
            color: #333;
          }
        }
      }
    }
  }
}
</style>

