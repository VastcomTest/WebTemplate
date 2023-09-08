import router from "@/router"
import { Role, useUserStoreHook } from "@/store/modules/user"
import { usePermissionStoreHook } from "@/store/modules/permission"
import { ElMessage } from "element-plus"
import { getToken } from "@/utils/cache/cookies"
import asyncRouteSettings from "@/config/async-route"
import isWhiteList from "@/config/white-list"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()
  // 判断该用户是否登录
  if (getToken()) {
    if (userStore.roles.length === 0) {
      // @ts-ignore
      const role :Role = localStorage.getItem('role')
      const roles:Role[] = [role]
      userStore.setRoles(roles)
      // 根据角色生成可访问的 Routes（可访问路由 = 常驻路由 + 有访问权限的动态路由）
      permissionStore.setRoutes(roles)
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
      // 如果在免登录的白名单中，则直接进入
      next()
    } else {
      // 其他没有访问权限的页面将被重定向到登录页面
      next("/login")
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
