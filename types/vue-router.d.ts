import "vue-router"

declare module "vue-router" {
  interface RouteMeta {
    /**
     * 设置该路由在侧边栏和面包屑中展示的名字
     * only for children 
     */
    title?: string
    /**
     * 设置该路由的图标，直接使用 Element Plus 的 Icon（与 svgIcon 同时设置时，svgIcon 将优先生效）
     * @link https://vuetifyjs.com/en/features/icon-fonts/#mdi-js-svg
     */
    mdiIcon?: string
    /**
     * 默认 false，设置 true 的时候该路由不会在侧边栏出现
     */
    hidden?: boolean
    /**
     * 设置该路由进入的权限，支持多个权限叠加
     */
    roles?: string[]
    /**
     * 是否缓存该路由页面
     * 默认为 false，为 true 时代表需要缓存，此时该路由和该页面都需要设置一致的 Name
     */
    keepAlive?: boolean

    sectionTitle?: string
  }
}
