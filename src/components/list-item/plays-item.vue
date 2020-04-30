<template>
  <li @click="handler(data.id)">
    <div class="imgBox">
      <img
        v-lazy="`${data.coverImgUrl}?param=60y60`"
        alt=""
      >
    </div>
    <div class="info">
      <p class="name one-txt-cut">
        {{ data.name }}
      </p>
      <p class="total">
        <span>共{{ data.trackCount }}首</span><span>播放{{ data.playCount | playCount_filter }}万次</span>
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
  display: flex;
  justify-content: space-between;
  padding: 10px;
  overflow: hidden;
  .imgBox {
    width: 60px;
    min-width: 60px;
    border-radius: 4px;
    overflow: hidden;
    height: 60px;
    background: #ddd;
  }
  .info {
    flex: 1;
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;
    .name {
      font-size: 16px;
      max-width: 100%;
      color: #333;
      overflow: hidden;
    }
    .total {
      display: flex;
      align-items: flex-end;
      span {
        font-size: 12px;
        color: #999;
        &:last-child {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
