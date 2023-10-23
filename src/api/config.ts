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
          error.message = "Request Error"
          break
        case 401:
          // useUserStoreHook().logout()
          // token expired
          location.reload()
          break
        case 403:
          error.message = "Access Refuesd"
          break
        case 404:
          error.message = "Wrong Request URL"
          break
        case 408:
          error.message = "Request timeout"
          break
        case 500:
          error.message = "Service internal error"
          break
        case 501:
          error.message = "Service not impletement"
          break
        case 502:
          error.message = "Gateway error"
          break
        case 503:
          error.message = "Service is not available"
          break
        case 504:
          error.message = "Gateway timeout"
          break
        case 505:
          error.message = "Not support HTTP Version"
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
