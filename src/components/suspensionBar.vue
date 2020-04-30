<template>
  <div
    v-show="isSuspenShow"
    class="root">
    <span
      v-for="item in tabList"
      :key="item.id"
      :class="{active:item.id===value}"
      @click="change(item)">{{ item.title }}</span>
  </div>
</template>
<script>
export default {
  props: {
    supsenTop: {
      type: Number,
      default() {
        return 0
      }
    },
    value: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      tabList: [
        {
          id: 0,
          url: '',
          title: '单曲'
        },
        {
          id: 1,
          url: 'album',
          title: '专辑'
        },
        {
          id: 2,
          url: 'desc',
          title: '详情'
        }
      ]
    }
  },
  computed: {
    isSuspenShow() {
      return this.supsenTop < 44
    }
  },
  watch: {
    isActive(val) {
      console.log(val)
    }
  },
  methods: {
    change(item) {
      this.$emit('input', item.id)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../assets/theme/default.less');
.root {
  position: fixed;
  top: 44px;
  z-index: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 40px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  span {
    font-size: 14px;
    color: #999;
    &.active {
      color: @bgred;
    }
  }
}
</style>
