<template>
  <div id="loading-bg">
    <div class="loading-logo">
      <img src="/mgm-primary.png" height="50" alt="Logo" />
    </div>
    <div class="loading">
      <div class="effect-1 effects"></div>
      <div class="effect-2 effects"></div>
      <div class="effect-3 effects"></div>
    </div>
  </div>
  <h3>Redirect...</h3>
</template>

<script lang="ts">
import CacheKey from '@/constants/cache-key'
import { IService } from '@/service/Index'
import { usePermissionStore } from '@/store/permission'
import { useUserStoreHook } from '@/store/user'
import { RouteRecordRaw } from 'vue-router'

export default {
  name: 'Profile',
  data () {
    return {
      claims: [] as any[]
    }
  },
  async created () {
    const idToken = await this.$auth.tokenManager.get('idToken')
    const accountId = this.authState.accessToken?.claims.uid as string
    const permissionStore = usePermissionStore()
    localStorage.setItem(CacheKey.OKTA_ID_TOKEN, JSON.stringify(idToken))
    localStorage.setItem(CacheKey.OKTA_AUTH_STATE, JSON.stringify(this.authState))
    console.log(this.authState);
    //@ts-ignore
    this.claims = Object.entries(idToken.claims).map(entry => ({ claim: entry[0], value: entry[1] }))
    try{
      await useUserStoreHook().oktaLogin(accountId,this.authState.accessToken?.accessToken!)
      permissionStore.dynamicRoutes.forEach((route: RouteRecordRaw) => {
        this.$router.addRoute(route)
      })
      this.$router.push({ path: "/" })
    }catch(e){
      console.log(e)
    }
  }
}
</script>

<style>
#loading-bg {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  block-size: 100%;
  inline-size: 100%;
  background-color: rgb(var( --v-theme-surface));
}

.loading-logo {
  position: absolute;
  inset-block-start: 40%;
  inset-inline-start: calc(50% - 55px);
  img{
    width: 80px;
    height: 80px;
  }
}

.loading {
  position: absolute;
  box-sizing: border-box;
  border: 3px solid transparent;
  block-size: 55px;
  border-radius: 50%;
  inline-size: 55px;
  inset-block-start: 50%;
  inset-inline-start: calc(50% - 45px);
}

.loading .effect-1,
.loading .effect-2,
.loading .effect-3 {
  position: absolute;
  box-sizing: border-box;
  border: 3px solid transparent;
  block-size: 100%;
  border-inline-start: 3px solid rgb(var(--v-theme-primary));
  border-radius: 50%;
  inline-size: 100%;
}

.loading .effect-1 {
  animation: rotate 1s ease infinite;
}

.loading .effect-2 {
  animation: rotate-opacity 1s ease infinite 0.1s;
}

.loading .effect-3 {
  animation: rotate-opacity 1s ease infinite 0.2s;
}

.loading .effects {
  transition: all 0.3s ease;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(1turn);
  }
}

@keyframes rotate-opacity {
  0% {
    opacity: 0.1;
    transform: rotate(0deg);
  }

  100% {
    opacity: 1;
    transform: rotate(1turn);
  }
}
</style>