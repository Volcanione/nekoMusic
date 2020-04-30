<template>
  <transition-view>
    <div class="full_header">
      <title-back title="">
        <input
          v-model="searchKey"
          class="search_input"
          type="text"
          placeholder="搜索歌曲，歌手"
          @keyup.enter="fn_search" />
        <i
          v-show="searchKey.length"
          slot="rightBtn"
          class="iconfont icon-shanchu"
          @click="searchKey=''"></i>
      </title-back>
    </div>
    <div class="full_main">
      <div class="container">
        <loading
          v-show="loading"
          class="loading" />
        <wapper-scroll>
          <div
            v-show="!searchState"
            class="searchPage">
            <div class="hotSearch">
              <p class="title">热门搜索</p>
              <div class="list">
                <span
                  v-for="(item,index) in hotSearch"
                  :key="index"
                  @click="fn_hotSearch(item.first)">{{ item.first }}</span>
              </div>
            </div>
            <div
              v-show="history.length"
              class="searchLS">
              <p class="title"><span>搜索历史</span><i
                class="iconfont icon-shanchu-copy"
                @click="fn_removeHistory"></i></p>
              <ul class="list">
                <li
                  v-for="item in history"
                  :key="item">
                  <p
                    class="one-txt-cut "
                    @click="fn_hotSearch(item)">{{ item }}</p>
                  <span @click="fn_delHistory(item)"><i class="iconfont icon-shanchu"></i></span>
                </li>
              </ul>
            </div>
          </div>
          <div
            v-show="searchState"
            class="searchResult">
            <div
              v-show="songsList.length"
              class="title">
              <p>单曲</p>
              <span @click="$router.push(`/songsList/${searchKey}`)">
                更多<i class="iconfont icon-left"></i>
              </span>
            </div>
            <ul class="list">
              <songs-item
                v-for="(item,index) in songsList"
                :key="item.id"
                :index="index"
                :data="item"
                :handler="fn_songDetail" />
            </ul>
            <div
              v-show="playsList.length"
              class="title">
              <p>歌单</p>
              <span @click="$router.push(`/playList/${searchKey}`)">
                更多<i class="iconfont icon-left"></i>
              </span>
            </div>
            <ul class="playsList">
              <plays-item
                v-for="item in playsList"
                :key="item.id"
                :data="item"
                :handler="fn_playlistsDetail" />
            </ul>
            <div
              v-show="albumsList.length"
              class="title">
              <p>专辑</p>
              <span @click="$router.push(`/albumList/${searchKey}`)">
                更多<i class="iconfont icon-left"></i>
              </span>
            </div>
            <ul class="albumsList">
              <albums-item
                v-for="item in albumsList"
                :key="item.id"
                :data="item"
                :handler="fn_getAlbumDetail" />
            </ul>
          </div>
        </wapper-scroll>
      </div>
    </div>
  </transition-view>
</template>

