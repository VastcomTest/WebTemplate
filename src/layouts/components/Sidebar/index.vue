<script lang="ts" setup>
import { computed ,watch} from "vue"
import { useRoute } from "vue-router"
import { storeToRefs } from "pinia"
import { useAppStore } from "@/store/app"
import { usePermissionStore } from "@/store/permission"
import { useSettingsStore } from "@/store/settings"
import SidebarItem from "./SidebarItem.vue"
import Logo from "../Logo/index.vue"
import { getCssVariableValue } from "@/utils"
import { DeviceEnum } from "@/constants/app-key"
import { sideBarDefaultExpandList } from '@/config/sidebar'
import { useState } from "@/hooks/useState"
import MGMLOGO from '/mgm-primary.png'
import { useTheme } from "vuetify"
import { onMounted } from "vue"
import { watchEffect } from "vue"
import { RouterLink } from "vue-router"
import ThemeSwitcher from "@/components/ThemeSwitch/index.vue"
import { ref } from "vue"
const sidebarWidth = getCssVariableValue("--v3-sidebar-width").replace("px","")
const sidebarWidthMobile = getCssVariableValue("--v3-sidebar-width-mobile").replace("px","")
const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()
const settingsStore = useSettingsStore()

const vuetifyTheme = useTheme()

const { sidebar, device } = storeToRefs(appStore)
const { layoutMode, showLogo } = storeToRefs(settingsStore)
const permissionStoreRefs = storeToRefs(permissionStore)


const { sidebarIndex, sidebarActiveName } = useState({
  sidebarIndex: 0,
  sidebarActiveName: 'Home'
})

const activeMenu = computed(() => {
  const {
    meta: { activeMenu },
    path
  } = route
  return activeMenu ? activeMenu : path
})


const isCollapse = computed(() => sidebar.value.opened)
const mobileIsCollapse = computed(() => sidebar.value.mobileIsCollapse)
const routes = computed(() => permissionStore.routes.filter(v=>!v.meta?.hidden) ) 
const isMobile = computed(() => device.value === DeviceEnum.Mobile)
const tipLineWidth = computed(() => {
  return layoutMode.value !== "top" ? "2px" : "0px"
})
const clickSideBar = (e: any) => {
  const flatRoutes = routes.value.flatMap(v=>v.children)
  let index = 0;
  for (let i = 0; i < flatRoutes.length; i++) {
    const element = flatRoutes[i];
    if(element?.name === e){
      index = i;
      break;
    }
  }
  sidebarIndex.value = index;
  sidebarActiveName.value = e;
  return index;
}

onMounted(()=>{

})

watchEffect(()=>{
  clickSideBar(route.name)
})

watch(mobileIsCollapse,(pre,next)=>{
  if(pre== next) return
  if(isMobile.value && !next){
    sidebar.value.zindex = 0
  }else{
    setTimeout(()=>{
      sidebar.value.zindex = 9999
    },300)
  }
},{
  deep: true
})



</script>

<template>
  <div style="height: 100%;width: auto;">
    
  <v-card v-if="!isMobile" style="height: 100%;">
    <v-navigation-drawer
      
      style="border: 0;transition: all 0.35s;background-color: rgb(var(--v-surface-container));z-index: 9999;"
      v-model="isCollapse"
      :width="sidebarWidth"
      :scrim="false"
      :absolute="false"
      permanent
    >
      <div v-if="routes.length!==0" style="padding: 20px;position: relative;height: 100%;display: flex;flex-direction: column;justify-content: space-between;">
        <div class="nav-container">
          <div class="logo">
            <img :src="MGMLOGO" />
            <h4>Membership Enrollment System</h4>
          </div>
          <v-divider/>
          <div class="side-bar" v-for="(route,i) in routes"  style="display: flex;flex-direction: column;">
            <div class="section-title"  >{{  route.meta?.sectionTitle }} </div>
            
            <div :class="{'active-nav': sidebarActiveName == routeLink.name}" @click="clickSideBar(routeLink.name)" class="section-nav" v-for="(routeLink,j) in route.children" >
              <router-link class="route-container" :to="route.path =='/' ? '/'+routeLink.path : route.path + '/'+routeLink.path">
                <v-icon :icon="routeLink.meta?.mdiIcon"></v-icon>
                <div class="title">{{ routeLink.name?.toString()  }}</div>
              </router-link>
            </div>
          </div>
        </div>
        <div class="bottom-container">
          <ThemeSwitcher/>
          <div class="version">Version: 1.0.0 DEV</div>
        </div>
      </div>
    </v-navigation-drawer>
  </v-card>
  <div  v-else style="height: 100%;">
    <v-layout style="height: 100%;">
      <v-navigation-drawer
        style="border: 0;transition: all 0.35s;padding: 0px;z-index: 10002;background-color: rgb(var(--v-surface-container));"
        v-model="sidebar.mobileIsCollapse"
        temporary
        :width="sidebarWidthMobile"
      >
      <div v-if="routes.length!==0" style="padding: 20px;position: relative;height: 100%;display: flex;flex-direction: column;justify-content: space-between;">
        <div class="nav-container">
          <div  class="logo">
            <img :src="MGMLOGO" />
            <h4 style="line-height:normal">Membership Enrollment System</h4>
          </div>
          <v-divider/>
          <div class="side-bar" v-for="(route,i) in routes"  style="display: flex;flex-direction: column;">
            <div class="section-title"  >{{  route.meta?.sectionTitle }} </div>
            
            <div :class="{'active-nav': sidebarActiveName == routeLink.name}" @click="clickSideBar(routeLink.name)" class="section-nav" v-for="(routeLink,j) in route.children" >
              <router-link class="route-container" :to="route.path =='/' ? '/'+routeLink.path : route.path + '/'+routeLink.path">
                <v-icon :icon="routeLink.meta?.mdiIcon"></v-icon>
                <div class="title">{{ routeLink.name?.toString()  }}</div>
              </router-link>
            </div>
          </div>
        </div>
        <div class="bottom-container">
          <ThemeSwitcher/>
          <div class="version">Version: 1.0.0 DEV</div>
        </div>
      </div>
      </v-navigation-drawer>
    </v-layout>
  </div>
  </div>
</template>

<style lang="scss" scoped>

.side-bar{
  //color: rgb(var(--v-theme-on-surface));
  color: rgb(var(--v-theme-on-surface));;
  .section-title{
    padding: 16px;
  }
  .active-nav{
    background-color: rgb(var(--v-theme-secondary-container));
    color: rgb(var(--v-theme-on-secondary-container));
    border-radius: 40px;
  }
  .section-nav{
    .route-container{
      display: flex;
      cursor: pointer;
      align-items: center;
      gap: 12px;
      align-self: stretch;
      padding: 16px;
      
      .title{
        transform: translateY(1px);
      }
    }
    
  }
}

.bottom-container{
  bottom: 0;
  width: calc(100% - 0px);
  padding-bottom: 0px;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  justify-content: center;
  .version{
    font-size: 14px;
    font-weight: 500;
  }
}

.active-nav{
  //background-color: rgb(var(--v-theme-secondary-container));
}

@mixin tip-line {
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: v-bind(tipLineWidth);
    height: 100%;
    background-color: var(--v3-sidebar-menu-tip-line-bg-color);
  }
}

.logo {
    display: flex;
    padding: 16px 6px;
    align-items: center;
    justify-content: center;
    gap: 10px;
    align-self: stretch;
    flex-shrink: 0;

    img {
        width: auto;
        height: 40px;
    }

    h4 {
        align-self: stretch;
        font-size: 15px;
        line-height: 40px;
    }
}



</style>
