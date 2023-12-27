import { Icon } from '@iconify/vue'
import { h } from 'vue'
import type { IconProps, IconSet } from 'vuetify'
import { aliases } from 'vuetify/lib/iconsets/mdi.mjs'

export const iconify: IconSet = {
  //@ts-ignore
  component: (props: IconProps) => h(Icon, props),
}

export const icons = {
  defaultSet: 'iconify',
  aliases,
  sets: {
    iconify,
  },
}
