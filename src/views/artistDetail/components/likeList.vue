<template>
  <div ref="wrapperX" class="root">
    <div class="content"> 
      <div class="box">
        <div v-for="item in dataList" :key="item.id" class="item">
          <div class="imgBox" @click="handler(item)"><img :src="item.img1v1Url" alt=""></div>
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
  props: {
    dataList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      
    }
  },
  mounted() {
    this.ScrollInit()
    this.initData()
  },
  methods: {
    ScrollInit() {
      this.scroll = new BScroll(this.$refs.wrapperX, {
        scrollX: true,
        scrollY: false,
        probeType: 3
      })
    },
    initData() {
      //console.log(this.dataList)
    },
    handler(item) {
      this.$emit('detailed', item)
    }
  }
}
</script>
<style lang="less" scoped>
  .root{
    width: calc(100vw);
    height: 90px;
    position: relative;
    .content{
      top: 0;
      position: absolute;
      .box{
        display: flex;
        .item{
          width: 60px;
           margin-right: 10px;
           .imgBox{
              height: 60px;
              border-radius: 50%;
              background: #ddd;
              overflow: hidden;
              img{
                width: 100%;
                height: 100%;
              }
           }
           &:first-child{
             margin-left: 10px;
           }
           .name{
             text-align: center;
             overflow: hidden;
             font-size: 14px;
             height: 30px;
             line-height: 30px;
             color: #333;
           }
        }
      }
    }
  }
</style>
