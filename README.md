# Front-end Template (vastcom)
<div align="center">
    <img width="220" src="https://raw.githubusercontent.com/Dannyolly/Dan/master/home.png">
</div>

<h1 align="center">
    Dan
</h1>

<h3 align="center">
    Front-end Template ( Internal Vue Template )
</h3>

## Template include below function

- Axios wrapper - interceptor (include auth)
- Error page - 403 , 404
- Router ( default router , Dynamic router , Guard)
- Provide role-based access control ( directive and function )
- Provide Base layout
- Provide different layout (Left Mode , Left Top Mode and Top Mode)
- Theme (light , dark and deep blue)
- Custom Setting
- Element Plus and VXEtables
- Component Store (pinia)
- Utils and hooks

## Project Structure

![Untitled](Front-end%20Template%20e52ca469df574712817b86eab71266c4/Untitled.png)

## Axios wrapper

> API CONFIG
> 

```tsx
// api/config.ts

const baseUrl = 'http://127.0.0.1:8087/'

const http = axios.create({
  baseURL: baseUrl,
  timeout: 3000,

})

// request interceptor
axios.interceptors.request.use(config=>{
  const token = getToken()
  if(token){
    config.headers.Authorization =  `Bearer ${token}`
  }
  return config;
},err=>err)

// reponse interceptor
axios.interceptors.response.use(
  res=>res,
  error=>{
    const status = get(error, "response.status")
      switch (status) {
        ...
      }
      ElMessage.error(error.message)
      return Promise.reject(error)
  }
)
```

> GET POST
> 

```tsx
// api/request.ts
export type Response<T> = AxiosResponse<T>

export function get<T extends Object>(url:string,data?:Object):Promise<Response<T>>{
    if(!data){
        return http.get(url);
    }
    return http.get(url+'?'+objTOParams(data))
}

export function post<T>(url:string,data:object):Promise<Response<T>>{
    return axios.post(url,data)
}
```

## Error page - 403 , 404

> views/error-page
> 

```html
<template>
  <div class="error-page">
    <div class="error-page-svg">
      <slot />
    </div>
    <router-link to="/">
      <el-button type="primary">回到首页</el-button>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &-svg {
    width: 400px;
    margin-bottom: 50px;
  }
}
</style>
```

```html
<script lang="ts" setup>
import ErrorPageLayout from "./components/ErrorPageLayout.vue"
import Svg403 from "@/assets/error-page/403.svg?component" 
</script>

<template>
  <ErrorPageLayout>
    <Svg403 />
  </ErrorPageLayout>
</template>
```

```html
<script lang="ts" setup>
import ErrorPageLayout from "./components/ErrorPageLayout.vue"
import Svg404 from "@/assets/error-page/404.svg?component" 
</script>

<template>
  <ErrorPageLayout>
    <Svg404 />
  </ErrorPageLayout>
</template>
```

## Router

### Default Router

> router/index.ts
> 

```tsx
// base layout
const Layouts = () => import("@/layouts/index.vue")

export const constantRoutes: RouteRecordRaw[] = [
  {
    path:'/',
    redirect:'timeline',
    component:Layouts,
    meta:{
      hidden:true

    },
    children:[{
        path:'timeline',
        component:()=>import("@/views/timeline/index.vue"),
        name:"timeline",
        meta:{
          title:'timeline',

        }
      }
    ]
  },
	...
]
```

### Dynamic Router

> router/index.ts
> 

```tsx
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/form",
    component: Layouts,
    //redirect: "/table/element-plus",
    name: "Form",
    meta: {
      title: "Form",
      elIcon: "Grid",
			// role based access control for page
      roles:['admin','user']
    },
    children: [
      {
        path: "goodOrService",
        component: () => import("@/views/table/GoodOrService/index.vue"),
        name: "GoodOrService",
        meta: {
          title: "Good / Service",
					// caching
          keepAlive: true
        }
      }
			... 
    ]
  }
]
```

