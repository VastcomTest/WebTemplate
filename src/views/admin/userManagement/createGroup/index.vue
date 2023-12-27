<script setup lang='ts'>
import { toRefs, ref, watchEffect, onMounted} from 'vue';
import {useState , useProxyState } from '@/hooks/useState';
import { Group } from '@/models/group';
import { Upload } from "@element-plus/icons-vue"
import { IService } from '@/service/Index';
import { useShared } from '../shared';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';
import { PaginationData } from '@/hooks/usePagination'
import { User } from '@/models/user';
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { reactive } from 'vue';
import { create } from 'domain';
import { watch } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { computed } from 'vue';
import { DeviceEnum } from '@/constants/app-key';
interface indexProps {
  getTableData:()=>Promise<void>,
  paginationData:PaginationData
}
const { getTableData } = defineProps<indexProps>()
const { createDialogVisible } = storeToRefs(useShared())
const { activeName , currentRole} = useState({
  activeName:'groups',
  currentRole:'',
})
// ismobile
const appStore = useAppStore()
const { sidebar, device } = storeToRefs(appStore)
const isMobile = computed(() => device.value === DeviceEnum.Mobile)
const createTemp = reactive({
  username:'',
  email:'',
  firstName:'',
  lastName:'',
  chineseName:'',
  nickName:'',
  password:''
})

const rules = {
  username: { required },
  email: { email },
  firstName: { required },
  lastName: { required },
  password: { required },
}

const v$ = useVuelidate(rules,createTemp )

const submit = async ()=>{
  
  try {
    const isValid = await v$.value.$validate()
    if(!isValid){
      return
    }
    //@ts-ignore
    const { data } = await IService.userservice.createUser({
      ...createTemp,
    })
    ElMessage.success({
      message:"create user successfully"
    })
  } catch (error:any) {
    ElMessage.error({
      message:error
    })
  }
  createDialogVisible.value = false
  // get new data 
  await getTableData()
}

watch(createDialogVisible,(val)=>{
  if(!val){
    closeDialog()
  }
})

const closeDialog = ()=>{
  activeName.value = "first"
  currentRole.value = ""
  Object.keys(createTemp).forEach((key)=>{
    //@ts-ignore
    createTemp[key] = ''
  })
  createDialogVisible.value = false
}

onMounted(()=>{

})

</script>
<template>
  <v-dialog
    v-model="createDialogVisible"
    :width="isMobile ? '90%': '50%'"
    scrollable
  >
  <div class="dialog-container scrollbar" >
    <div class="header">
      <h2>Create User</h2>
      <v-btn color="primary" @click="closeDialog"  icon="mdi-close"></v-btn>
    </div>
    <v-card color="surface-container">
      <v-tabs
        fixed-tabs
        v-model="activeName"
        bg-color="surface-container"
      >
        <v-tab color="primary" style="max-width: 1000px;" value="Create">
          <v-icon size="x-large" style="margin-right: 10px;">mdi-form</v-icon>
          <div>Form</div>
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window  v-model="activeName">
          <v-window-item value="Create">
            <form >
              <v-text-field
                v-model="createTemp.username"
                :error-messages="v$.username.$errors.map((e:any) => e.$message)"
                required
                label="User Name"
              ></v-text-field>
              
              <v-text-field
                v-model="createTemp.email"
                required
                :error-messages="v$.email.$errors.map((e:any) => e.$message)"
                label="Email"
              ></v-text-field>

              <v-text-field
                v-model="createTemp.firstName"
                required
                :error-messages="v$.firstName.$errors.map((e:any) => e.$message)"
                label="First Name"
              ></v-text-field>

              <v-text-field
                v-model="createTemp.lastName"
                required
                :error-messages="v$.lastName.$errors.map((e:any) => e.$message)"
                label="Last Name"
              ></v-text-field>

              <v-text-field
                v-model="createTemp.chineseName"
                label="Chinese Name"
              ></v-text-field>

              <v-text-field
                v-model="createTemp.nickName"
                label="Nick Name"
              ></v-text-field>

              <v-text-field
                v-model="createTemp.password"
                required
                :error-messages="v$.password.$errors.map((e:any) => e.$message)"
                label="password"
              ></v-text-field>

              <div style="display: flex;justify-content: end;">
                <v-btn
                class="text-none"
                color="primary"
                rounded="xl"
                prependIcon="mdi-plus"
                @click="submit"
              >
                Create
              </v-btn>
              </div>
            </form>
          </v-window-item>

          <v-window-item value="groups">
            hello
          </v-window-item>
        </v-window>
      </v-card-text>
  </v-card>
  </div>
 </v-dialog> 
</template>

<style lang='scss' scoped>
</style>