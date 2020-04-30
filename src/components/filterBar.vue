<template>
  <div class="root">
    <div class="filterBar">
      <div
        ref="wrapper"
        class="filter">
        <ul
          class="list"
          :style="{width:listW+'px'}">
          <template v-for="item in dataArr">
            <li
              ref="itemList"
              :key="item.id"
              :class="{active:item.name===selectName}"
              @click="fn_select(item,$event)">{{ item.name }}</li>
          </template>
        </ul>
      </div>
    </div>
    <span
      v-if="more"
      class="more"
      @click="$emit('moreClick',selectName)">
      <i class="iconfont icon-fenlei"></i></span>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
  props: {
    dataArr: {
      type: Array,
      required: true
    },
    more: {
      type: Boolean,
      default() {
        return false
      }
    },
    isCheck: {
      required: false
    }
  },
  data() {
    return {
      listW: 0,
      selectName: ''
    }
  },
  watch: {
    dataArr: {
      deep: true,
      handler(val) {
        this.selectName = this.isCheck.name
        this.$nextTick(() => {
          this.fn_setListW()
          this.scroll.refresh()
        })
      }
    },
    isCheck: {
      deep: true,
      handler(val) {
        this.$nextTick(async() => {
          const activeLi = document.querySelector('.active')
          const scrollW =
            (await (activeLi.previousSibling &&
              activeLi.previousSibling.offsetWidth)) || 0
          this.scroll.refresh()
          this.scroll.scrollToElement(activeLi, 500, -scrollW, 0)
        })
      }
    }
  },
  mounted() {
    this.fn_initScroll()
    this.$nextTick(() => {
      this.$refs.itemList && this.fn_setListW()
      this.scroll.refresh()
    })
  },
  methods: {
    //初始化
    fn_initScroll() {
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        tap: true,
        scrollX: true,
        scrollY: false
      })
    },
    //初始化filter宽度
    fn_setListW() {
      this.listW =
        this.$refs.itemList
          .map(item => {
            return item.offsetWidth
          })
          .reduce((x, y) => {
            return x + y
          }, 0) + 1
    },
    //筛选是的数据
    fn_select(item, e) {
      this.selectName = item.name
      this.$nextTick(() => {
        const scrollW =
          (e.target.previousSibling && e.target.previousSibling.offsetWidth) ||
          0
        this.scroll.scrollToElement(e.target, 500, -scrollW, 0)
      })
      this.$emit('change', item)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../assets/theme/default.less');
.root {
  height: 40px;
  display: flex;
  overflow: hidden;
  .filterBar {
    flex: 1;
    position: relative;
    .filter {
      position: absolute;
      height: 100%;
      width: 100%;
      border-bottom: 1px solid #f0f0f0;
      .list {
        min-width: 100%;
        height: 100%;
        li {
          position: relative;
          display: inline-block;
          height: 40px;
          line-height: 40px;
          padding: 0 10px;
          font-size: 14px;
          color: #666;
          &.active {
            color: @bgred;
          }
          &.active::after {
            position: absolute;
            content: '';
            bottom: 0px;
            height: 1px;
            left: 0;
            right: 0;
            background: @bgred;
          }
        }
      }
    }
  }
  .more {
    position: relative;
    display: flex;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.8);
    border-left: 1px solid #f0f0f0;
    .iconfont {
      margin: auto;
      font-size: 20px !important;
      color: #666;
    }
  }
}
</style>

