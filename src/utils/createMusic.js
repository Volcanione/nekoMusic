import axios from 'axios'
import defalutImg from '@/assets/img/head.jpg'
export default class Music {
  constructor(data = {}) {
    this.id = data.id
    this.name = data.name
    this.picUrl = data.picUrl || defalutImg
    this.getMusicSinger(data)
  }

  getMusicSinger(data) {
    this.singer = data.artists
      .map(item => {
        return item.name
      })
      .join('/')
  }

  async getMusicURL(url) {
    try {
      const {
        data: { code, data }
      } = await axios({
        url,
        params: {
          id: this.id,
          br: 128000
        }
      })
      switch (code) {
        case 200:
          this.playUrl = data[0].url
          return true
        default:
          return false
      }
    } catch (error) {
      return false
    }
    //console.log('网络连接失败')
  }
}

const rankFilter = [
  {
    idx: 0,
    name: '云音乐新歌榜'
  },
  {
    idx: 1,
    name: '云音乐热歌榜'
  },
  {
    idx: 2,
    name: '网易原创歌曲榜'
  },
  {
    idx: 3,
    name: '云音乐飙升榜'
  },
  {
    idx: 4,
    name: '云音乐电音榜'
  },
  {
    idx: 5,
    name: 'UK排行榜周榜'
  },
  {
    idx: 6,
    name: '美国Billboard周榜'
  },
  {
    idx: 7,
    name: 'KTV嗨榜'
  },
  {
    idx: 8,
    name: 'iTunes榜'
  },
  {
    idx: 9,
    name: 'Hit FM Top榜'
  },
  {
    idx: 10,
    name: '日本Oricon周榜'
  },
  {
    idx: 11,
    name: '韩国Melon排行榜周榜'
  },
  {
    idx: 12,
    name: '韩国Mnet排行榜周榜'
  },
  {
    idx: 13,
    name: '韩国Melon原声周榜'
  },
  {
    idx: 14,
    name: '中国TOP排行榜(港台榜)'
  },
  {
    idx: 15,
    name: '中国TOP排行榜(内地榜)'
  },
  {
    idx: 16,
    name: '香港电台中文歌曲龙虎榜'
  },
  {
    idx: 17,
    name: '华语金曲榜'
  },
  {
    idx: 18,
    name: '中国嘻哈榜'
  },
  {
    idx: 19,
    name: '法国 NRJ EuroHot 30周榜'
  },
  {
    idx: 20,
    name: '台湾Hito排行榜'
  },
  {
    idx: 21,
    name: 'Beatport全球电子舞曲榜'
  },
  {
    idx: 22,
    name: '云音乐ACG音乐榜'
  },
  {
    idx: 23,
    name: '云音乐嘻哈榜'
  }
]

const artistCat = [
  {
    cat: 5001,
    name: '入驻歌手'
  },
  {
    cat: 1001,
    name: '华语男歌手'
  },
  {
    cat: 1002,
    name: '华语女歌手'
  },
  {
    cat: 1003,
    name: '华语组合/乐队'
  },
  {
    cat: 2001,
    name: '欧美男歌手'
  },
  {
    cat: 2002,
    name: '欧美女歌手'
  },
  {
    cat: 2003,
    name: '欧美组合/乐队'
  },
  {
    cat: 6001,
    name: '日本男歌手'
  },
  {
    cat: 6002,
    name: '日本女歌手'
  },
  {
    cat: 6003,
    name: '日本组合/乐队'
  },
  {
    cat: 7001,
    name: '韩国男歌手'
  },
  {
    cat: 7002,
    name: '韩国女歌手'
  },
  {
    cat: 7003,
    name: '韩国组合/乐队'
  },
  {
    cat: 4001,
    name: '其他男歌手'
  },
  {
    cat: 4002,
    name: '其他女歌手'
  },
  {
    cat: 4003,
    name: '其他组合/乐队'
  }
]

const letter = [
  '',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
]

export { rankFilter, artistCat, letter }
