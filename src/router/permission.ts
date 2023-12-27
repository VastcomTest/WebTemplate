import router from "@/router"
import { useUserStoreHook } from "@/store/modules/user"
import { usePermissionStoreHook } from "@/store/modules/permission"
import { ElMessage } from "element-plus"
import asyncRouteSettings from "@/config/async-route"
import isWhiteList from "@/config/white-list"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import { LoginCallback, navigationGuard } from '@okta/okta-vue'
import CacheKey from "@/constants/cache-key"
import { IService } from "@/service/Index"
NProgress.configure({ showSpinner: false })
//router.beforeEach(navigationGuard)
router.beforeEach(async(to, _from, next) => {
  
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()
  const token = userStore.userAuth?.token
  const refreshToken = localStorage.getItem(CacheKey.REFRESH_TOKEN)
  if (refreshToken) {
    if(!token){
      const res = await userStore.refreshToken()
      if(!res){
        // refresh token expired
        localStorage.removeItem(CacheKey.REFRESH_TOKEN)
        next("/login")
      }
      permissionStore.setRoutes(userStore.userAuth?.permissions!)
      permissionStore.dynamicRoutes.forEach((route) => {
        router.addRoute(route)
      })
      next({ ...to, replace: true })
    } else {
      next()
    }
  } else {
    // 如果没有 Token
    if (isWhiteList(to)) {
      next()
    } else {
      next("/login")
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
