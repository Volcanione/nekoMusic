import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueLazyload from 'vue-lazyload'
import toast from './components/toast/'
// import fastclick from 'fastclick'
// fastclick.attach(document.body)
// 全局样式
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import 'amfe-flexible'
// import 'normalize.css'
import 'animate.css'
import './assets/font/iconfont.css'
import './assets/css/besa.css'
import './assets/less/index.less'

Vue.use(toast)

Vue.config.productionTip = false
// 配置axios
// 线上接口http://47.111.144.121:3000

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
  withCredentials: true
})


Vue.prototype.$http = instance

// 全局组件
import wapperScroll from './components/wapperScroll.vue'
import titleBack from './components/title&back.vue'
import transitionView from './components/transitionView.vue'
import loading from './components/loading.vue'
Vue.component('wapper-scroll', wapperScroll)
Vue.component('title-back', titleBack)
Vue.component('transition-view', transitionView)
Vue.component('loading', loading)

// 全局注册过滤器
import * as filters from './utils/filters'
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})

// 图片懒加载
import loadIMG from './assets/img/songListBG.png'
Vue.use(VueLazyload, {
  loading: loadIMG,
  error: loadIMG
  // listenEvents: ['touchmove']
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
