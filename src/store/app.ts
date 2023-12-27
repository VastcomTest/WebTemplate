import { ExcelUtil } from '../utils/excel';
import { computed, reactive, ref, watch } from "vue"
import { defineStore } from "pinia"
import { getSidebarStatus, setSidebarStatus } from "@/utils/local-storage"
import { DeviceEnum, SIDEBAR_OPENED, SIDEBAR_CLOSED } from "@/constants/app-key"

interface Sidebar {
  opened: boolean
  withoutAnimation: boolean
  mobileIsCollapse: boolean,
  zindex:number
}

/** 设置侧边栏状态本地缓存 */
function handleSidebarStatus(opened: boolean) {
  
  opened ? setSidebarStatus(SIDEBAR_OPENED) : setSidebarStatus(SIDEBAR_CLOSED)
}

export const useAppStore = defineStore("app", () => {
  /** 侧边栏状态 */
  const sidebar: Sidebar = reactive({
    opened: getSidebarStatus() !== SIDEBAR_CLOSED,
    withoutAnimation: false,
    mobileIsCollapse:false,
    zindex: 9999
  })
  /** 设备类型 */
  const device = ref<DeviceEnum>(DeviceEnum.Desktop)

  const isMobile = computed(() => device.value === DeviceEnum.Mobile)

  

  /** 切换侧边栏 */
  const toggleSidebar = (withoutAnimation: boolean) => {
    sidebar.withoutAnimation = withoutAnimation
    if(device.value === DeviceEnum.Mobile){
      sidebar.mobileIsCollapse = !sidebar.mobileIsCollapse
    }else{
      sidebar.opened = !sidebar.opened
    }
  }
  /** 关闭侧边栏 */
  const closeSidebar = (withoutAnimation: boolean) => {
    sidebar.opened = false
    sidebar.withoutAnimation = withoutAnimation
  }
  /** 切换设备类型 */
  const toggleDevice = (value: DeviceEnum) => {
    if(value != device.value && !sidebar.opened){
      sidebar.opened = true
    }
    device.value = value
  }

  return { device, sidebar, toggleSidebar, closeSidebar, toggleDevice }
})
