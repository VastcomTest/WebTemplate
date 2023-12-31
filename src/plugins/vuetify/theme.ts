import themeCss from '@/styles/theme/tokens.css?raw'

const themeTemp = themeCss.split("\n").map(v=>v.substring(2,v.length-1))
const themeRows = themeTemp.slice(3,themeTemp.length-1)
function getVar(name: string) {
  const str = `--md-sys-color-${name}`
  let color = themeRows.find(v=>v.includes(str))?.split(":")[1].trim()
  return color
}
const theme = {
  defaultTheme: 'light',
  themes: {
    light: {
      dark: false,
      colors: {
        // need to update
        //'primary': '#7e5700',
        'primary': getVar('primary-light'),
        'secondary': getVar('secondary-light'),
        'background': getVar('background-light'),
        'surface': getVar('surface-light'),
        'surface-container':getVar('surface-container-light'),
        "secondary-container": getVar('secondary-container-light'),
        "on-secondary-container":getVar('on-secondary-container-light'),
        "on-surface": getVar('on-surface-light'),
        // default
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
        // update below
        'surface-container':getVar('surface-container-light'),
        "secondary-container": getVar('secondary-container-light'),
        // ....

        'border-color': '#3A3541',
        'medium-emphasis-opacity': 0.68,
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
        'primary': getVar('primary-dark'),
        'secondary': getVar('secondary-dark'),
        'background': getVar('background-dark'),
        'surface': getVar('surface-dark'),
        'surface-container': getVar('surface-container-dark'),
        "secondary-container": getVar('secondary-container-dark'),
        "on-secondary-container": getVar('on-secondary-container-dark'),
        'on-surface': getVar('on-surface-dark'),
        'on-primary': getVar('on-primary-dark'),
        // default
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
        // update below
        'surface-container': getVar('surface-container-dark'),
        "secondary-container": getVar('secondary-container-dark'),
        // ...
        'border-color': '#E7E3FC',
        'medium-emphasis-opacity': 0.68,
        // Shadows
        'shadow-key-umbra-opacity': 'rgba(20, 18, 33, 0.08)',
        'shadow-key-penumbra-opacity': 'rgba(20, 18, 33, 0.12)',
        'shadow-key-ambient-opacity': 'rgba(20, 18, 33, 0.04)',
      },
    },
  },
}



export default theme
