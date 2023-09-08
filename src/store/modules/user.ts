import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { usePermissionStore } from "./permission"
import { useTagsViewStore } from "./tags-view"
import { useSettingsStore } from "./settings"
import { getToken, removeToken, setToken } from "@/utils/cache/cookies"
import router, { resetRouter } from "@/router"
import { loginApi, getUserInfoApi } from "@/api/login"
import { type LoginRequestData } from "@/api/login/types/login"
import { type RouteRecordRaw } from "vue-router"
import asyncRouteSettings from "@/config/async-route"
import { uniqueId } from "lodash-es"


export type Role = 'admin' | 'user' | 'approver'

export const useUserStore = defineStore("user", () => {
  const roles = ref<Role[]>([])
  const username = ref<string>("")
  //const permissionStore = usePermissionStore()
  const tagsViewStore = useTagsViewStore()
  const settingsStore = useSettingsStore()

  /** 设置角色数组 */
  const setRoles = (value: Role[]) => {
    roles.value = value
  }
  /** 登录 */
  const login = async ({ username, password }: LoginRequestData) => {
    //const { data } = await loginApi({ username, password })
    setToken(uniqueId())
    localStorage.setItem('role',username)
  }
  /** 登出 */
  const logout = () => {
    removeToken()
    roles.value = []
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

  return { roles, username, setRoles, login, logout }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
