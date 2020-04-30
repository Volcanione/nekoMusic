<template>
  <div class="root">
    <span
      v-for="item in artistCat"
      :key="item.cat"
      class="item"
      @click="fn_change(item.cat)"
    >{{ item.name }}</span>
    <div
      class="close"
      @click="$emit('closeFilter',false)"
    >
      收起
    </div>
  </div>
</template>
<script>
import {
  artistCat 
} from '../../utils/createMusic'
export default {
  props: {
    value: {
      type: Number,
      default() {
        return -1
      }
    }
  },
  data() {
    return {
      artistCat: artistCat
    }
  },
  created() {},
  methods: {
    fn_change(id) {
      this.$emit('input', id)
      this.$emit('closeFilter', false)
    }
  }
}
</script>

<style lang="less" scoped>
.root {
  position: fixed;
  width: 100%;
  z-index: 999;
  padding: 10px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  .item {
    display: inline-block;
    padding: 0 8px;
    height: 25px;
    line-height: 25px;
    border-radius: 12.5px;
    background: #f0f0f0;
    color: #999;
    font-size: 12px;
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .close {
    text-align: center;
    line-height: 20px;
    font-size: 14px;
    color: #999;
  }
}
</style>
