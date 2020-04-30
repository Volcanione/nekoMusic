import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//播放列表
const MusicPlayer = {
  strict: true,
  state: {
    openPlayPage: false,
    list: {},
    isPlayID: -1,
    playing: false,
    playType: ['order', 'alone', 'random'],
    openList: false,
    playlistID: [],
    historyList: [],
    likeMusicList: [],
    duration: 0,
    currentTime: 0
  },
  mutations: {
    //播放器弹出
    setOpenPlayPage(state, data) {
      state.openPlayPage = data
    },
    //添加到播放列表
    setplayList(state, data) {
      // console.log(data)
      if (!state.list[data.id]) {
        state.list[data.id] = data
        state.playlistID.unshift({
          id: data.id,
          name: data.name
        })
      } else {
        state.isPlayID = data.id
      }
    },
    //追加到播放列表
    setPushplayList(state, data) {
      if (!state.list[data.id]) {
        state.list[data.id] = data
        state.playlistID.push({
          id: data.id,
          name: data.name
        })
      }
    },
    //添加历史播放列表
    sethistoryList(state, data) {
      const { historyList } = state
      if (data && historyList.findIndex(i => i.id === data.id) === -1) {
        historyList.push(data)
      }
    },
    //当前播放的ID
    setIsPlayID(state, id) {
      state.isPlayID = id
    },
    //切换播放模式
    setplayType(state) {
      state.playType.push(state.playType.shift())
    },
    //播放或者暂停
    setplaying(state, data) {
      if (typeof data === 'boolean') {
        return (state.playing = data)
      }
      if (state.isPlayID === -1) {
        return (state.playing = false)
      }
      state.playing = !state.playing
    },
    //打开播放列表
    setopenList(state) {
      state.openList = !state.openList
    },
    //删除指定歌曲
    delplaylist(state, id) {
      const idx = state.playlistID.findIndex(item => {
        return item.id === id
      })
      state.playlistID.splice(idx, 1)
      delete state.list[id]
      state.historyList = state.historyList.filter(item => item.id !== +id)
      if (!state.playlistID.length) {
        state.openList = false
        state.isPlayID = -1
        return
      }


      if (state.isPlayID === id) {
        state.isPlayID = state.playlistID[idx] ? state.playlistID[idx ].id : state.playlistID[0].id
      }
    },
    //清空播放列表
    removeplaylist(state) {
      state.list = {}
      state.openList = false
      state.isPlayID = -1
      state.playlistID = []
    },
    //播放全部歌单音乐
    setAllMusic(state, data) {
      state.list = data[0]
      state.playlistID = data[1]
      state.isPlayID = data[1][0].id
    },
    setLikeList(state, data) {
      state.likeMusicList = data
    },
    //设置总时长
    setduration(state, data) {
      state.duration = data
    },
    //设置当前时长
    setcurrentTime(state, data) {
      state.currentTime = data
    }
  },
  actions: {},
  getters: {
    //获取切换的状态
    getplayType(state) {
      return state.playType[0]
    },
    //获取当前播放
    isPlayMusic(state) {
      return state.list[state.isPlayID]
    },
    //播放进度
    progress(state) {
      return Math.floor(state.currentTime / state.duration * 100)
    }
  }
}

const playlists = {
  strict: true,
  state: {
    tagCat: {}
  },
  mutations: {
    changeTag(state, data) {
      state.tagCat = data
    }
  }
}

const store = new Vuex.Store({
  modules: {
    MusicPlayer,
    playlists
  },
  state: {
    scrollY: 0,
    showHomePlay: true
  },
  mutations: {
    setScrollY(state, y) {
      state.scrollY = y
    },
    setShowHomePlay(state, data) {
      state.showHomePlay = data
    }
  }
})

export default store
