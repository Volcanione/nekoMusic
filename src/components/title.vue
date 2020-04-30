<template>
  <div class="title">
    <span>
      <slot name="leftTxt"></slot>
    </span>
    <span
      v-if="rightBtn"
      @click="()=>handle(num)">
      <slot name="rightTxt"></slot>
    </span>
  </div>
</template>
<script>
export default {
  props: {
    rightBtn: {
      type: Boolean,
      default() {
        return false
      }
    },
    handle: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      num: 12
    }
  },
  methods: {
    // fn_handler() {
    //   this.handle(this.num)
    // }
  }
}
</script>
<style lang="less" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
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
</style>

