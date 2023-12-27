<script lang="ts" setup>
import { computed } from "vue"
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
const router = useRouter()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const userStore = useUserStore()
const tabsStore = useTagsViewStore()
const { sidebar, device } = storeToRefs(appStore)
const { layoutMode, showNotify, showThemeSwitch, showScreenfull } = storeToRefs(settingsStore)

const isTop = computed(() => layoutMode.value === "top")
const isMobile = computed(() => device.value === DeviceEnum.Mobile)

/** 切换侧边栏 */
const toggleSidebar = () => {
  appStore.toggleSidebar(false)
}

/** 登出 */
const logout = () => {
  userStore.logout()
  tabsStore.delAllVisitedViews()
  tabsStore.delAllCachedViews()
  router.push("/login")

}
</script>

<template>
  <div class="navigation-bar">
    <Hamburger v-if="!isTop || isMobile" :is-active="sidebar.opened" class="hamburger" @toggle-click="toggleSidebar" />
    <Breadcrumb class="breadcrumb" /> 
    <Sidebar v-if="isTop && !isMobile" class="sidebar" />
    <div class="right-menu">
      <Screenfull v-if="showScreenfull" class="right-menu-item" />
      <!-- <ThemeSwitch   class="right-menu-item" /> -->
      <!-- <Notify v-if="showNotify" class="right-menu-item" /> -->
      <el-dropdown class="right-menu-item">
        <div class="right-menu-avatar">
          <el-avatar :icon="UserFilled" :size="30" />
          <!-- <span>{{ userStore.userAuth?.firstName }}</span> -->
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item divided @click="logout">
              <span style="display: block">Logout</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
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
