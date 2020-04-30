import moment from 'moment'
function filterMusicTime(val) {
  return moment.unix(val).format('mm:ss')
}
function playCount_filter(num) {
  return parseInt(num / 10000)
}
function filterResolveTime(val) {
  return moment(val).format('YYYY-MM-DD')
}

//导出过滤器
export { filterMusicTime, playCount_filter, filterResolveTime }
