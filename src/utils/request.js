import axios from 'axios'
import {useUserStore} from '@/stores/index'
export const baseURL = 'https://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // 1. 基础地址，超时时间
  baseURL,
  timeout: 5000
})

instance.interceptors.request.use(
  (config) => {
    // 2. 携带token
    const userStore = useUserStore()
    config.headers.Authorization = userStore.token
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    // 3. 处理业务失败
    if(res.data.code === 0){
      return res
    }else{
      return Promise.reject(new Error(res.data.message || '请求失败'))
    }
  },
  (err) => {
    // 4. 处理401错误
    return Promise.reject(err)
  }
)

export default instance