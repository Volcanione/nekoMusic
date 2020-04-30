<template>
  <div id="app">
    <home />
    <play-page />
    <transition
      :enter-active-class="routerViewClass[routerViewIdx].enter"
      :leave-active-class="routerViewClass[routerViewIdx].leave"
    >
      <keep-alive include="search">
        <router-view name="attachView"></router-view>
      </keep-alive>
    </transition>
    <home-play-contarl />
    <player-list />
  </div>
</template>
<script>
import home from './views/home.vue'
import playPage from './components/player/playerPage.vue'
import homePlayContarl from './components/player/homePlayContarl'
import playerList from './components/player/playerList'
export default {
  components: {
    home,
    playPage,
    homePlayContarl,
    playerList
  },
  data() {
    return {
      toastShow: false,
      toastTitle: '',
      routerViewClass: [
        {
          enter: 'animated fadeInLeft',
          leave: 'animated fadeOutLeft'
        },
        {
          enter: 'animated fadeInRight',
          leave: 'animated fadeOutRight'
        },
        {
          enter: 'animated fadeIn',
          leave: 'animated fadeOutRight'
        },
        {
          enter: 'animated fadeInRight',
          leave: 'animated fadeOutRight'
        },
        {
          enter: 'animated fadeInRight',
          leave: 'animated fadeOut'
        }
      ],
      routerViewIdx: 0
    }
  },
  watch: {
    $route: {
      deep: true,
      handler({ path }) {
        if (this.$router.Back) {
          this.routerViewIdx = 2
        } else {
          this.routerViewIdx = 3
        }

        switch (path) {
          case '/my':
            this.routerViewIdx = 0
            break
          case '/login':
            this.routerViewIdx = 0
            break
          case '/search':
            this.routerViewIdx = 1
            break
          default:
            break
        }
        this.$router.Back = false
      }
    }
  },
  created() {
    //拦截器
    this.httpInterceptors()
  },
  methods: {
    //拦截器
    httpInterceptors() {
      //请求拦截
      this.$http.interceptors.request.use((config) => {
        if (config.url === '/logout') {
          localStorage.removeItem('userId')
          localStorage.removeItem('NekoInfo')
        }
        return config
      }, (error) => {
        return Promise.reject(error)
      })
      //响应拦截
      this.$http.interceptors.response.use((response) => {
        if (response.data.code !== 200) {
          this.toast({
            title: response.data.msg,
            cancell: () => {
              console.log(response.data.msg)
            }
          })
        }
        return response
      }, (error) => {
        const { data } = error.response
        this.toast({
          title: data ? data.msg : '获取数据失败'
        })
        return Promise.reject(error)
      })
    }
  }
  
}
</script>

<style lang="less" scoped>
#app {
  height: 100%;
  margin: 0 auto;
}
</style>
