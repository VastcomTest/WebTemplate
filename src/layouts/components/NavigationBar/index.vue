<script lang="ts" setup>
import { ComponentInternalInstance, computed } from "vue"
import { useRouter } from "vue-router"
import { storeToRefs } from "pinia"
import { useAppStore } from "@/store/app"
import { useSettingsStore } from "@/store/settings"
import { useUserStore } from "@/store/user"
import { UserFilled } from "@element-plus/icons-vue"
import Hamburger from "../Hamburger/index.vue"
import Breadcrumb from "../Breadcrumb/index.vue"
import Sidebar from "../Sidebar/index.vue"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import Screenfull from "@/components/Screenfull/index.vue"
import Notify from "@/components/Notify/index.vue"
import { DeviceEnum } from "@/constants/app-key"
import { useTagsViewStore } from "@/store/tags-view"
import { getCurrentInstance } from "vue"
import { use } from "vxe-table"

const router = useRouter()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const userStore = useUserStore()
const tabsStore = useTagsViewStore()
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const { sidebar, device } = storeToRefs(appStore)
const { layoutMode, showNotify, showThemeSwitch, showScreenfull } = storeToRefs(settingsStore)
const { userAuth } = storeToRefs(userStore)
const isTop = computed(() => layoutMode.value === "top")
const isMobile = computed(() => device.value === DeviceEnum.Mobile)
/** 切换侧边栏 */
const toggleSidebar = () => {
  appStore.toggleSidebar(false)
}

/** 登出 */
const logout = async () => {
  let accessToken = proxy?.$auth.getAccessToken()
  if(accessToken){
    // const idToken = proxy?.$auth.tokenManager.getTokensSync()?.idToken
    // const authState = proxy?.$auth.authStateManager.getAuthState()
    proxy?.$auth.signOut()
    userStore.logout()
    return
  }
  userStore.logout()
  router.push("/auth/login")

}
</script>

<template>
  <div class="navigation-bar">
    <Hamburger v-if="!isTop || isMobile" :is-active="sidebar.opened" class="hamburger" @toggle-click="toggleSidebar" />
    <Breadcrumb class="breadcrumb" /> 
    <Sidebar v-if="isTop && !isMobile" class="sidebar" />
    <div class="right-menu">
      <Screenfull v-if="showScreenfull" class="right-menu-item" />
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            class="ma-2"
            variant="text"
            icon="mdi-account-circle"
            v-bind="props"
          />
        </template>
          <v-card elevation="10" style="padding: 15px;display: flex;flex-direction: column;gap: 5px;">
            <h3 style="text-align: left;">Admin MES</h3>
            <div style="margin-bottom: 10px;">{{ userAuth?.email }}</div>
            <div @click="logout" 
            style="gap: 0px;
            cursor: pointer;;display: flex;
            ">
              <v-icon icon="mdi-logout"></v-icon>
              <div>Logout</div>
            </div>
          </v-card>
      </v-menu>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navigation-bar {
  height: var(--v3-navigationbar-height);
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  background-color: var(--v-theme-surface);
  transition: background-color 0.35s ease;
  .hamburger {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 15px;
    cursor: pointer;
  }
  .breadcrumb {
    flex: 1;
    // 参考 Bootstrap 的响应式设计将宽度设置为 576
    @media screen and (max-width: 576px) {
      display: none;
    }
  }
  .sidebar {
    flex: 1;
    // 设置 min-width 是为了让 Sidebar 里的 el-menu 宽度自适应
    min-width: 0px;
    :deep(.el-menu) {
      background-color: transparent;
    }
    :deep(.el-sub-menu) {
      &.is-active {
        .el-sub-menu__title {
          color: var(--el-menu-active-color) !important;
        }
      }
    }
  }
  .right-menu {
    margin-right: 10px;
    height: 100%;
    display: flex;
    align-items: center;
    color: #606266;
    .right-menu-item {
      padding: 0 10px;
      cursor: pointer;
      .right-menu-avatar {
        display: flex;
        align-items: center;
        .el-avatar {
          margin-right: 10px;
        }
        span {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
