<template>
  <li @click="handler(data.id)">
    <span
      v-if="index+1"
      class="idx"
    >{{ index+1 }}</span>
    <div class="info">
      <p class="name one-txt-cut">
        {{ data.name }}
      </p>
      <span class="singer">{{ data.artists[0].name }}</span>
    </div>
  </li>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    handler: {
      type: Function,
      required: true
    },
    index: {
      type: Number,
      default() {
        return 0
      },
      required: false
    }
  }
}
</script>
<style lang="less" scoped>
li {
  padding: 10px;
  color: #666;
  overflow: hidden;
  .idx {
    width: 20px;
    height: 40px;
    font-size: 12px;
    text-align: center;
    line-height: 40px;
    float: left;
    margin-right: 10px;
  }
  .info {
    height: 40px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .name {
      font-size: 16px;
    }
    .singer {
      font-size: 12px;
    }
  }
}
</style>
