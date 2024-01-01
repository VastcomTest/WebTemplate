const SYSTEM_NAME = "v3-admin-vite"

/** 缓存数据时用到的 Key */
class CacheKey {
  
  static readonly CONFIG_LAYOUT = `${SYSTEM_NAME}-config-layout-key`
  static readonly SIDEBAR_STATUS = `${SYSTEM_NAME}-sidebar-status-key`
  static readonly ACTIVE_THEME_NAME = `${SYSTEM_NAME}-active-theme-name-key`
  static readonly VISITED_VIEWS = `${SYSTEM_NAME}-visited-views-key`
  static readonly CACHED_VIEWS = `${SYSTEM_NAME}-cached-views-key`

  static readonly USERINFO = `${SYSTEM_NAME}-userinfo`
  static readonly REFRESH_TOKEN = `${SYSTEM_NAME}-refreshtoken-key`

  // okta
  static readonly OKTA_ID_TOKEN = `${SYSTEM_NAME}-okta-token`
  // okta authstate
  static readonly OKTA_AUTH_STATE = `${SYSTEM_NAME}-okta-auth-state`
}

export default CacheKey
