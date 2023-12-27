import { getConfigLayout } from "@/utils/local-storage"

/** 项目配置 */
export interface LayoutSettings {
  // show setting panel ?
  showSettings: boolean
  // layout mode
  layoutMode: "left" | "top" | "left-top"
  // show tags view
  showTagsView: boolean
  // show logo
  showLogo: boolean
  // show header
  fixedHeader: boolean
  // show notification
  showNotify: boolean
  // show theme
  showThemeSwitch: boolean
  // show full screen option
  showScreenfull: boolean
  // show tags view
  cacheTagsView: boolean
  
  showGreyMode: boolean
  showColorWeakness: boolean
}

export const layoutSettings: LayoutSettings = getConfigLayout() ?? {
  layoutMode: "left",
  showSettings: true,
  showTagsView: true,
  fixedHeader: true,
  showLogo: true,
  showNotify: true,
  showThemeSwitch: true,
  showScreenfull: true,
  cacheTagsView: false,
  showGreyMode: false,
  showColorWeakness: false
}
