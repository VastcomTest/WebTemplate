import { getToken } from '@/utils/cache/cookies'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { get } from 'lodash-es'

const baseUrl = 'http://127.0.0.1:8087/'

const http = axios.create({
  baseURL: baseUrl,
  timeout: 3000,
  
})

// request interceptor
axios.interceptors.request.use(config=>{
  const token = getToken()
  if(token){
    config.headers.Authorization =  `Bearer ${token}`
  }

  return config;
},err=>err)

// reponse interceptor
axios.interceptors.response.use(
  res=>res,
  error=>{
    const status = get(error, "response.status")
      switch (status) {
        case 400:
          error.message = "请求错误"
          break
        case 401:
          // Token 过期时，直接退出登录并强制刷新页面（会重定向到登录页）
          // useUserStoreHook().logout()
          location.reload()
          break
        case 403:
          error.message = "拒绝访问"
          break
        case 404:
          error.message = "请求地址出错"
          break
        case 408:
          error.message = "请求超时"
          break
        case 500:
          error.message = "服务器内部错误"
          break
        case 501:
          error.message = "服务未实现"
          break
        case 502:
          error.message = "网关错误"
          break
        case 503:
          error.message = "服务不可用"
          break
        case 504:
          error.message = "网关超时"
          break
        case 505:
          error.message = "HTTP 版本不受支持"
          break
        default:
          break
      }
      ElMessage.error(error.message)
      return Promise.reject(error)
  }
)

export {
    baseUrl,
    http
}
