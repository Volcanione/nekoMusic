<template>
  <transition
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut">
    <div class="container">
      <loading
        class="loading"
        :is-loading="otherRank.length" />
      <wapper-scroll>
        <div class="rank">
          <div class="title">
            <span>官方榜</span>
          </div>
          <ul class="officialRank">
            <li
              v-for="item in officialRank"
              :key="item.id"
              class="rankiItem"
              @click="$router.push(`/rankDetail/${item.key}/${item.name}`)">
              <div class="imgBox">
                <div class="mark"></div>
                <span class="tag">{{ item.updateFrequency }}</span>
                <img
                  v-lazy="`${item.coverImgUrl}?param=200y200`"
                  alt="">
              </div>
              <div class="info">
                <p
                  v-for="(v,index) in item.tracks"
                  :key="index"
                  class="one-txt-cut ">{{ v.first }} - {{ v.second }}</p>
              </div>
            </li>
          </ul>
          <div class="title">
            <span>其它榜单</span>
          </div>
          <ul class="songListCmp">
            <li
              v-for="item in otherRank"
              :key="item.id"
              @click="$router.push(`/rankDetail/${item.key}/${item.name}`)">
              <div class="item">
                <div class="imgBox">
                  <div class="mark"></div>
                  <span class="tag">{{ item.updateFrequency }}</span>
                  <img
                    v-lazy="`${item.coverImgUrl}?param=200y200`"
                    alt="">
                </div>
                <p class="txt-cut">{{ item.name }}</p>
              </div>
            </li>
          </ul>

        </div>
      </wapper-scroll>
    </div>
  </transition>
</template>
<script>
import { rankFilter } from '../../utils/createMusic'
export default {
  data() {
    return {
      officialRank: [],
      otherRank: []
    }
  },
  created() {
    this.fn_getRankData()
  },
  methods: {
    //获取所有榜单数据
    async fn_getRankData() {
      try {
        const {
          data: { list, code }
        } = await this.$http({
          url: '/toplist/detail'
        })
        if (code === 200) {
          list.forEach(item => {
            const idx = rankFilter.findIndex(i => item.name === i.name)
            item.key = idx
          })
          this.officialRank = list.filter(item => item.tracks.length > 0)
          this.otherRank = list.filter(
            item => item.tracks.length === 0 && item.key !== -1
          )
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@imgSzie: calc((100vw - 40px) / 3);
.container {
  .loading {
    top: 88px;
  }
  .rank {
    margin-top: 10px;
    overflow: hidden;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      span:first-child {
        font-size: 16px;
        font-weight: 700;
      }
    }
    .officialRank {
      .rankiItem {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        .imgBox {
          position: relative;
          width: @imgSzie;
          height: @imgSzie;
          background: #ddd;
          border-radius: 6px;
          overflow: hidden;
          .mark {
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.2);
          }
          .tag {
            position: absolute;
            left: 5px;
            bottom: 5px;
            font-size: 12px;
            color: #fff;
            transform: scale(0.9);
          }
        }
        .info {
          flex: 1;
          padding-left: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          overflow: hidden;
          p {
            font-size: 12px;
            color: #666;
            overflow: hidden;
          }
        }
      }
    }
    .songListCmp {
      margin-top: 10px;
      padding: 0 5px;
      justify-content: start;
      flex-wrap: wrap;
      overflow: hidden;
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
            background: #ddd;
            .mark {
              position: absolute;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.2);
            }
            .tag {
              position: absolute;
              left: 5px;
              bottom: 5px;
              font-size: 12px;
              color: #fff;
              transform: scale(0.9);
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
    }
  }
}
</style>
