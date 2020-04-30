<template>
  <li @click="handler(data.id)">
    <div class="imgBox">
      <img
        v-lazy="`${data.blurPicUrl}?param=60y60`"
        alt=""
      >
    </div>
    <div class="info">
      <p class="name one-txt-cut">
        {{ data.name }}
      </p>
      <p class="total">
        <span>{{ data.artist.name }}</span><span>{{ data.publishTime | filterResolveTime }}</span>
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
    height: 60px;
    border-radius: 4px;
    overflow: hidden;
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
