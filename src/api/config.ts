import apiConfig from '@/config/api'
import CacheKey from '@/constants/cache-key'
import { useUserStoreHook } from '@/store/user'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { get } from 'lodash-es'
//const baseUrl = 'https://vastcom-mgm.azurewebsites.net'
const baseUrl = apiConfig.apiUrl
const http = axios.create({
  baseURL: baseUrl,
  timeout: 3000,
})

// request interceptor
http.interceptors.request.use(config=>{
  const userStore = useUserStoreHook()
  const token = userStore.userAuth?.token
  if(token){
    config.headers.Authorization =  `Bearer ${token}`
  }
  return config;
},err=>err)

// reponse interceptor
http.interceptors.response.use(
  res=>{   
    return res
  },
  async error =>{
    const status = get(error, "response.status")
      switch (status) {
        case 400:
          error.message = "Request Error"
          break
        case 401:
          const originalRequest = error.config
          const userStore = useUserStoreHook()
          if (!originalRequest._retry) {
            originalRequest._retry = true
            const res = await userStore.refreshToken()
            if(res) return http(originalRequest)
            ElMessage.warning("Refresh token has expired, please login again")
            return Promise.reject("Refresh token has expired, please login again")
          } 


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
      ElMessage.error(error.response.data)
      return Promise.reject(error)
  }
)



export {
    baseUrl,
    http
}
