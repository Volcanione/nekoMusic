import axios from 'axios'
axios.defaults.baseURL = process.env.VUE_APP_BASE_API
axios.defaults.withCredentials = true
//获取用户信息
export async function getUserInfo(uid) {
  const res = await axios({
    url: '/user/detail',
    params: { 
      uid,
      timestamp: +new Date()
    }
  })
  if (res.data.code !== 200) {
    return
  }
  return res.data
}
