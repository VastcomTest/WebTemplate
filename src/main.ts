// core
import { createApp } from "vue"
import App from "@/App.vue"
import store from "@/store"
import router from "@/router"
import "@/router/permission"
// load
import { loadSvg } from "@/icons"
import { loadPlugins } from "@/plugins"
import { loadDirectives } from "@/directives"
// css
import "uno.css"
import "normalize.css"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "vxe-table/lib/style.css"
import "vxe-table-plugin-element/dist/style.css"
import "@/styles/index.scss"
// okta
import { OktaAuth } from '@okta/okta-auth-js'
import OktaVue from '@okta/okta-vue'
import sampleConfig from '@/config/okta'
import { loadVuetify} from "./plugins/vuetify"

const app = createApp(App)
const oktaAuth = new OktaAuth(sampleConfig.oidc)

loadPlugins(app)
loadSvg(app)
loadDirectives(app)
loadVuetify(app)

app.use(store).use(router).use(OktaVue, { oktaAuth })
router.isReady().then(() => {
  setTimeout(()=>{
    app.mount("#app")
  },1000)
})
