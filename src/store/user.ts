import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { usePermissionStore } from "./permission"
import { useTagsViewStore } from "./tags-view"
import { useSettingsStore } from "./settings"
import router, { resetRouter } from "@/router"
import { useRouter, type RouteRecordRaw } from "vue-router"
import asyncRouteSettings from "@/config/async-route"
import { uniqueId } from "lodash-es"
import { IService } from "@/service/Index"
import { Permission } from "@/models/permission"
import CacheKey from "@/constants/cache-key"
import { UserAuth } from "@/models/user-auth"
import { ElMessage } from "element-plus"


export const useUserStore = defineStore("user", () => {
  const userAuth = ref<UserAuth>()
  const tagsViewStore = useTagsViewStore()
  const settingsStore = useSettingsStore()
  const permissionStore = usePermissionStore()

  const setUserAuth = (temp: UserAuth) => userAuth.value = temp

  const login = async ({ username, password }: {username:string,password:string}) => {
    const { data } = await IService.authservice.login({ username,password})
    // const { data:res} = await IService.userservice.getUsersByCondition(username)
    // const userInfo = res.data[0]
    userAuth.value = data
    permissionStore.setRoutes(data.permissions)
    localStorage.setItem(CacheKey.USERINFO,JSON.stringify(data))
    localStorage.setItem(CacheKey.REFRESH_TOKEN,data.refreshToken)
  }

  const refreshToken = async ()=>{
    const refreshToken = localStorage.getItem(CacheKey.REFRESH_TOKEN)
    if(refreshToken ==null) return false
    try {
      const { data } = await IService.authservice.refreshToken(refreshToken)
      userAuth.value = data
      localStorage.setItem(CacheKey.REFRESH_TOKEN,data.refreshToken)
      return true
    } catch (error: any) {
      return false;
    }
  }


  const logout = () => {
    localStorage.removeItem(CacheKey.REFRESH_TOKEN)
    userAuth.value = undefined
    resetRouter()
    _resetTagsView()
  }
  /** 重置 Visited Views 和 Cached Views */
  const _resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews()
      tagsViewStore.delAllCachedViews()
    }
  }

  return { userAuth,refreshToken,login, logout ,setUserAuth}
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
