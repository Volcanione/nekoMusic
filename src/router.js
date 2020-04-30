import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'

import recom from './views/recom/recom.vue'
import search from './views/search/search.vue'
import my from './views/more/my.vue'
import login from './views/more/login.vue'

import { getUserInfo } from './utils/user.js'

Vue.use(Router)
Router.prototype.isBack = function() {
  this.Back = true
}
axios.defaults.baseURL = process.env.VUE_APP_BASE_API
axios.defaults.withCredentials = true

const router = new Router({
  //mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/recom'
    },
    {
      path: '/recom',
      name: 'recom',
      component: recom
    },
    {
      path: '/playListDetail/:id',
      name: 'playListDetail',
      components: {
        attachView: () =>
          import(
            /* webpackChunkName: "home" */ './views/playListDetail/playListDetail.vue'
          )
      }
    },
    {
      path: '/recomPlayList',
      name: 'recomPlayList',
      components: {
        attachView: () =>
          import(
            /* webpackChunkName: "home" */ './views/recomPlayList/recomPlayList.vue'
          )
      }
    },
    {
      path: '/playTags',
      name: 'playTags',
      components: {
        attachView: () =>
          import(/* webpackChunkName: "home" */ './views/playTags/playTags.vue')
      }
    },
    {
      path: '/rank',
      name: 'rank',
      component: () =>
        import(/* webpackChunkName: "home" */ './views/rank/rank.vue')
    },
    {
      path: '/rankDetail/:idx/:name',
      name: 'rankDetail',
      components: {
        attachView: () =>
          import(
            /* webpackChunkName: "home" */ './views/rankDetail/rankDetail.vue'
          )
      }
    },
    {
      path: '/artist',
      name: 'artist',
      component: () =>
        import(/* webpackChunkName: "home" */ './views/artist/artist.vue')
    },
    {
      path: '/artistList',
      name: 'artistList',
      components: {
        attachView: () =>
          import(
            /* webpackChunkName: "home" */ './views/artistList/artistList.vue'
          )
      }
    },
    {
      path: '/artist/:id',
      name: 'artistDetail',
      components: {
        attachView: () =>
          import(
            /* webpackChunkName: "home" */ './views/artistDetail/artistDetail.vue'
          )
      }
    },
    {
      path: '/artists/:id',
      name: 'artistsDetail',
      components: {
        attachView: () =>
          import(
            /* webpackChunkName: "home" */ './views/artistDetail/artistsDetail.vue'
          )
      }
    },
    {
      path: '/search',
      name: 'search',
      components: {
        attachView: search
      }
    },
    {
      path: '/albumDetail/:id',
      name: 'albumDetail',
      components: {
        attachView: () =>
          import(
            /* webpackChunkName: "home" */ './views/albumDetail/albumDetail.vue'
          )
      }
    },
    {
      path: '/songsList/:search',
      name: 'songsList',
      components: {
        attachView: () =>
          import(
            /* webpackChunkName: "home" */ './views/songsList/songsList.vue'
          )
      }
    },
    {
      path: '/albumList/:search',
      name: 'albumList',
      components: {
        attachView: () =>
          import(
            /* webpackChunkName: "home" */ './views/albumList/albumList.vue'
          )
      }
    },
    {
      path: '/playList/:search',
      name: 'playList',
      components: {
        attachView: () =>
          import(/* webpackChunkName: "home" */ './views/playList/playList.vue')
      }
    },
    {
      path: '/my',
      name: 'my',
      components: {
        attachView: my
      }
    },
    {
      path: '/login',
      name: 'login',
      components: {
        attachView: login
      }
    }
  ]
})

//导航守卫
router.beforeEach(async(to, from, next) => {
  // ...
  if (to.name === 'my') {
    try {
      const res = await axios({
        url: '/login/status',
        params: { timestamp: +new Date() }
      })
      if (res.data.code === 200) {
        let userInfo = JSON.parse(localStorage.getItem('NekoInfo'))
        const userId = JSON.parse(localStorage.getItem('userId'))
        if (userId) {
          if (!userInfo) {
            userInfo = await getUserInfo(userId)
            localStorage.setItem('NekoInfo', JSON.stringify(userInfo))
          }
          return next()
        } else {
          return next('/login')
        }
      }
    
    } catch (error) {
      return next('/login')
    }
  }
  next()
})

export default router
