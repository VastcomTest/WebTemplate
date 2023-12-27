import { ref, watchEffect } from "vue"
import { getActiveThemeName, setActiveThemeName } from "@/utils/local-storage"
import theme from '@/plugins/vuetify/theme'
import { VuetifyOptions } from "vuetify/lib/framework.mjs"

const DEFAULT_THEME_NAME = "normal"
type DefaultThemeName = typeof DEFAULT_THEME_NAME

/** 注册的主题名称, 其中 DefaultThemeName 是必填的 */
export type ThemeName = DefaultThemeName | "dark" | "light"

interface ThemeList {
  title: string
  name: ThemeName,
  themeSetting: typeof theme.themes.dark
}

/** 主题列表 */
const themeList: ThemeList[] = [
  {
    title: "Light",
    name: "light",
    // @ts-ignore
    themeSetting: theme.themes.light
  },
  {
    title: "Dark",
    name: "dark",
    // @ts-ignore
    themeSetting: theme.themes.drak
  },
  
]

/** 正在应用的主题名称 */
const activeThemeName = ref<ThemeName>(getActiveThemeName() || DEFAULT_THEME_NAME)

/** 设置主题 */
const setTheme = (value: ThemeName) => {
  activeThemeName.value = value
}

/** 在 html 根元素上挂载 class */
const setHtmlRootClassName = (value: ThemeName) => {
  document.documentElement.className = value
}

/** 初始化 */
const initTheme = () => {
  // watchEffect 来收集副作用
  watchEffect(() => {
    const value = activeThemeName.value
    setHtmlRootClassName(value)
    setActiveThemeName(value)
  })
}

/** 主题 hook */
export function useTheme() {
  return { themeList, activeThemeName, initTheme, setTheme }
}
