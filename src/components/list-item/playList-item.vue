<template>
  <li>
    <div class="item">
      <div
        class="imgBox"
        @click="handler(data.id)"
      >
        <span
          v-if="data.playCount"
          class="listenNum"
        ><i class="iconfont icon-mayi-erji-jianbian"></i> {{ data.playCount | playCount_filter }}万</span>
        <img
          v-lazy="`${data.coverImgUrl?data.coverImgUrl:data.picUrl}?param=200y200`"
          alt=""
        >
      </div>
      <p class="txt-cut">
        {{ data.name }}
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
  float: left;
  padding: 0 5px;
  width: 33.3333%;
  .item {
    .imgBox {
      height: calc((100vw - 40px) / 3);
      border-radius: 6px;
      overflow: hidden;
      position: relative;
      .listenNum {
        position: absolute;
        height: 20px;
        text-align: right;
        line-height: 20px;
        padding: 0 5px;
        width: 100%;
        top: 0;
        font-size: 12px;
        color: #fff;
        .iconfont {
          font-size: 12px !important;
        }
      }
    }
    p {
      margin: 10px 0;
      font-size: 12px;
      color: #666;
      height: 32px;
      line-height: 16px;
    }
  }
}
</style>
