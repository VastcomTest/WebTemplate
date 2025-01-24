import router from "@/router"
import { useUserStoreHook } from "@/store/user"
import { usePermissionStoreHook } from "@/store/permission"
import { ElMessage } from "element-plus"
import asyncRouteSettings from "@/config/async-route"
import isWhiteList from "@/config/white-list"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import { LoginCallback, navigationGuard } from '@okta/okta-vue'
import CacheKey from "@/constants/cache-key"
import { IService } from "@/service"
import useStore from "element-plus/es/components/table/src/store"
import { log } from "console"
//NProgress.configure({ showSpinner: false })
//router.beforeEach(navigationGuard)
let path = "";

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
        next("/auth/login?redirect=" + to.fullPath)
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
      console.log(to);
      
      next("/auth/login?redirect=" + to.fullPath)
    }
  }
})

// router.afterEach(() => {
//   NProgress.done()
// })
