import axios from 'axios'
import { reject } from 'q'

const mixin = {
  methods: {
    //控制播放器页面打开或者关闭
    fn_PlayPage(status) {
      this.$store.commit('setOpenPlayPage', status)
    },
    //添加到播放列表
    fn_playList(music) {
      this.$store.commit('setplayList', music)
    },
    //追加到播放列表
    fn_pushplayList(music) {
      this.$store.commit('setPushplayList', music)
    },
    //设置当前播放ID
    fn_isPlayID(music) {
      this.$store.commit('setIsPlayID', music.id)
    },
    //设置播放模式
    fn_setPlayType() {
      this.$store.commit('setplayType')
    },
    //播放暂停
    fn_setplaying(status = null) {
      this.$store.commit('setplaying', status)
    },

    //切换播放模式
    fn_playType() {
      switch (this.getplayType) {
        case 'order':
          this.playTypeCls.splice(1, 1, 'icon-liebiaoxunhuan')
          this.playTypeTxt = '顺序播放'
          break
        case 'alone':
          this.playTypeCls.splice(1, 1, 'icon-liebiaoxunhuan alone')
          this.playTypeTxt = '单曲循环'
          break
        default:
          this.playTypeCls.splice(1, 1, 'icon-suijibofang')
          this.playTypeTxt = '随机播放'
          break
      }
    },
    //播放器
    fn_setAudioPlay(state) {
      this.$nextTick(() => {
        const audio = document.getElementById('audio')
        try {
          audio.load()
          let timeID = -1
          clearTimeout(timeID)
          timeID = setTimeout(() => {
            if (state) {
              const playPromise = audio.play()
              if (playPromise !== undefined) {
                playPromise.then(_ => {
                  // Automatic playback started!
                  // Show playing UI.
                })
                  .catch(error => {
                    audio.play()
                  })
              }
            } else {
              audio.pause()
            }
          }, 1000)
          
        } catch (error) {
          console.log('')
        }
      })
    },
    //检测音乐是否有版权
    async fn_checkMusic(id) {
      try {
        const { data } = await axios({
          url: '/check/music',
          params: {
            id
          }
        })
        return data
      } catch (error) {
        console.log()
        return reject(error)
      }
    },
    //获取歌单url,合成完整MUSIC对象
    async getMusicURL_all(url, arr) {
      const id = arr.map(i => i.id).join(',')
      const allMusic = {}
      try {
        const {
          data: { code, data }
        } = await axios({
          url,
          params: {
            id,
            br: 128000
          }
        })
        switch (code) {
          case 200:
            arr.forEach(item => {
              //item.playUrl = data.find(i => i.id === item.id).url
              item.playUrl = `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`
              item.idd = data.find(i => i.id === item.id).id
              allMusic[item.id] = item
            })
            return allMusic
          default:
            arr.forEach(item => {
              item.playUrl = `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`
              allMusic[item.id] = item
            })
            return allMusic
        }
      } catch (error) {
        arr.forEach(item => {
          item.playUrl = `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`
          allMusic[item.id] = item
        })
        return allMusic
      }
    },
    //获取歌曲详细
    async fn_getSongDetail(url, ids) {
      const {
        data: { code, songs }
      } = await axios({
        url,
        params: {
          ids
        }
      })
      if (code === 200) {
        if (songs.length === 1) {
          return songs[0]
        } else {
          return songs
        }
      }
    },
    //搜索接口
    async fn_getSearchData(url, type, keywords, page, pageSize) {
      try {
        const {
          data: { code, result }
        } = await axios({
          url,
          params: {
            keywords,
            type,
            offset: (page - 1) * pageSize,
            limit: pageSize
          }
        })
        if (code === 200) {
          return result
        } else {
          console.log('获取数据失败')
          return []
        }
      } catch (error) {
        console.log('获取数据失败')
        return []
      }
    }
  }
}
export default mixin
