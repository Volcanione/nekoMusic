<template>
  <div class="container">
    <header>
      <music-header />
    </header>
    <main>
      <keep-alive :include="['recom']">
        <router-view></router-view>
      </keep-alive>
    </main>
  </div>
</template>

<script>
import musicHeader from '../components/header.vue'
export default {
  components: {
    musicHeader
  },
  data() {
    return {}
  }
}
</script>


<style lang="less" scoped>
@import url('../assets/theme/default.less');
.theme (@bgColor:@bgred,@color:@fontWirte) {
  background: @bgColor;
  color: @color;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
header {
  //height: 88px;
  .theme;
}
main {
  flex: 1;
  position: relative;
}
</style>
