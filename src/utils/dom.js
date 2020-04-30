import moment from 'moment'

const elementStyle = document.createElement('div').style

const vendor = (() => {
  const transformNames = {
    webkit: `webkitTransform`,
    Moz: `mozTransform`,
    O: `OTransform`,
    ms: `msTransform`,
    standard: `transform`
  }

  for (const key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

//进度条兼容处理
export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

//歌词同步处理函数
export const initTime = item => {
  return moment.duration('0:' + item).asSeconds()
}

export function NextTimeArray(currentTime, TimeArray) {
  const currentTimeArray = TimeArray.map(item => {
    return {
      time: initTime(item.time),
      lyricText: item.lyricText
    }
  })
  let idx = currentTimeArray.findIndex(item => {
    return item.time > currentTime
  })

  if (idx >= 0) {
    idx = Math.max(0, idx - 1)
  } else {
    idx = currentTimeArray.length - 1
  }
  return idx
}
