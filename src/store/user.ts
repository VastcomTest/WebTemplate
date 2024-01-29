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
import { IService } from "@/service"
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
    userAuth.value = data
    permissionStore.setRoutes(data.permissions)
    localStorage.setItem(CacheKey.REFRESH_TOKEN,data.refreshToken)
  }


  const oktaLogin = async (oktaAccountId: string, accessToken: string) => {
    try{
      const { data } = await IService.authservice.oktaLogin(oktaAccountId, accessToken)
      userAuth.value = data
      permissionStore.setRoutes(data.permissions)
      localStorage.setItem(CacheKey.REFRESH_TOKEN,data.refreshToken)
    }catch(error:any){
      throw error
    }
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


  const logout = async () => {
    // check whether the user login with okta
    // remove okta token
    localStorage.removeItem(CacheKey.OKTA_ID_TOKEN)
    // remove okta auth state
    localStorage.removeItem(CacheKey.OKTA_AUTH_STATE)

    localStorage.removeItem(CacheKey.REFRESH_TOKEN)
    //await IService.authservice.logout()
    userAuth.value = undefined
    resetRouter()
  }
  /** 重置 Visited Views 和 Cached Views */
  const _resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews()
      tagsViewStore.delAllCachedViews()
    }
  }

  return { userAuth,oktaLogin,refreshToken,login, logout ,setUserAuth}
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
