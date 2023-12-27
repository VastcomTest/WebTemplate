import { type App } from "vue"
import { loadElementPlus } from "./element-plus"
import { loadElementPlusIcon } from "./element-plus-icon"
import { loadVxeTable } from "./vxe-table"
import { loadVuetify } from "./vuetify"

export function loadPlugins(app: App) {
  //loadVuetify(app)
  loadElementPlus(app)
  loadElementPlusIcon(app)
  loadVxeTable(app)
}
