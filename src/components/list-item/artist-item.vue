<template>
  <li @click="handler(data.id)">
    <div class="imgBox">
      <img
        v-lazy="`${data.picUrl}?param=60y60`"
        alt=""
      >
    </div>
    <div class="info">
      <p class="name">
        {{ data.name }}
      </p>
      <p class="size">
        <span>专辑 {{ data.albumSize }} </span>
        <span>单曲 {{ data.musicSize }} </span>
      </p>
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
    }
  }
}
</script>
<style lang="less" scoped>
li {
  padding: 10px;
  display: flex;
  .imgBox {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #ddd;
    overflow: hidden;
  }
  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding-left: 10px;
    overflow: hidden;
    .name {
      font-size: 14px;
      color: #333;
    }
    .size {
      font-size: 12px;
      color: #999;
      span {
        margin-right: 10px;
      }
    }
  }
}
</style>