<script>
import Music from '../../utils/createMusic'
import mixin from '../../utils/mixins'
import songsItem from '../../components/list-item/songs-item.vue'
import playsItem from '../../components/list-item/plays-item.vue'
import albumsItem from '../../components/list-item/albums-item.vue'
export default {
  name: 'search',
  components: {
    songsItem,
    playsItem,
    albumsItem
  },
  mixins: [mixin],
  data() {
    return {
      hotSearch: [],
      searchKey: '',
      page: 1, //当前页
      pageSize: 5, //每页数量
      history: JSON.parse(localStorage.getItem('search_Key')) || [],
      loading: true,
      searchState: false,
      songsList: [],
      albumsList: [],
      playsList: [],
      searchUrl: '/search'
    }
  },
  watch: {
    history: {
      deep: true,
      handler(val) {
        localStorage.setItem('search_Key', JSON.stringify(val))
      }
    }
  },
  created() {
    this.fn_getHotSearchData()
  },
  methods: {
    //获取热门搜索数据
    async fn_getHotSearchData() {
      try {
        const {
          data: { code, result }
        } = await this.$http({
          url: '/search/hot'
        })
        if (code === 200) {
          this.hotSearch = result.hots
          this.loading = false
        } else {
          console.log('获取数据失败')
        }
      } catch (error) {
        console.log('获取数据失败')
      }
    },
    //点击热门搜索
    fn_hotSearch(key) {
      this.searchKey = key
      this.fn_search()
    },
    //搜索
    async fn_search() {
      //保存搜索历史
      this.fn_saveHistory()
      this.loading = true
      const { songs, songCount } = await this.fn_getSearchData(
        this.searchUrl,
        1,
        this.searchKey,
        this.page,
        this.pageSize
      )
      this.songsList = songs || []
      const { albums, albumCount } = await this.fn_getSearchData(
        this.searchUrl,
        10,
        this.searchKey,
        this.page,
        this.pageSize
      )
      this.albumsList = albums || []
      const { playlists, playlistCount } = await this.fn_getSearchData(
        this.searchUrl,
        1000,
        this.searchKey,
        this.page,
        this.pageSize
      )
      this.playsList = playlists || []
      this.loading = false
      this.searchState = true
      this.toast({
        title: `已为您搜索出${playlistCount + albumCount + songCount}条内容`
      })
    },
    //保存搜索记录
    fn_saveHistory() {
      const idx = this.history.indexOf(this.searchKey)
      if (idx === -1) {
        this.history.unshift(this.searchKey)
      } else {
        this.history.unshift(this.history.splice(idx, 1)[0])
      }
      if (this.history.length > 9) {
        this.history.pop()
      }
    },
    //清空搜索记录
    fn_removeHistory() {
      this.history = []
    },
    //删除指定记录
    fn_delHistory(key) {
      console.log(key)
      this.history = this.history.filter(item => item !== key)
    },
    //点击单曲
    async fn_songDetail(ids) {
      console.log(ids)
      const {
        id,
        al: { picUrl },
        ar: artists,
        name
      } = await this.fn_getSongDetail('/song/detail', ids)
      const music = new Music({
        id,
        name,
        picUrl,
        artists
      })
      await music.getMusicURL('/song/url')
      this.fn_openPlay(music)
    },
    //点击跳转播放
    fn_openPlay(music) {
      this.fn_PlayPage(true)
      this.fn_playList(music)
      this.fn_isPlayID(music)
      this.fn_setplaying(true)
    },
    //点击歌单详细
    fn_playlistsDetail(id) {
      this.$router.push(`/playListDetail/${id}`)
    },
    //点击专辑详细
    fn_getAlbumDetail(id) {
      this.$router.push(`/albumDetail/${id}`)
    }
  },
  beforeRouteEnter(to, from, next) {
    const { name } = from
    if (
      name === 'recom' ||
      name === null ||
      name === 'rank' ||
      name === 'artist'
    ) {
      next(vm => {
        vm.searchState = false
        vm.searchKey = ''
        vm.songsList = []
        vm.albumsList = []
        vm.playsList = []
      })
    }
    next()
  }
}
</script>

<style lang="less" scoped>
@import url('../../assets/theme/default.less');
.search_input {
  background: none;
  border: none;
  height: 44px;
  color: #fff;
}
input::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.6);
}
.full_main {
  .container {
    .loading {
      top: 44px;
    }
    .searchPage {
      padding: 20px 10px;
      .hotSearch {
        .title {
          font-size: 12px;
          color: #999;
        }
        .list {
          overflow: hidden;
          margin-top: 20px;
          span {
            display: inline-block;
            height: 30px;
            line-height: 30px;
            padding: 0 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            color: #333;
            margin-right: 8px;
            margin-bottom: 8px;
          }
        }
      }
      .searchLS {
        .title {
          color: #999;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          span {
            font-size: 12px;
          }
          .iconfont {
            font-size: 14px !important;
          }
        }
        .list {
          margin-top: 10px;
          li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 25px;
            color: #666;
            & > p {
              overflow: hidden;
              padding-right: 20px;
            }
            & > span {
              display: flex;
              .iconfont {
                margin: auto;
                font-size: 14px !important;
                color: #999;
              }
            }
          }
        }
      }
    }
    .searchResult {
      padding-top: 20px;
      .title {
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        p {
          font-size: 14px;
          color: #333;
        }
        span {
          color: #999;
          font-size: 14px;
          line-height: 16px;
          .iconfont {
            font-size: 14px !important;
          }
        }
      }
      .list {
        margin: 10px 0;
      }
      .playsList,
      .albumsList {
        margin: 10px 0;
      }
    }
  }
}
</style>
