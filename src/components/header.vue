<template>
  <div>
    <div class="musicHeader">
      <router-link
        tag="span"
        to="/my"
        class="more">
        <i class="iconfont icon-gengduo"></i>
      </router-link>
      <p class="title">NEKOMUSIC</p>
      <router-link
        tag="span"
        to="/search"
        class="search">
        <i class="iconfont icon-sousuo"></i>
      </router-link>
    </div>
    <ul class="musicNav">
      <router-link
        class="item"
        active-class="active"
        tag="li"
        to="/recom">推荐</router-link>
      <router-link
        class="item"
        active-class="active"
        tag="li"
        to="/rank">排行</router-link>
      <router-link
        class="item"
        active-class="active"
        tag="li"
        to="/artist">歌手</router-link>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      path: ''
    }
  },
  created() {
  },
  methods: {
  }
}
</script>



<style lang="less" scoped>
.musicHeader {
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .more,
  .search {
    height: 44px;
    width: 44px;
    display: flex;
    i {
      margin: auto;
    }
  }
  .title {
    font-size: 16px;
    font-weight: 700;
  }
}
.musicNav {
  display: flex;
  height: 44px;
  align-items: center;
  justify-content: space-around;
  .item {
    margin: 0 20px;
    font-size: 14px;
    position: relative;
    line-height: 25px;
    &.active {
      font-weight: 700;
      transform: scale(1.1);
    }
  }
}
</style>

