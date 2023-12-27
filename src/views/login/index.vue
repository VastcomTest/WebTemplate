<script lang="ts" setup>
import { reactive, ref } from "vue"
import { RouteRecordRaw, useRouter } from "vue-router"
import { useUserStore } from "@/store/user"
import { type FormInstance, FormRules, ElMessage } from "element-plus"
import { User, Lock, Key, Picture, Loading } from "@element-plus/icons-vue"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import { getCurrentInstance } from "vue"
import { ComponentInternalInstance } from "vue"
import { IService } from "@/service/Index"
import logo from '/mgm-primary.png'
import useVuelidate from "@vuelidate/core"
import { required } from "@vuelidate/validators"
import { usePermissionStore } from "@/store/permission"
const router = useRouter()
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const loading = ref(false)
const loginFormData = reactive({
  username: "admin",
  password: "P@ssw0rd",
})
const rules = {
    username: { required },
    password: { required},
}
const v$ = useVuelidate(rules, loginFormData)
const isPasswordVisible = ref(false)
const permissionStore = usePermissionStore()
const handleLogin = async () => {
  const valid = await v$.value.$validate()
  if (valid) {
    loading.value = true
    useUserStore()
      .login(loginFormData)
      .then(() => {
        permissionStore.dynamicRoutes.forEach((route: RouteRecordRaw) => {
          router.addRoute(route)
        })
        router.push({ path: "/" })
      })
      .catch(() => {
        loginFormData.password = ""
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    ElMessage.error("username or password is wrong")
  }
}


const loginWithOkta = async ()=>{
  console.log(window.location.origin);
  
  await proxy?.$auth.signInWithRedirect({ originalUri: '/' })
  
}

</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
      :variant="'elevated'"
      elevation="16"
      style="border-radius: 20px;"
    >  
    <VCardItem style="margin-bottom: 20px;" class="justify-center">
        <template #prepend>
          <div style="display: flex;flex-direction: column;align-items: center;">
            <div>
              <img
              class="mr-2"
              :src="logo"
              alt="logo"
              width="64"
              height="64"
              
            />
          </div>
            <span class="font-weight-bold text-h4">VastComTech</span>
          </div>
        </template>

    </VCardItem>
      <VCardText>
        <form>
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
              required
                v-model="loginFormData.username"
                label="Email"
                type="email"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="loginFormData.password"
                label="Password"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- forget password  -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <a
                  class="ms-2 mb-1"
                  href="javascript:void(0)"
                >
                  Forgot Password?
                </a>
              </div>

              <!-- login button -->
              <VBtn
                block
                color="primary"
                style="border-radius: 5px;margin-bottom: 0px;"
                @click="handleLogin"
              >
                Local Login
              </VBtn>

              <!-- <VBtn
                block
                color="primary"
                style="border-radius: 5px;"
              >
                OKTA Login
              </VBtn> -->
            </VCol>

            <!-- create account -->
            <VCol
              cols="12"
              class="text-center text-base"
              color="primary"
              
            >
              <!-- <span style="cursor: pointer;">Create Account</span> -->
            </VCol>
            <VCol
              cols="12"
              class="d-flex align-center"
            >
              <VDivider />
              <span class="mx-4">V1.0.0</span>
              <VDivider />
            </VCol>

          </VRow>
        </form>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss" scoped>
.auth-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: rgb(var(--v-theme-surface));
}

.auth-footer-mask {
  position: absolute;
  inset-block-end: 0;
  min-inline-size: 100%;
}

.auth-card {
  z-index: 1 !important;
}

.auth-footer-start-tree,
.auth-footer-end-tree {
  position: absolute;
  z-index: 1;
}

.auth-footer-start-tree {
  inset-block-end: 0;
  inset-inline-start: 0;
}

.auth-footer-end-tree {
  inset-block-end: 0;
  inset-inline-end: 0;
}

.auth-illustration {
  z-index: 1;
}

.auth-logo {
  position: absolute;
  z-index: 1;
  inset-block-start: 2rem;
  inset-inline-start: 2.3rem;
}

.auth-bg {
  background-color: rgb(var(--v-theme-surface));
}

</style>
