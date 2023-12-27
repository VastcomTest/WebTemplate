<script lang="ts" setup>
import { computed } from "vue"
import { storeToRefs } from "pinia"
import { useAppStore } from "@/store/app"
import { useSettingsStore } from "@/store/settings"
import { AppMain, NavigationBar, Sidebar, TagsView } from "./components"
import { DeviceEnum } from "@/constants/app-key"
import { watchEffect } from "vue"

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const { showTagsView, fixedHeader } = storeToRefs(settingsStore)

/** 定义计算属性 layoutClasses，用于控制布局的类名 */
const layoutClasses = computed(() => {
  return {
    hideSidebar: !appStore.sidebar.opened,
    openSidebar: appStore.sidebar.opened,
    //withoutAnimation: appStore.sidebar.withoutAnimation,
    mobile: appStore.device === DeviceEnum.Mobile
  }
})

const zindex = computed(() => appStore.sidebar.zindex)
</script>

<template>
  <div :class="layoutClasses" class="app-wrapper">
    <Sidebar  />
    <div :style="{ zIndex: zindex  }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }" class="layout-header">
        <NavigationBar />
      </div>
      <AppMain class="app-main" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";
$transition-time: 0.35s;
.app-wrapper {
  @include clearfix;
  position: relative;
  width: 100%;
  height: 100%;
}

.drawer-bg {
  background-color: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.sidebar-container {
  background-color: var(--v3-sidebar-menu-bg-color);
  transition: width $transition-time ease 0s;
  // width: var(--v3-sidebar-width) !important;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

.main-container {
  min-height: 100%;
  height: 100%;
  transition: width $transition-time ease 0s;
  width: calc(100% - var(--v3-sidebar-width));
  position: absolute;
  top: var(--v3-navigationbar-height);
  right: 0;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  width: calc(100% - var(--v3-sidebar-width));
  transition: width $transition-time ease 0s;
}

.layout-header {
  box-shadow: var(--el-box-shadow-lighter);
}

.app-main {
  min-height: calc(100vh - var(--v3-navigationbar-height));
  background-color: rgb(var(--v-theme-surface));
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  height: 100vh;
  overflow: auto;
}

.hasTagsView {
  .app-main {
    min-height: calc(100vh - var(--v3-header-height));
  }
  .fixed-header + .app-main {
    padding-top: var(--v3-header-height);
  }
}

.hideSidebar {
  .sidebar-container {
    width: var(--v3-sidebar-hide-width) !important;
  }
  .main-container {
    width: calc(100% - var(--v3-sidebar-hide-width));
  }
  .fixed-header {
    width: calc(100% - var(--v3-sidebar-hide-width));
  }
}

// 适配 mobile 端
.mobile {
  .sidebar-container {
    transition: transform $transition-time;
    width: var(--v3-sidebar-width) !important;
  }
  .main-container {
    margin-left: 0px;
    width: 100%;
  }
  .fixed-header {
    width: 100%;
    background-color: rgb(var(--v-theme-surface))
  }
  &.openSidebar {
    position: fixed;
    top: 0;
  }
  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(calc(0px - var(--v3-sidebar-width)), 0, 0);
    }
  }
}

.withoutAnimation {
  .sidebar-container,
  .main-container {
    transition: none;
  }
}
</style>
