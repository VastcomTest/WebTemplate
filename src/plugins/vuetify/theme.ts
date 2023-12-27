import type { VuetifyOptions  } from 'vuetify'

const theme = {
  defaultTheme: 'light',
  themes: {
    light: {
      dark: false,
      colors: {
        // need to update
        'primary': '#7e5700',
        'secondary': '#6e5c3f',
        'background': '#fffbff',
        'surface': '#fff8f3',
        'surface-container':'#f5ece4',
        "secondary-container": "#f8dfbb",
        "on-secondary-container":"#261904",
        "on-surface": '#1f1b16',
        'success': '#56CA00',
        'error': '#FF4C51',
        
        // 'primary': '#7e5700',
        // 'secondary': '#6e5c3f',
        // 'surface': '#fff8f3',
        // 'background': '#fff8f3',

        // 'primary':'#316B25',
        // 'secondary':'#54634D',
        // 'surface':'#FAFAF3',
        // 'background':'#FAFAF3',

        // default ?
        'on-secondary': '#fff',
        'info': '#16B1FF',
        'warning': '#FFB400',
        'on-primary': '#FFFFFF',
        'on-success': '#FFFFFF',
        'on-warning': '#FFFFFF',
        'on-background': '#3A3541',
        'grey-50': '#FAFAFA',
        'grey-100': '#F5F5F5',
        'grey-200': '#EEEEEE',
        'grey-300': '#E0E0E0',
        'grey-400': '#BDBDBD',
        'grey-500': '#9E9E9E',
        'grey-600': '#757575',
        'grey-700': '#616161',
        'grey-800': '#424242',
        'grey-900': '#212121',
      },

      variables: {
        'border-color': '#3A3541',
        'medium-emphasis-opacity': 0.68,
        // update below
        'surface-container':'#f5ece4',
        "secondary-container": "#f8dfbb",
        //'surface-container': '#f5ece4',
        //'surface-container':'#EEEEE8',
        // Shadows
        'shadow-key-umbra-opacity': 'rgba(var(--v-theme-on-surface), 0.08)',
        'shadow-key-penumbra-opacity': 'rgba(var(--v-theme-on-surface), 0.12)',
        'shadow-key-ambient-opacity': 'rgba(var(--v-theme-on-surface), 0.04)',
      },
    },
    dark: {
      dark: true,
      colors: {
        'primary': '#fabc49',
        'secondary': '#dbc3a1',
        'background': '#1f1b16',
        'surface': '#16130e',
        'surface-container':'#231f1a',
        "secondary-container": "#54442a",
        "on-secondary-container":"#f8dfbb",
        'on-surface': '#cdc5bd',
        'on-primary': '#422c00',
        'success': '#56CA00',
        'error': '#FF4C51',
        // 'primary': '#fabc49',
        // 'secondary': '#dbc3a1',
        // 'surface': '#16130e',
        // 'background': '#16130e',

        // 'primary': '#97D783',
        // 'secondary': '#BBCBB1',
        // 'surface': '#121410',
        // 'background': '#121410',
        
        'on-secondary': '#fff',
        
        'info': '#16B1FF',
        'warning': '#FFB400',
        
        
        'on-success': '#FFFFFF',
        'on-warning': '#FFFFFF',
        'on-background': '#E7E3FC',
        'grey-50': '#2A2E42',
        'grey-100': '#2F3349',
        'grey-200': '#4A5072',
        'grey-300': '#5E6692',
        'grey-400': '#7983BB',
        'grey-500': '#8692D0',
        'grey-600': '#AAB3DE',
        'grey-700': '#B6BEE3',
        'grey-800': '#CFD3EC',
        'grey-900': '#E7E9F6',
      },
      variables: {
        'border-color': '#E7E3FC',
        'medium-emphasis-opacity': 0.68,
        // update below
        'surface-container':'#231f1a',
        "secondary-container": "#54442a",
        //'surface-container': '#231f1a',
        //'surface-container':'#1E201C',

        // Shadows
        'shadow-key-umbra-opacity': 'rgba(20, 18, 33, 0.08)',
        'shadow-key-penumbra-opacity': 'rgba(20, 18, 33, 0.12)',
        'shadow-key-ambient-opacity': 'rgba(20, 18, 33, 0.04)',
      },
    },
  },
}



export default theme