> Other router function and setting
> 

```tsx
const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === "hash"
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes
})

export function resetRouter() {
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    window.location.reload()
  }
}
```

## Router Guard

> router/permission.ts
> 

> This callback is for processing token and dynamic route
> 

```tsx

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()
  // logined? 
  if (getToken()) {
    if (userStore.roles.length === 0) {
      // @ts-ignore
      const role :Role = localStorage.getItem('role')
      const roles:Role[] = [role]
      userStore.setRoles(roles)
      // set roles
      permissionStore.setRoutes(roles)
      permissionStore.dynamicRoutes.forEach((route) => {
        router.addRoute(route)
      })
      next({ ...to, replace: true })
    } else {
      next()
    }
  } else {
    if (isWhiteList(to)) {
      next()
    } else {
      next("/login")
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
```

## Role-based access control

> Except for router RBAC , this template also provide directive and function RBAC
> 

> Directive
> 

```html
<Component v-permission="['admin',editor']"></Component>
```

> Function
> 

```tsx
import { useUserStoreHook } from "@/store/modules/user"

export const checkPermission = (permissionRoles: string[]): boolean => {
  if (Array.isArray(permissionRoles) && permissionRoles.length > 0) {
    const { roles } = useUserStoreHook()
    return roles.some((role) => permissionRoles.includes(role))
  } else {
    console.error("need roles! Like checkPermission(['admin','editor'])")
    return false
  }
}
```

## Base layout

### Side bar

![Untitled](Front-end%20Template%20e52ca469df574712817b86eab71266c4/Untitled%201.png)

> components/sidebar/index.ts (side bar)
> 

```tsx
<template>
  <div :class="{ 'has-logo': isLogo }">
		<!-- logo -->
    <Logo v-if="isLogo" :collapse="isCollapse" />
		<!-- side bar item  -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse && !isTop"
        :background-color="backgroundColor"
        :text-color="textColor"
        :active-text-color="activeTextColor"
        :unique-opened="true"
        :collapse-transition="false"
        :mode="isTop && !isMobile ? 'horizontal' : 'vertical'"
      >
        <SidebarItem
          v-for="route in permissionStore.routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-collapse="isCollapse"
          :is-top="isTop"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
```

### Header navigation

> Header is consist of two components ( Navigation bar and tags view )
> 

### Navigation bar

![Untitled](Front-end%20Template%20e52ca469df574712817b86eab71266c4/Untitled%202.png)

> Path: components/navigationbar/index.vue
> 

### Tags view

![Untitled](Front-end%20Template%20e52ca469df574712817b86eab71266c4/Untitled%203.png)

> Path: components/Tagsview/index.vue
> 

## Page different layout

> Left Mode - default
> 

![Untitled](Front-end%20Template%20e52ca469df574712817b86eab71266c4/Untitled%204.png)

> Top Mode
> 

![Untitled](Front-end%20Template%20e52ca469df574712817b86eab71266c4/Untitled%205.png)

> Left Top Mode
> 

![Untitled](Front-end%20Template%20e52ca469df574712817b86eab71266c4/Untitled%206.png)

## Theme

> Light - default
> 

![Untitled](Front-end%20Template%20e52ca469df574712817b86eab71266c4/Untitled%207.png)

> Dark
> 

![Untitled](Front-end%20Template%20e52ca469df574712817b86eab71266c4/Untitled%208.png)

> Deep Blue
> 

![Untitled](Front-end%20Template%20e52ca469df574712817b86eab71266c4/Untitled%209.png)

## Custom setting

![Untitled](Front-end%20Template%20e52ca469df574712817b86eab71266c4/Untitled%2010.png)

```tsx
interface LayoutSettings {
  // show setting panel 
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
```

## Element Plus and VXEtables

> these two component lib had already installed ,you can used it directly in project
> 

