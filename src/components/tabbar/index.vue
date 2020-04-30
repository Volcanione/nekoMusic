<template>
  <div class="root">
    <div
      v-for="item in dataList"
      :key="item.value"
      :class="{item:true,active:value===item.value}"
      :style="{color:value===item.value?activeColor:fontColor}"
      @click="handler(item)"><span>{{ item.label }}</span></div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    dataList: {
      type: Array,
      default() {
        return []
      }
    },
    fontColor: {
      type: String,
      default() {
        return '#999'
      }
    },
    activeColor: {
      type: String,
      default() {
        return '#333'
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    handler(item) {
      this.$emit('input', item.value)
    }
  }
}
</script>
<style lang="less" scoped>
.root {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  .item {
    display: flex;
    padding: 10px 2px;
    position: relative;
    span {
      margin: auto;
      font-size: 14px;
      font-weight: 500;
    }
    &.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: #ea6767
    }
  }
}
</style>
