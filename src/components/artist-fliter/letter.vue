<template>
  <div class="root">
    <template v-for="item in letter">
      <span
        :key="item"
        :class="{item:true,active:item===value}"
        @click="fn_change(item)"
      >{{ item===''?'热':item.toUpperCase() }}</span>
    </template>
  </div>
</template>
<script>
import { letter } from '../../utils/createMusic'
export default {
  props: {
    value: {
      type: String(),
      default() {
        return 'a'
      }
    }
  },
  data() {
    return {
      letter
    }
  },
  methods: {
    fn_change(item) {
      this.$emit('input', item)
    }
  }
}
</script>

<style lang="less" scoped>
.root {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  top: 124px;
  bottom: 50px;
  right: 10px;
  z-index: 999;
  width: 20px;
  background: #fff;
  border-radius: 10px;

  .item {
    font-size: 12px;
    color: #999;
    &.active {
      color: #d44439;
    }
  }
}
</style>