![Untitled](Front-end%20Template%20e52ca469df574712817b86eab71266c4/Untitled%2011.png)

## Component Store (pinia)

> Example
> 

```tsx

export type Role = 'admin' | 'user' | 'approver'

export const useUserStore = defineStore("user", () => {
  const roles = ref<Role[]>([])
  const username = ref<string>("")
  //const permissionStore = usePermissionStore()
  const tagsViewStore = useTagsViewStore()
  const settingsStore = useSettingsStore()

  return { roles, username, setRoles, login, logout }
})

// use it if you try to use this store from outside of setup
export function useUserStoreHook() {
  return useUserStore(store)
}
```

## Utils and Hooks

### Hooks

![Untitled](Front-end%20Template%20e52ca469df574712817b86eab71266c4/Untitled%2012.png)

> usePagination
> 

```tsx
interface DefaultPaginationData {
  total: number
  currentPage: number
  pageSizes: number[]
  pageSize: number
  layout: string
}

interface PaginationData {
  total?: number
  currentPage?: number
  pageSizes?: number[]
  pageSize?: number
  layout?: string
}

const defaultPaginationData: DefaultPaginationData = {
  total: 0,
  currentPage: 1,
  pageSizes: [10, 20, 50],
  pageSize: 10,
  layout: "total, sizes, prev, pager, next, jumper"
}

export function usePagination(initialPaginationData: PaginationData = {}) {
  /** merge parmas */
  const paginationData = reactive({ ...defaultPaginationData, ...initialPaginationData })
  /** modify cur page */
  const handleCurrentChange = (value: number) => {
    paginationData.currentPage = value
  }
  /** modify page size */
  const handleSizeChange = (value: number) => {
    paginationData.pageSize = value
  }

  return { paginationData, handleCurrentChange, handleSizeChange }
}
```

## Utils

> Cookie and localstorage
> 

> Path: Utils/cache
> 

```tsx
import CacheKey from "@/constants/cache-key"
import Cookies from "js-cookie"

export const getToken = () => {
  return Cookies.get(CacheKey.TOKEN)
}
export const setToken = (token: string) => {
  Cookies.set(CacheKey.TOKEN, token)
}
export const removeToken = () => {
  Cookies.remove(CacheKey.TOKEN)
}
```

```tsx
export type Role = 'FO' | 'approver' | 'user'
// role
export function getRole():Role{
  return localStorage.getItem('role')! as Role
}
```

### Date

```tsx
export function getCurrentDateTime(){
    const date = new Date();
    return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`+' '+`${date.getHours()}:${date.getMinutes()}`
}

export function getCurrentDate(){
  const date = new Date();
  const month =  date.getMonth() + 1 < 10 ? '0' + String(date.getMonth()+1) :String(date.getMonth()+1)
  const day = date.getDate()  < 10 ? '0' + String(date.getDate()) :String(date.getDate())
  return `${date.getFullYear()}-${month}-${day}`
}

