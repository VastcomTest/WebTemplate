import { createVuetify } from 'vuetify'
import defaults from './defaults'
import { icons } from './icons'
import theme from './theme'

// Styles
//import '@core/scss/libs/vuetify/index.scss'
import 'vuetify/styles'
import { App } from 'vue'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export const vuetify =  createVuetify({
  components,
  directives,
  icons,
  theme,
})

export function loadVuetify(app:App){
  app.use(vuetify)
}