export function getFullTime(date:Date){
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`+' '+`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export function getFormatDate(date:Date){

    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} `
}

/**
 * @description 計算日期...
 * @explain    暫時只返回X月X日
 */
 export const calculateDate = (date: Date | undefined ) => {
    if (date !== undefined) {
        const currentTime = new Date()
        const testDate = new Date(date)
        const drr = Math.abs(currentTime.getTime() - testDate.getTime());
        // @ts-ignore
        const day = parseInt(drr / (24 * 60 * 60 * 1000));
        // @ts-ignore
        const hours = parseInt(drr % (24 * 60 * 60 * 1000) / (60 * 60 * 1000));
        // @ts-ignore
        const minutes = parseInt(drr % (60 * 60 * 1000) / (60 * 1000));
        // @ts-ignore
        const seconds = parseInt(drr % (60 * 1000) / 1000);
        const res = "相差" + day + "天" + hours + "小时" + minutes + "分钟" + seconds + "秒";

        //console.log(res);
        //console.log(`${currentTime.getMonth()+1}月${currentTime.getDate()}日`);

        return `${testDate.getMonth() + 1}月${testDate.getDate()}日`
    }
    return undefined
}
```

### Excel

```tsx

import * as XLSX from 'xlsx'

export const readFile = (file:Blob) => {
  return new Promise(resolve => {
      let reader = new FileReader()
      reader.readAsBinaryString(file)
      reader.onload = ev => {
          resolve(ev.target?.result)
      }
  })
}

export class ExcelUtil{
  static export_excel(excelData:any, fileName:string) {
    try {
      // insert data to table
      const data = XLSX.utils.json_to_sheet(excelData);
      // create work book
      const wb = XLSX.utils.book_new();
      // Append a worksheet to a workbook
      XLSX.utils.book_append_sheet(wb, data, "data");
      // generated doc and download
      XLSX.writeFile(wb, fileName + ".xlsx");
    } catch (error) {
      console.log(error);
      return false
    }
    return true
  }

  static async importData<T extends object>(file:File):Promise<T>{
    let dataBinary = await readFile(file);
    let workBook = XLSX.read(dataBinary, { type: "binary", cellDates: true });
    let workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(workSheet);
    return data as unknown as T
  }
}
```

### Validate

```tsx
/** 判断是否为数组 */
export const isArray = (arg: unknown) => {
  return Array.isArray ? Array.isArray(arg) : Object.prototype.toString.call(arg) === "[object Array]"
}

/** 判断是否为字符串 */
export const isString = (str: unknown) => {
  return typeof str === "string" || str instanceof String
}

/** 判断是否为外链 */
export const isExternal = (path: string) => {
  const reg = /^(https?:|mailto:|tel:)/
  return reg.test(path)
}

/** 判断是否为网址（带协议） */
export const isUrl = (url: string) => {
  const reg = /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/
  return reg.test(url)
}

/** 判断是否为网址或 IP（带端口） */
export const isUrlPort = (url: string) => {
  const reg = /^((ht|f)tps?:\/\/)?[\w-]+(\.[\w-]+)+:\d{1,5}\/?$/
  return reg.test(url)
}

/** 判断是否为域名（不带协议） */
export const isDomain = (domain: string) => {
  const reg = /^([0-9a-zA-Z-]{1,}\.)+([a-zA-Z]{2,})$/
  return reg.test(domain)
}

/** 判断版本号格式是否为 X.Y.Z */
export const isVersion = (version: string) => {
  const reg = /^\d+(?:\.\d+){2}$/
  return reg.test(version)
}

/** 判断时间格式是否为 24 小时制（HH:mm:ss） */
export const is24H = (time: string) => {
  const reg = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/
  return reg.test(time)
}

/** 判断是否为手机号（1 开头） */
export const isPhoneNumber = (str: string) => {
  const reg = /^(?:(?:\+|00)86)?1\d{10}$/
  return reg.test(str)
}

/** 判断是否为第二代身份证（18 位） */
export const isChineseIdCard = (str: string) => {
  const reg = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/
  return reg.test(str)
}

/** 判断是否为 Email（支持中文邮箱） */
export const isEmail = (email: string) => {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(email)
}

/** 判断是否为 MAC 地址 */
export const isMAC = (mac: string) => {
  const reg =
    /^(([a-f0-9][0,2,4,6,8,a,c,e]:([a-f0-9]{2}:){4})|([a-f0-9][0,2,4,6,8,a,c,e]-([a-f0-9]{2}-){4}))[a-f0-9]{2}$/i
  return reg.test(mac)
}

/** 判断是否为 IPv4 地址 */
export const isIPv4 = (ip: string) => {
  const reg =
    /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/
  return reg.test(ip)
}

/** 判断是否为车牌（兼容新能源车牌） */
export const isLicensePlate = (str: string) => {
  const reg =
    /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/
  return reg.test(str)
}
```